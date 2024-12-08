const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'sua_chave_secreta_temporaria';

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Conexão com MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: 'mercadinho' // Especificar o nome do banco de dados
})
.then(() => {
  console.log(' Conexão com MongoDB Atlas estabelecida com sucesso!');
})
.catch((erro) => {
  console.error(' Erro ao conectar com MongoDB Atlas:', erro);
  process.exit(1); // Encerrar aplicação em caso de falha de conexão
});

// Modelo de Usuário
const UsuarioSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  senha: { type: String, required: true },
  tipo: { type: String, enum: ['cliente', 'admin'], default: 'cliente' },
  endereco: {
    rua: String,
    numero: String,
    complemento: String,
    cidade: String,
    estado: String,
    cep: String
  },
  dataCadastro: { type: Date, default: Date.now }
});

const Usuario = mongoose.model('Usuario', UsuarioSchema);

// Modelo de Produto
const ProdutoSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  categoria: { type: String, required: true },
  preco: { type: Number, required: true },
  quantidade: { type: Number, default: 0 },
  descricao: { type: String },
  imagem: { type: String },
  disponivel: { type: Boolean, default: true },
  promocao: {
    ativo: { type: Boolean, default: false },
    desconto: { type: Number, default: 0 }
  }
});

const Produto = mongoose.model('Produto', ProdutoSchema);

// Modelo de Pedido
const PedidoSchema = new mongoose.Schema({
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  produtos: [{
    produto: { type: mongoose.Schema.Types.ObjectId, ref: 'Produto' },
    quantidade: { type: Number, required: true },
    precoUnitario: { type: Number, required: true }
  }],
  valorTotal: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['pendente', 'processando', 'enviado', 'entregue', 'cancelado'], 
    default: 'pendente' 
  },
  dataPedido: { type: Date, default: Date.now }
});

const Pedido = mongoose.model('Pedido', PedidoSchema);

// Modelo de Categoria
const CategoriaSchema = new mongoose.Schema({
  nome: { type: String, required: true }
});

const Categoria = mongoose.model('Categoria', CategoriaSchema);

// Modelo de Carrinho
const CarrinhoSchema = new mongoose.Schema({
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  produtos: [{
    produto: { type: mongoose.Schema.Types.ObjectId, ref: 'Produto' },
    quantidade: { type: Number, required: true },
    precoUnitario: { type: Number, required: true }
  }]
});

const Carrinho = mongoose.model('Carrinho', CarrinhoSchema);

// Middleware de Autenticação
const autenticarToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, usuario) => {
    if (err) return res.sendStatus(403);
    req.usuario = usuario;
    next();
  });
};

// Middleware de Autorização de Admin
const autorizarAdmin = (req, res, next) => {
  if (req.usuario.tipo !== 'admin') {
    return res.status(403).json({ mensagem: 'Acesso negado. Requer permissão de administrador.' });
  }
  next();
};

// Rotas de Autenticação
app.post('/registro', async (req, res) => {
  try {
    const { nome, email, senha, endereco } = req.body;

    const usuarioExistente = await Usuario.findOne({ email });
    if (usuarioExistente) {
      return res.status(400).json({ mensagem: 'Usuário já cadastrado' });
    }

    const salt = await bcrypt.genSalt(10);
    const senhaHash = await bcrypt.hash(senha, salt);

    const novoUsuario = new Usuario({
      nome,
      email,
      senha: senhaHash,
      endereco,
      tipo: 'cliente'
    });

    await novoUsuario.save();

    res.status(201).json({ 
      mensagem: 'Usuário cadastrado com sucesso', 
      usuario: { 
        id: novoUsuario._id, 
        nome: novoUsuario.nome, 
        email: novoUsuario.email 
      } 
    });
  } catch (err) {
    res.status(500).json({ mensagem: 'Erro ao registrar usuário', erro: err.message });
  }
});

app.post('/login', async (req, res) => {
  try {
    const { email, senha } = req.body;

    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(400).json({ mensagem: 'Usuário não encontrado' });
    }

    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
    if (!senhaCorreta) {
      return res.status(400).json({ mensagem: 'Senha incorreta' });
    }

    const token = jwt.sign(
      { id: usuario._id, email: usuario.email, tipo: usuario.tipo }, 
      JWT_SECRET, 
      { expiresIn: '24h' }
    );

    res.json({ 
      mensagem: 'Login bem-sucedido', 
      token, 
      usuario: { 
        id: usuario._id, 
        nome: usuario.nome, 
        email: usuario.email,
        tipo: usuario.tipo 
      } 
    });
  } catch (err) {
    res.status(500).json({ mensagem: 'Erro no login', erro: err.message });
  }
});

// Rotas de Produtos (Públicas)
app.get('/produtos/vitrine', async (req, res) => {
  try {
    const produtos = await Produto.find({ disponivel: true, quantidade: { $gt: 0 } });
    res.json(produtos);
  } catch (err) {
    res.status(500).json({ mensagem: 'Erro ao buscar produtos', erro: err });
  }
});

// Rotas de Produtos (Protegidas - Admin)
app.get('/produtos', autenticarToken, autorizarAdmin, async (req, res) => {
  try {
    const produtos = await Produto.find();
    res.json(produtos);
  } catch (err) {
    res.status(500).json({ mensagem: 'Erro ao buscar produtos', erro: err });
  }
});

app.post('/produtos', autenticarToken, autorizarAdmin, async (req, res) => {
  try {
    const novoProduto = new Produto(req.body);
    await novoProduto.save();
    res.status(201).json(novoProduto);
  } catch (err) {
    res.status(400).json({ mensagem: 'Erro ao criar produto', erro: err });
  }
});

app.put('/produtos/:id', autenticarToken, autorizarAdmin, async (req, res) => {
  try {
    const produtoAtualizado = await Produto.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true }
    );
    res.json(produtoAtualizado);
  } catch (err) {
    res.status(400).json({ mensagem: 'Erro ao atualizar produto', erro: err });
  }
});

app.delete('/produtos/:id', autenticarToken, autorizarAdmin, async (req, res) => {
  try {
    await Produto.findByIdAndDelete(req.params.id);
    res.json({ mensagem: 'Produto removido com sucesso' });
  } catch (err) {
    res.status(400).json({ mensagem: 'Erro ao remover produto', erro: err });
  }
});

// Rotas de Pedidos
app.post('/pedidos', autenticarToken, async (req, res) => {
  try {
    const { produtos } = req.body;

    // Validar disponibilidade dos produtos
    for (let item of produtos) {
      const produto = await Produto.findById(item.produto);
      if (!produto || produto.quantidade < item.quantidade) {
        return res.status(400).json({ 
          mensagem: `Produto ${produto.nome} sem estoque suficiente` 
        });
      }
    }

    // Calcular valor total
    const pedidosProdutos = await Promise.all(
      produtos.map(async (item) => {
        const produto = await Produto.findById(item.produto);
        return {
          produto: item.produto,
          quantidade: item.quantidade,
          precoUnitario: produto.preco
        };
      })
    );

    const valorTotal = pedidosProdutos.reduce(
      (total, item) => total + (item.precoUnitario * item.quantidade), 
      0
    );

    // Criar pedido
    const novoPedido = new Pedido({
      usuario: req.usuario.id,
      produtos: pedidosProdutos,
      valorTotal
    });

    await novoPedido.save();

    // Atualizar estoque
    for (let item of pedidosProdutos) {
      await Produto.findByIdAndUpdate(
        item.produto, 
        { $inc: { quantidade: -item.quantidade } }
      );
    }

    res.status(201).json(novoPedido);
  } catch (err) {
    res.status(500).json({ mensagem: 'Erro ao criar pedido', erro: err.message });
  }
});

app.get('/pedidos', autenticarToken, async (req, res) => {
  try {
    const pedidos = req.usuario.tipo === 'admin' 
      ? await Pedido.find().populate('usuario').populate('produtos.produto')
      : await Pedido.find({ usuario: req.usuario.id }).populate('produtos.produto');
    
    res.json(pedidos);
  } catch (err) {
    res.status(500).json({ mensagem: 'Erro ao buscar pedidos', erro: err.message });
  }
});

// Rota para obter categorias
app.get('/categorias', async (req, res) => {
  try {
    const categorias = await Categoria.aggregate([
      {
        $lookup: {
          from: 'produtos',
          localField: '_id',
          foreignField: 'categoria',
          as: 'produtos'
        }
      },
      {
        $addFields: {
          quantidadeProdutos: { $size: '$produtos' }
        }
      },
      {
        $project: {
          nome: 1,
          quantidadeProdutos: 1
        }
      }
    ]);

    res.json(categorias);
  } catch (erro) {
    console.error('Erro ao buscar categorias:', erro);
    res.status(500).json({ mensagem: 'Erro ao buscar categorias' });
  }
});

// Rota para obter produtos em destaque
app.get('/produtos/destaque', async (req, res) => {
  try {
    const produtosDestaque = await Produto.find({ emDestaque: true })
      .populate('categoria', 'nome')
      .limit(6);

    res.json(produtosDestaque);
  } catch (erro) {
    console.error('Erro ao buscar produtos em destaque:', erro);
    res.status(500).json({ mensagem: 'Erro ao buscar produtos em destaque' });
  }
});

// Rota para adicionar produto ao carrinho
app.post('/carrinho/adicionar', autenticarToken, async (req, res) => {
  try {
    const { produtoId, quantidade } = req.body;
    const usuario = req.usuario;

    // Buscar o produto
    const produto = await Produto.findById(produtoId);
    if (!produto) {
      return res.status(404).json({ mensagem: 'Produto não encontrado' });
    }

    // Verificar estoque
    if (produto.estoque < quantidade) {
      return res.status(400).json({ mensagem: 'Quantidade indisponível em estoque' });
    }

    // Buscar ou criar carrinho do usuário
    let carrinho = await Carrinho.findOne({ usuario: usuario._id });
    if (!carrinho) {
      carrinho = new Carrinho({ 
        usuario: usuario._id, 
        produtos: [] 
      });
    }

    // Verificar se produto já está no carrinho
    const itemExistente = carrinho.produtos.find(
      item => item.produto.toString() === produtoId
    );

    if (itemExistente) {
      itemExistente.quantidade += quantidade;
    } else {
      carrinho.produtos.push({
        produto: produtoId,
        quantidade: quantidade,
        precoUnitario: produto.preco
      });
    }

    // Salvar carrinho
    await carrinho.save();

    res.status(200).json({ 
      mensagem: 'Produto adicionado ao carrinho', 
      carrinho: carrinho 
    });
  } catch (erro) {
    console.error('Erro ao adicionar produto ao carrinho:', erro);
    res.status(500).json({ mensagem: 'Erro ao adicionar produto ao carrinho' });
  }
});

// Servir arquivos estáticos e definir rota inicial
app.use(express.static('.')); // Serve todos os arquivos estáticos do diretório raiz

// Rota inicial
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'loja.html'));
});

// Rotas para dashboards
app.get('/dashboard-admin.html', autenticarToken, (req, res) => {
    if (req.usuario.tipo !== 'admin') {
        return res.status(403).json({ mensagem: 'Acesso negado' });
    }
    res.sendFile(path.join(__dirname, 'dashboard-admin.html'));
});

app.get('/dashboard-cliente.html', autenticarToken, (req, res) => {
    if (req.usuario.tipo !== 'cliente') {
        return res.status(403).json({ mensagem: 'Acesso negado' });
    }
    res.sendFile(path.join(__dirname, 'dashboard-cliente.html'));
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
