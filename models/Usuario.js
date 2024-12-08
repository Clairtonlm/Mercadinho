const mongoose = require('mongoose');

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

module.exports = mongoose.model('Usuario', UsuarioSchema);
