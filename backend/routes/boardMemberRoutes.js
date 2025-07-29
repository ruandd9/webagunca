const express = require('express');
const router = express.Router();
const BoardMember = require('../models/BoardMember');

// Rota para adicionar um membro a um board
router.post('/', async (req, res) => {
  try {
    const { boardId, userId, role } = req.body;
    if (!boardId || !userId) {
      return res.status(400).json({ mensagem: 'boardId e userId são obrigatórios.' });
    }
    const novoMembro = new BoardMember({ boardId, userId, role });
    await novoMembro.save();
    res.status(201).json({ mensagem: 'Membro adicionado com sucesso!', boardMember: novoMembro });
  } catch (err) {
    res.status(500).json({ mensagem: 'Erro ao adicionar membro.', erro: err.message });
  }
});

// Rota para listar todos os membros de boards
router.get('/', async (req, res) => {
  try {
    const membros = await BoardMember.find();
    res.json(membros);
  } catch (err) {
    res.status(500).json({ mensagem: 'Erro ao buscar membros.', erro: err.message });
  }
});

module.exports = router;
