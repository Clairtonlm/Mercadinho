require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const cartRoutes = require('./routes/cart');

const app = express();
const PORT = 3333;

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);

// Rota inicial
app.get('/', (req, res) => {
  res.json({ 
    message: 'Bem-vindo ao Mercadinho Dia Feliz API',
    status: 'online'
  });
});

// Conexão com o banco de dados
async function startServer() {
  try {
    await sequelize.sync();
    console.log('🚀 Banco de dados conectado com sucesso!');
    
    app.listen(PORT, () => {
      console.log(`🌐 Servidor rodando na porta ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Erro ao conectar com o banco de dados:', error);
    process.exit(1);
  }
}

startServer();
