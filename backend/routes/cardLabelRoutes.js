const express = require('express');
const router = express.Router();
const CardLabel = require('../models/CardLabel');

// Criar nova etiqueta para um cartão
router.post('/', async (req, res) => {
  try {
    const { cardId, name, color } = req.body;

    if (!cardId || !name || !color) {
      return res.status(400).json({ mensagem: 'Campos obrigatórios: cardId, name, color.' });
    }

    const novaEtiqueta = new CardLabel({ cardId, name, color });
    const etiquetaSalva = await novaEtiqueta.save();

    res.status(201).json({ mensagem: 'Etiqueta criada com sucesso.', label: etiquetaSalva });
  } catch (err) {
    res.status(500).json({ mensagem: 'Erro ao criar etiqueta.', erro: err.message });
  }
});

// Listar etiquetas de um cartão
router.get('/:cardId', async (req, res) => {
  try {
    const etiquetas = await CardLabel.find({ cardId: req.params.cardId });
    res.json(etiquetas);
  } catch (err) {
    res.status(500).json({ mensagem: 'Erro ao buscar etiquetas.', erro: err.message });
  }
});

module.exports = router;
