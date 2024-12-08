const express = require('express');
const { Product } = require('../models');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Simulação de carrinho em memória (substituir por banco de dados em produção)
const carrinhos = {};

// Adicionar item ao carrinho
router.post('/adicionar', authMiddleware.cliente, async (req, res) => {
  try {
    const { produtoId, quantidade } = req.body;
    const usuarioId = req.usuarioId;

    const produto = await Product.findByPk(produtoId);
    
    if (!produto) {
      return res.status(404).json({ mensagem: 'Produto não encontrado' });
    }

    if (quantidade > produto.estoque) {
      return res.status(400).json({ 
        mensagem: 'Quantidade solicitada maior que o estoque disponível' 
      });
    }

    if (!carrinhos[usuarioId]) {
      carrinhos[usuarioId] = [];
    }

    const itemExistente = carrinhos[usuarioId].find(item => item.produtoId === produtoId);

    if (itemExistente) {
      itemExistente.quantidade += quantidade;
    } else {
      carrinhos[usuarioId].push({
        produtoId,
        nome: produto.nome,
        preco: produto.preco,
        quantidade
      });
    }

    res.json({
      mensagem: 'Item adicionado ao carrinho',
      carrinho: carrinhos[usuarioId]
    });
  } catch (error) {
    res.status(500).json({ 
      mensagem: 'Erro ao adicionar item ao carrinho', 
      erro: error.message 
    });
  }
});

// Remover item do carrinho
router.delete('/remover/:produtoId', authMiddleware.cliente, (req, res) => {
  try {
    const produtoId = req.params.produtoId;
    const usuarioId = req.usuarioId;

    if (!carrinhos[usuarioId]) {
      return res.status(404).json({ mensagem: 'Carrinho não encontrado' });
    }

    carrinhos[usuarioId] = carrinhos[usuarioId].filter(
      item => item.produtoId !== produtoId
    );

    res.json({
      mensagem: 'Item removido do carrinho',
      carrinho: carrinhos[usuarioId]
    });
  } catch (error) {
    res.status(500).json({ 
      mensagem: 'Erro ao remover item do carrinho', 
      erro: error.message 
    });
  }
});

// Visualizar carrinho
router.get('/', authMiddleware.cliente, (req, res) => {
  const usuarioId = req.usuarioId;

  const carrinho = carrinhos[usuarioId] || [];
  const total = carrinho.reduce(
    (acc, item) => acc + (item.preco * item.quantidade), 
    0
  );

  res.json({
    carrinho,
    total
  });
});

// Finalizar compra
router.post('/finalizar', authMiddleware.cliente, async (req, res) => {
  try {
    const usuarioId = req.usuarioId;
    const carrinho = carrinhos[usuarioId];

    if (!carrinho || carrinho.length === 0) {
      return res.status(400).json({ mensagem: 'Carrinho vazio' });
    }

    // Verificar estoque e atualizar
    for (const item of carrinho) {
      const produto = await Product.findByPk(item.produtoId);
      
      if (produto.estoque < item.quantidade) {
        return res.status(400).json({ 
          mensagem: `Estoque insuficiente para o produto ${produto.nome}` 
        });
      }

      // Atualizar estoque (em um cenário real, usar transação)
      await produto.decrement('estoque', { by: item.quantidade });
    }

    // Limpar carrinho após compra
    carrinhos[usuarioId] = [];

    res.json({
      mensagem: 'Compra finalizada com sucesso',
      total: req.body.total
    });
  } catch (error) {
    res.status(500).json({ 
      mensagem: 'Erro ao finalizar compra', 
      erro: error.message 
    });
  }
});

module.exports = router;
