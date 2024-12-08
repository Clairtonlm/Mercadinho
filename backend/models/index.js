const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME, 
  process.env.DB_USER, 
  process.env.DB_PASS, 
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT || 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

// Carregar modelos
const User = require('./user')(sequelize);
const Product = require('./product')(sequelize);
const Cart = require('./cart')(sequelize);

// Definir associações
User.hasMany(Product, { foreignKey: 'usuarioId', as: 'produtos' });
Product.belongsTo(User, { foreignKey: 'usuarioId', as: 'usuario' });

User.hasMany(Cart, { foreignKey: 'usuarioId', as: 'carrinhos' });
Cart.belongsTo(User, { foreignKey: 'usuarioId', as: 'usuario' });

module.exports = {
  sequelize,
  User,
  Product,
  Cart
};
