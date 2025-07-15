const express = require('express');
const router = express.Router();
const BoardMember = require('../models/BoardMember');
const User = require('../models/User');

// Adicionar um membro a um quadro
router.post('/', async (req, res) => {
  try {
    const { boardId, userId } = req.body;

    if (!boardId || !userId) {
      return res.status(400).json({ mensagem: 'boardId e userId são obrigatórios.' });
    }

    // Verifica se já existe esse membro no quadro
    const membroExistente = await BoardMember.findOne({ boardId, userId });
    if (membroExistente) {
      return res.status(400).json({ mensagem: 'Este usuário já é membro do quadro.' });
    }

    const novoMembro = new BoardMember({ boardId, userId });
    await novoMembro.save();

    res.status(201).json({ mensagem: 'Membro adicionado com sucesso.', membro: novoMembro });
  } catch (err) {
    res.status(500).json({ mensagem: 'Erro ao adicionar membro.', erro: err.message });
  }
});

// Listar membros de um quadro (com dados básicos do usuário)
router.get('/:boardId', async (req, res) => {
  try {
    const boardId = req.params.boardId;

    const membros = await BoardMember.find({ boardId }).populate('userId', 'nomeCompleto email');
    res.json(membros);
  } catch (err) {
    res.status(500).json({ mensagem: 'Erro ao buscar membros.', erro: err.message });
  }
});

module.exports = router;