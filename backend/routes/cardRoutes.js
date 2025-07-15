const express = require('express');
const router = express.Router();
const Card = require('../models/Card');

// Criar novo cartão
router.post('/', async (req, res) => {
  try {
    const {
      boardId,
      listId,
      title,
      description,
      dueDate,
      createdBy
    } = req.body;

    if (!boardId || !listId || !title || !createdBy) {
      return res.status(400).json({ mensagem: 'Campos obrigatórios: boardId, listId, title, createdBy.' });
    }

    const novoCard = new Card({
      boardId,
      listId,
      title,
      description,
      dueDate,
      createdBy
    });

    const cardSalvo = await novoCard.save();
    res.status(201).json({ mensagem: 'Cartão criado com sucesso.', card: cardSalvo });
  } catch (err) {
    res.status(500).json({ mensagem: 'Erro ao criar cartão.', erro: err.message });
  }
});

// Listar todos os cartões de uma lista
router.get('/:listId', async (req, res) => {
  try {
    const { listId } = req.params;

    const cards = await Card.find({ listId }).sort({ createdAt: 1 });
    res.json(cards);
  } catch (err) {
    res.status(500).json({ mensagem: 'Erro ao buscar cartões.', erro: err.message });
  }
});

module.exports = router;