// Modelo para os quadros (boards) do sistema
const mongoose = require('mongoose');

// Schema do quadro, representa um quadro criado por um usuário
const boardSchema = new mongoose.Schema({
  // Título do quadro
  title: { type: String, required: true },
  // Descrição opcional do quadro
  description: String,
  // Visibilidade do quadro (ex: público, privado)
  visibility: String,
  // Tipo de capa do quadro (ex: cor, imagem)
  cover_type: String,
  // Valor da capa (ex: código da cor ou URL da imagem)
  cover_value: String,
  // Referência ao usuário dono/criador do quadro
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  // Data de criação do quadro
  createdAt: { type: Date, default: Date.now }
});

// Exporta o modelo Board para ser usado em outras partes do sistema
module.exports = mongoose.model('Board', boardSchema); 