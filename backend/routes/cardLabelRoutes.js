const express = require('express');
const router = express.Router();
const CardLabel = require('../models/CardLabel');
const { protect } = require('../middleware/authMiddleware');

// Rota para criar uma nova etiqueta (label) em um cartão
router.post('/', protect, async (req, res) => {
  try {
    const { cardId, name, color } = req.body;
    if (!cardId || !name || !color) {
      return res.status(400).json({ mensagem: 'cardId, name e color são obrigatórios.' });
    }
    const novaLabel = new CardLabel({ cardId, name, color });
    await novaLabel.save();
    res.status(201).json({ mensagem: 'Etiqueta criada com sucesso!', label: novaLabel });
  } catch (err) {
    res.status(500).json({ mensagem: 'Erro ao criar etiqueta.', erro: err.message });
  }
});

// Rota para listar todas as etiquetas
router.get('/', protect, async (req, res) => {
  try {
    const labels = await CardLabel.find();
    res.json(labels);
  } catch (err) {
    res.status(500).json({ mensagem: 'Erro ao buscar etiquetas.', erro: err.message });
  }
});

// Rota para buscar etiquetas de um card específico
router.get('/card/:cardId', protect, async (req, res) => {
  try {
    const { cardId } = req.params;
    const labels = await CardLabel.find({ cardId: cardId });
    res.json(labels);
  } catch (err) {
    res.status(500).json({ mensagem: 'Erro ao buscar etiquetas do card.', erro: err.message });
  }
});

// Rota para deletar uma etiqueta
router.delete('/:id', protect, async (req, res) => {
  try {
    const { id } = req.params;
    const label = await CardLabel.findByIdAndDelete(id);
    
    if (!label) {
      return res.status(404).json({ mensagem: 'Etiqueta não encontrada.' });
    }
    
    res.json({ mensagem: 'Etiqueta deletada com sucesso!' });
  } catch (err) {
    res.status(500).json({ mensagem: 'Erro ao deletar etiqueta.', erro: err.message });
  }
});

module.exports = router;
