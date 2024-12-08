const mongoose = require('mongoose');

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

module.exports = mongoose.model('Produto', ProdutoSchema);
