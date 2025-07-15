// Modelo para listas dentro dos quadros (lists)
const mongoose = require('mongoose');

// Schema da lista, representa uma coluna dentro de um quadro
const listSchema = new mongoose.Schema({
  // Referência ao quadro ao qual a lista pertence
  boardId: { type: mongoose.Schema.Types.ObjectId, ref: 'Board', required: true },
  // Nome da lista
  name: { type: String, required: true },
  // Posição da lista dentro do quadro (para ordenação)
  position: { type: Number, required: true }
});

// Exporta o modelo List
module.exports = mongoose.model('List', listSchema); 