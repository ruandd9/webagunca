const express = require('express');
const router = express.Router();
const Card = require('../models/Card');
const { protect } = require('../middleware/authMiddleware');
const { createCardMovedNotification } = require('../services/notificationService');

// Rota de teste GET
router.get('/teste', (req, res) => {
  res.json({ mensagem: 'GET de teste em /api/cards/teste funcionando!' });
});

// Rota de teste POST
router.post('/teste', (req, res) => {
  const { exemplo } = req.body;
  res.json({ mensagem: 'POST de teste em /api/cards/teste funcionando!', recebido: exemplo });
});

// Rota para buscar cards por boardId (com autenticação)
router.get('/board/:boardId', protect, async (req, res) => {
  try {
    const { boardId } = req.params;
    const cards = await Card.find({ boardId }).populate('createdBy', 'nome email');
    res.json(cards);
  } catch (err) {
    res.status(500).json({ mensagem: 'Erro ao buscar cards do quadro.', erro: err.message });
  }
});

// Rota para criar um novo card (com autenticação)
router.post('/', protect, async (req, res) => {
  try {
    const { boardId, listId, title, description, dueDate } = req.body;
    if (!boardId || !listId || !title) {
      return res.status(400).json({ mensagem: 'boardId, listId e title são obrigatórios.' });
    }
    
    const novoCard = new Card({ 
      boardId, 
      listId, 
      title, 
      description, 
      dueDate, 
      createdBy: req.user._id 
    });
    await novoCard.save();
    res.status(201).json({ mensagem: 'Card criado com sucesso!', card: novoCard });
  } catch (err) {
    res.status(500).json({ mensagem: 'Erro ao criar card.', erro: err.message });
  }
});

// Rota para listar todos os cards (com autenticação)
router.get('/', protect, async (req, res) => {
  try {
    const cards = await Card.find().populate('createdBy', 'nome email');
    res.json(cards);
  } catch (err) {
    res.status(500).json({ mensagem: 'Erro ao buscar cards.', erro: err.message });
  }
});

// Rota para atualizar um card (com autenticação)
router.put('/:id', protect, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, dueDate, listId, completed } = req.body;
    
    // Buscar o card atual para comparar mudanças
    const cardAtual = await Card.findById(id);
    if (!cardAtual) {
      return res.status(404).json({ mensagem: 'Card não encontrado.' });
    }
    
    const card = await Card.findByIdAndUpdate(
      id,
      { 
        title, 
        description, 
        dueDate, 
        listId, 
        completed,
        updatedAt: Date.now()
      },
      { new: true }
    );
    
    // Se a lista mudou, criar notificação
    if (listId && cardAtual.listId !== listId) {
      await createCardMovedNotification(
        req.user,
        card._id,
        card.boardId,
        card.title,
        cardAtual.listId,
        listId
      );
    }
    
    res.json({ mensagem: 'Card atualizado com sucesso!', card });
  } catch (err) {
    res.status(500).json({ mensagem: 'Erro ao atualizar card.', erro: err.message });
  }
});

// Rota para deletar um card (com autenticação)
router.delete('/:id', protect, async (req, res) => {
  try {
    const { id } = req.params;
    const card = await Card.findByIdAndDelete(id);
    
    if (!card) {
      return res.status(404).json({ mensagem: 'Card não encontrado.' });
    }
    
    res.json({ mensagem: 'Card deletado com sucesso!' });
  } catch (err) {
    res.status(500).json({ mensagem: 'Erro ao deletar card.', erro: err.message });
  }
});

module.exports = router;
