const express = require('express');
const router = express.Router();
const Card = require('../models/Card');

// Rota de teste GET
router.get('/teste', (req, res) => {
  res.json({ mensagem: 'GET de teste em /api/cards/teste funcionando!' });
});

// Rota de teste POST
router.post('/teste', (req, res) => {
  const { exemplo } = req.body;
  res.json({ mensagem: 'POST de teste em /api/cards/teste funcionando!', recebido: exemplo });
});

// Rota para criar um novo card
router.post('/', async (req, res) => {
  try {
    const { boardId, listId, title, description, dueDate, createdBy } = req.body;
    if (!boardId || !listId || !title || !createdBy) {
      return res.status(400).json({ mensagem: 'boardId, listId, title e createdBy são obrigatórios.' });
    }
    const novoCard = new Card({ boardId, listId, title, description, dueDate, createdBy });
    await novoCard.save();
    res.status(201).json({ mensagem: 'Card criado com sucesso!', card: novoCard });
  } catch (err) {
    res.status(500).json({ mensagem: 'Erro ao criar card.', erro: err.message });
  }
});

// Rota para listar todos os cards
router.get('/', async (req, res) => {
  try {
    const cards = await Card.find();
    res.json(cards);
  } catch (err) {
    res.status(500).json({ mensagem: 'Erro ao buscar cards.', erro: err.message });
  }
});

module.exports = router;
