const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  // Usuário que receberá a notificação
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  // Tipo de notificação
  type: { 
    type: String, 
    required: true,
    enum: ['board_added', 'card_due_soon', 'card_mentioned', 'card_moved', 'list_created']
  },
  // Título da notificação
  title: { 
    type: String, 
    required: true 
  },
  // Mensagem da notificação
  message: { 
    type: String, 
    required: true 
  },
  // Se a notificação foi lida
  read: { 
    type: Boolean, 
    default: false 
  },
  // Dados relacionados à notificação (opcional)
  relatedData: {
    boardId: { type: mongoose.Schema.Types.ObjectId, ref: 'Board' },
    cardId: { type: mongoose.Schema.Types.ObjectId, ref: 'Card' },
    listId: String,
    mentionedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  // Data de criação
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Índice para melhorar performance nas consultas
notificationSchema.index({ userId: 1, read: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema); 