// Modelo para etiquetas (labels) dos cartões
const mongoose = require('mongoose');

// Schema da etiqueta, representa uma tag de cor e nome associada a um cartão
const cardLabelSchema = new mongoose.Schema({
  // Referência ao cartão
  cardId: { type: mongoose.Schema.Types.ObjectId, ref: 'Card', required: true },
  // Nome da etiqueta
  name: { type: String, required: true },
  // Cor da etiqueta (ex: #FF0000)
  color: { type: String, required: true }
});

// Exporta o modelo CardLabel
module.exports = mongoose.model('CardLabel', cardLabelSchema); 