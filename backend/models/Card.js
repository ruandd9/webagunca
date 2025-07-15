// Modelo para cartões (cards) dentro das listas
const mongoose = require('mongoose');

// Schema do cartão, representa uma tarefa ou item dentro de uma lista
const cardSchema = new mongoose.Schema({
  // Referência ao quadro
  boardId: { type: mongoose.Schema.Types.ObjectId, ref: 'Board', required: true },
  // Referência à lista
  listId: { type: mongoose.Schema.Types.ObjectId, ref: 'List', required: true },
  // Título do cartão
  title: { type: String, required: true },
  // Descrição do cartão
  description: String,
  // Data de entrega (opcional)
  dueDate: Date,
  // Status de conclusão
  completed: { type: Boolean, default: false },
  // Usuário que criou o cartão
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  // Data de criação
  createdAt: { type: Date, default: Date.now },
  // Data da última atualização
  updatedAt: { type: Date, default: Date.now }
});

// Exporta o modelo Card
module.exports = mongoose.model('Card', cardSchema); 