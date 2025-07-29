const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');

// Rota para criar um novo comentário
router.post('/', async (req, res) => {
  try {
    const { cardId, userId, text } = req.body;
    if (!cardId || !userId || !text) {
      return res.status(400).json({ mensagem: 'cardId, userId e text são obrigatórios.' });
    }
    const novoComentario = new Comment({ cardId, userId, text });
    await novoComentario.save();
    res.status(201).json({ mensagem: 'Comentário criado com sucesso!', comment: novoComentario });
  } catch (err) {
    res.status(500).json({ mensagem: 'Erro ao criar comentário.', erro: err.message });
  }
});

// Rota para listar todos os comentários
router.get('/', async (req, res) => {
  try {
    const comentarios = await Comment.find();
    res.json(comentarios);
  } catch (err) {
    res.status(500).json({ mensagem: 'Erro ao buscar comentários.', erro: err.message });
  }
});

module.exports = router;
