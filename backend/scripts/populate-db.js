const { sequelize, User, Product } = require('../models');
const bcrypt = require('bcryptjs');

const dadosIniciais = {
  usuarios: [
    {
      nome: 'Administrador',
      email: 'admin@mercadinho.com',
      senha: 'admin123',
      tipo: 'admin'
    },
    {
      nome: 'Cliente Padrão',
      email: 'cliente@mercadinho.com',
      senha: 'cliente123',
      tipo: 'cliente'
    }
  ],
  produtos: [
    {
      nome: 'Maçã Vermelha',
      descricao: 'Maçã fresca e suculenta',
      preco: 2.50,
      categoria: 'Frutas',
      imagem: 'https://exemplo.com/maca.jpg',
      estoque: 100
    },
    {
      nome: 'Banana Prata',
      descricao: 'Banana madura e doce',
      preco: 3.00,
      categoria: 'Frutas',
      imagem: 'https://exemplo.com/banana.jpg',
      estoque: 80
    },
    {
      nome: 'Tomate Italiano',
      descricao: 'Tomate fresco para saladas',
      preco: 4.50,
      categoria: 'Legumes',
      imagem: 'https://exemplo.com/tomate.jpg',
      estoque: 50
    },
    {
      nome: 'Leite Integral',
      descricao: 'Leite fresco e nutritivo',
      preco: 5.00,
      categoria: 'Laticínios',
      imagem: 'https://exemplo.com/leite.jpg',
      estoque: 60
    },
    {
      nome: 'Frango Inteiro',
      descricao: 'Frango fresco de granja',
      preco: 15.00,
      categoria: 'Carnes',
      imagem: 'https://exemplo.com/frango.jpg',
      estoque: 30
    }
  ]
};

async function popularBancoDeDados() {
  try {
    // Sincronizar modelos
    await sequelize.sync({ force: true });
    console.log('🗑️  Banco de dados limpo');

    // Criar usuários
    for (const usuario of dadosIniciais.usuarios) {
      const salt = await bcrypt.genSalt(10);
      usuario.senha = await bcrypt.hash(usuario.senha, salt);
      await User.create(usuario);
    }
    console.log('👥 Usuários criados com sucesso');

    // Criar produtos
    await Product.bulkCreate(dadosIniciais.produtos);
    console.log('🛍️  Produtos criados com sucesso');

    console.log('✅ População do banco de dados concluída');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao popular banco de dados:', error);
    process.exit(1);
  }
}

popularBancoDeDados();
