const mongoose = require('mongoose');
require('dotenv').config({ path: '../.env' });

// Conectar ao MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: 'mercadinho'
});

// Modelos
const Categoria = mongoose.model('Categoria', new mongoose.Schema({
  nome: { type: String, required: true }
}));

const Produto = mongoose.model('Produto', new mongoose.Schema({
  nome: { type: String, required: true },
  descricao: { type: String, required: true },
  preco: { type: Number, required: true },
  imagem: { type: String, default: 'https://via.placeholder.com/300' },
  estoque: { type: Number, default: 100 },
  categoria: { type: mongoose.Schema.Types.ObjectId, ref: 'Categoria' },
  emDestaque: { type: Boolean, default: false }
}));

const Usuario = mongoose.model('Usuario', new mongoose.Schema({
  nome: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  senha: { type: String, required: true },
  tipo: { type: String, enum: ['cliente', 'admin'], default: 'cliente' }
}));

// Função para popular banco de dados
async function popularBanco() {
  try {
    // Limpar coleções existentes
    await Categoria.deleteMany({});
    await Produto.deleteMany({});
    await Usuario.deleteMany({});

    // Criar categorias
    const categorias = await Categoria.create([
      { nome: 'Grãos' },
      { nome: 'Laticínios' },
      { nome: 'Bebidas' },
      { nome: 'Hortifruti' },
      { nome: 'Padaria' }
    ]);

    // Criar produtos
    const produtos = await Produto.create([
      {
        nome: 'Arroz Tipo 1',
        descricao: 'Arroz branco de alta qualidade',
        preco: 25.50,
        categoria: categorias[0]._id,
        emDestaque: true,
        imagem: 'https://via.placeholder.com/300?text=Arroz'
      },
      {
        nome: 'Leite Integral',
        descricao: 'Leite fresco e nutritivo',
        preco: 5.99,
        categoria: categorias[1]._id,
        emDestaque: true,
        imagem: 'https://via.placeholder.com/300?text=Leite'
      },
      {
        nome: 'Coca-Cola',
        descricao: 'Refrigerante tradicional',
        preco: 7.50,
        categoria: categorias[2]._id,
        emDestaque: true,
        imagem: 'https://via.placeholder.com/300?text=Coca-Cola'
      },
      {
        nome: 'Banana Prata',
        descricao: 'Banana fresca e madura',
        preco: 4.99,
        categoria: categorias[3]._id,
        emDestaque: true,
        imagem: 'https://via.placeholder.com/300?text=Banana'
      },
      {
        nome: 'Pão Francês',
        descricao: 'Pão fresco do dia',
        preco: 1.50,
        categoria: categorias[4]._id,
        emDestaque: true,
        imagem: 'https://via.placeholder.com/300?text=Pão'
      }
    ]);

    // Criar usuário admin
    await Usuario.create({
      nome: 'Admin Mercadinho',
      email: 'admin@mercadinho.com',
      senha: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // senha: 'password123'
      tipo: 'admin'
    });

    // Criar usuário cliente
    await Usuario.create({
      nome: 'Cliente Mercadinho',
      email: 'cliente@mercadinho.com',
      senha: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // senha: 'password123'
      tipo: 'cliente'
    });

    console.log(' Banco de dados populado com sucesso!');
    process.exit(0);
  } catch (erro) {
    console.error('Erro ao popular banco de dados:', erro);
    process.exit(1);
  }
}

// Executar população
popularBanco();
