const express = require('express');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const router = express.Router();

// Registro de usuário
router.post('/registro', async (req, res) => {
  try {
    const { nome, email, senha } = req.body;
    
    // Verificar se usuário já existe
    const usuarioExistente = await User.findOne({ where: { email } });
    if (usuarioExistente) {
      return res.status(400).json({ mensagem: 'Usuário já cadastrado' });
    }

    // Criar novo usuário
    const novoUsuario = await User.create({ nome, email, senha });

    // Gerar token JWT
    const token = jwt.sign(
      { id: novoUsuario.id, email: novoUsuario.email }, 
      process.env.JWT_SECRET, 
      { expiresIn: '24h' }
    );

    res.status(201).json({ 
      mensagem: 'Usuário criado com sucesso', 
      token 
    });
  } catch (error) {
    res.status(500).json({ mensagem: 'Erro no registro', erro: error.message });
  }
});

// Login de usuário
router.post('/login', async (req, res) => {
  try {
    const { email, senha } = req.body;

    // Buscar usuário
    const usuario = await User.findOne({ where: { email } });
    if (!usuario) {
      return res.status(401).json({ mensagem: 'Credenciais inválidas' });
    }

    // Validar senha
    const senhaValida = await usuario.validarSenha(senha);
    if (!senhaValida) {
      return res.status(401).json({ mensagem: 'Credenciais inválidas' });
    }

    // Gerar token JWT
    const token = jwt.sign(
      { 
        id: usuario.id, 
        email: usuario.email,
        tipo: usuario.tipo 
      }, 
      process.env.JWT_SECRET, 
      { expiresIn: '24h' }
    );

    res.json({ 
      mensagem: 'Login realizado com sucesso', 
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        tipo: usuario.tipo
      }
    });
  } catch (error) {
    res.status(500).json({ mensagem: 'Erro no login', erro: error.message });
  }
});

module.exports = router;
