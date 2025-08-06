const mongoose = require('mongoose');

// Schema do chat vinculado a um board
const chatSchema = new mongoose.Schema({
  // Referência ao board
  boardId: { type: mongoose.Schema.Types.ObjectId, ref: 'Board', required: true },
  // Nome do chat (padrão baseado no board)
  name: { type: String, default: 'Chat do Board' },
  // Status do chat
  isActive: { type: Boolean, default: true },
  // Data de criação
  createdAt: { type: Date, default: Date.now },
  // Última atividade no chat
  lastActivity: { type: Date, default: Date.now }
});

// Índice para otimizar consultas por boardId
chatSchema.index({ boardId: 1 });

module.exports = mongoose.model('Chat', chatSchema);