const mongoose = require('mongoose');

// Schema das mensagens do chat
const chatMessageSchema = new mongoose.Schema({
  // Referência ao chat
  chatId: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat', required: true },
  // Referência ao usuário que enviou a mensagem
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  // Conteúdo da mensagem
  content: { type: String, required: true },
  // Tipo da mensagem
  messageType: { type: String, enum: ['text', 'file', 'system'], default: 'text' },
  // Data de criação
  createdAt: { type: Date, default: Date.now },
  // Data de edição (se aplicável)
  editedAt: { type: Date },
  // Flag para mensagens deletadas
  isDeleted: { type: Boolean, default: false }
});

// Índices para otimizar consultas
chatMessageSchema.index({ chatId: 1, createdAt: -1 });
chatMessageSchema.index({ senderId: 1 });

module.exports = mongoose.model('ChatMessage', chatMessageSchema);