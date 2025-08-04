const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const BoardMember = require('../models/BoardMember');
const Card = require('../models/Card');
const Board = require('../models/Board');
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');

// Rota para listar notificações do usuário
router.get('/', protect, async (req, res) => {
  try {
    const { page = 1, limit = 20, filter = 'all' } = req.query;
    const skip = (page - 1) * limit;
    
    let query = { userId: req.user._id };
    
    // Aplicar filtros
    switch(filter) {
      case 'unread':
        query.read = false;
        break;
      case 'mentions':
        query.type = 'card_mentioned';
        break;
      case 'board_added':
        query.type = 'board_added';
        break;
      case 'card_due_soon':
        query.type = 'card_due_soon';
        break;
    }
    
    const notifications = await Notification.find(query)
      .populate('relatedData.boardId', 'title')
      .populate('relatedData.cardId', 'title')
      .populate('relatedData.mentionedBy', 'nomeCompleto')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await Notification.countDocuments(query);
    
    res.json({
      notifications,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalNotifications: total,
        hasMore: skip + notifications.length < total
      }
    });
  } catch (err) {
    res.status(500).json({ mensagem: 'Erro ao buscar notificações.', erro: err.message });
  }
});

// Rota para marcar notificação como lida
router.patch('/:id/read', protect, async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { read: true },
      { new: true }
    );
    
    if (!notification) {
      return res.status(404).json({ mensagem: 'Notificação não encontrada.' });
    }
    
    res.json({ mensagem: 'Notificação marcada como lida.', notification });
  } catch (err) {
    res.status(500).json({ mensagem: 'Erro ao marcar notificação como lida.', erro: err.message });
  }
});

// Rota para marcar todas as notificações como lidas
router.patch('/read-all', protect, async (req, res) => {
  try {
    await Notification.updateMany(
      { userId: req.user._id, read: false },
      { read: true }
    );
    
    res.json({ mensagem: 'Todas as notificações foram marcadas como lidas.' });
  } catch (err) {
    res.status(500).json({ mensagem: 'Erro ao marcar notificações como lidas.', erro: err.message });
  }
});

// Rota para obter contagem de notificações não lidas
router.get('/unread-count', protect, async (req, res) => {
  try {
    const count = await Notification.countDocuments({ 
      userId: req.user._id, 
      read: false 
    });
    
    res.json({ unreadCount: count });
  } catch (err) {
    res.status(500).json({ mensagem: 'Erro ao contar notificações não lidas.', erro: err.message });
  }
});

// Rota para deletar uma notificação
router.delete('/:id', protect, async (req, res) => {
  try {
    const notification = await Notification.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });
    
    if (!notification) {
      return res.status(404).json({ mensagem: 'Notificação não encontrada.' });
    }
    
    res.json({ mensagem: 'Notificação deletada com sucesso.' });
  } catch (err) {
    res.status(500).json({ mensagem: 'Erro ao deletar notificação.', erro: err.message });
  }
});

// Função utilitária para criar notificação (usada por outras rotas)
const createNotification = async (userId, type, title, message, relatedData = {}) => {
  try {
    const notification = new Notification({
      userId,
      type,
      title,
      message,
      relatedData
    });
    
    await notification.save();
    return notification;
  } catch (err) {
    console.error('Erro ao criar notificação:', err);
  }
};

// Exportar a função para uso em outras rotas
module.exports = { router, createNotification }; 