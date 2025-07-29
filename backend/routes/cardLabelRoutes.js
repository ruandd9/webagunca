const express = require('express');
const router = express.Router();
const CardLabel = require('../models/CardLabel');

// Rota para criar uma nova etiqueta (label) em um cartão
router.post('/', async (req, res) => {
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
router.get('/', async (req, res) => {
  try {
    const labels = await CardLabel.find();
    res.json(labels);
  } catch (err) {
    res.status(500).json({ mensagem: 'Erro ao buscar etiquetas.', erro: err.message });
  }
});

module.exports = router;
