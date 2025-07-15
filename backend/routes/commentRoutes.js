const express = require('express');
const router = express.Router();
const Comment = require('../models/Coments'); // Verifique o nome do arquivo
const User = require('../models/User');

// Adicionar comentário a um cartão
router.post('/', async (req, res) => {
  try {
    const { cardId, userId, text } = req.body;

    if (!cardId || !userId || !text) {
      return res.status(400).json({ mensagem: 'Campos obrigatórios: cardId, userId e text.' });
    }

    const novoComentario = new Comment({ cardId, userId, text });
    const salvo = await novoComentario.save();

    res.status(201).json({ mensagem: 'Comentário adicionado com sucesso.', comentario: salvo });
  } catch (err) {
    res.status(500).json({ mensagem: 'Erro ao adicionar comentário.', erro: err.message });
  }
});

// Listar comentários de um cartão (com nome e email do usuário)
router.get('/:cardId', async (req, res) => {
  try {
    const comentarios = await Comment.find({ cardId: req.params.cardId })
      .sort({ createdAt: -1 })
      .populate('userId', 'nomeCompleto email');

    res.json(comentarios);
  } catch (err) {
    res.status(500).json({ mensagem: 'Erro ao buscar comentários.', erro: err.message });
  }
});

module.exports = router;
