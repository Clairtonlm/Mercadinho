const express = require('express');
const { Product } = require('../models');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Listar todos os produtos
router.get('/', async (req, res) => {
  try {
    const { categoria, page = 1, limit = 10 } = req.query;
    
    const options = {
      limit: Number(limit),
      offset: (page - 1) * limit,
      order: [['createdAt', 'DESC']]
    };

    if (categoria) {
      options.where = { categoria };
    }

    const { count, rows: produtos } = await Product.findAndCountAll(options);

    res.json({
      total: count,
      pagina: Number(page),
      totalPaginas: Math.ceil(count / limit),
      produtos
    });
  } catch (error) {
    res.status(500).json({ 
      mensagem: 'Erro ao buscar produtos', 
      erro: error.message 
    });
  }
});

// Detalhes de um produto
router.get('/:id', async (req, res) => {
  try {
    const produto = await Product.findByPk(req.params.id);
    
    if (!produto) {
      return res.status(404).json({ mensagem: 'Produto não encontrado' });
    }

    res.json(produto);
  } catch (error) {
    res.status(500).json({ 
      mensagem: 'Erro ao buscar produto', 
      erro: error.message 
    });
  }
});

// Criar novo produto (somente admin)
router.post('/', authMiddleware.admin, async (req, res) => {
  try {
    const { nome, descricao, preco, categoria, imagem, estoque } = req.body;

    const novoProduto = await Product.create({
      nome, 
      descricao, 
      preco, 
      categoria, 
      imagem, 
      estoque
    });

    res.status(201).json({
      mensagem: 'Produto criado com sucesso',
      produto: novoProduto
    });
  } catch (error) {
    res.status(400).json({ 
      mensagem: 'Erro ao criar produto', 
      erro: error.message 
    });
  }
});

// Atualizar produto (somente admin)
router.put('/:id', authMiddleware.admin, async (req, res) => {
  try {
    const { nome, descricao, preco, categoria, imagem, estoque } = req.body;
    
    const produto = await Product.findByPk(req.params.id);
    
    if (!produto) {
      return res.status(404).json({ mensagem: 'Produto não encontrado' });
    }

    await produto.update({
      nome, 
      descricao, 
      preco, 
      categoria, 
      imagem, 
      estoque
    });

    res.json({
      mensagem: 'Produto atualizado com sucesso',
      produto
    });
  } catch (error) {
    res.status(400).json({ 
      mensagem: 'Erro ao atualizar produto', 
      erro: error.message 
    });
  }
});

// Remover produto (somente admin)
router.delete('/:id', authMiddleware.admin, async (req, res) => {
  try {
    const produto = await Product.findByPk(req.params.id);
    
    if (!produto) {
      return res.status(404).json({ mensagem: 'Produto não encontrado' });
    }

    await produto.destroy();

    res.json({ mensagem: 'Produto removido com sucesso' });
  } catch (error) {
    res.status(500).json({ 
      mensagem: 'Erro ao remover produto', 
      erro: error.message 
    });
  }
});

module.exports = router;
