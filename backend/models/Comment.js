// Modelo para comentários nos cartões
const mongoose = require('mongoose');

// Schema do comentário, representa um comentário feito por um usuário em um cartão
const commentSchema = new mongoose.Schema({
  // Referência ao cartão comentado
  cardId: { type: mongoose.Schema.Types.ObjectId, ref: 'Card', required: true },
  // Referência ao usuário que fez o comentário
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  // Texto do comentário
  text: { type: String, required: true },
  // Data de criação do comentário
  createdAt: { type: Date, default: Date.now }
});

// Exporta o modelo Comment
module.exports = mongoose.model('Comment', commentSchema); 