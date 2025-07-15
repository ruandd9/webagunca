// Modelo para membros de quadros (board members)
const mongoose = require('mongoose');

// Schema que representa a associação de um usuário a um quadro
const boardMemberSchema = new mongoose.Schema({
  // Referência ao quadro
  boardId: { type: mongoose.Schema.Types.ObjectId, ref: 'Board', required: true },
  // Referência ao usuário membro
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

// Exporta o modelo BoardMember
module.exports = mongoose.model('BoardMember', boardMemberSchema); 