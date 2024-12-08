const jwt = require('jsonwebtoken');
const { User } = require('../models');

const authMiddleware = {
  // Middleware para verificar token de autenticação
  async verificarToken(req, res, next) {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader) {
        return res.status(401).json({ mensagem: 'Token não fornecido' });
      }

      const [, token] = authHeader.split(' ');

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      const usuario = await User.findByPk(decoded.id);
      
      if (!usuario) {
        return res.status(401).json({ mensagem: 'Usuário não encontrado' });
      }

      req.usuarioId = usuario.id;
      req.usuarioTipo = usuario.tipo;

      next();
    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ mensagem: 'Token inválido' });
      }
      
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ mensagem: 'Token expirado' });
      }

      res.status(500).json({ 
        mensagem: 'Erro de autenticação', 
        erro: error.message 
      });
    }
  },

  // Middleware para verificar se o usuário é admin
  admin(req, res, next) {
    authMiddleware.verificarToken(req, res, () => {
      if (req.usuarioTipo !== 'admin') {
        return res.status(403).json({ 
          mensagem: 'Acesso negado. Requer permissão de administrador' 
        });
      }
      next();
    });
  },

  // Middleware para verificar se o usuário é cliente ou admin
  cliente(req, res, next) {
    authMiddleware.verificarToken(req, res, () => {
      if (req.usuarioTipo !== 'cliente' && req.usuarioTipo !== 'admin') {
        return res.status(403).json({ 
          mensagem: 'Acesso negado. Requer autenticação de cliente' 
        });
      }
      next();
    });
  }
};

module.exports = authMiddleware;
