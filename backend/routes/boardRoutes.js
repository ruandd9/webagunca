const express = require('express');
const router = express.Router();
const Board = require('../models/Board');

// Rota para criar um novo quadro
router.post('/criar', async (req, res) => {
  try {
    const { title, description, visibility, cover_type, cover_value, owner } = req.body;
    if (!title || !owner) {
      return res.status(400).json({ mensagem: 'Preencha os campos obrigatórios: title e owner.' });
    }
    const novoQuadro = new Board({ title, description, visibility, cover_type, cover_value, owner });
    await novoQuadro.save();
    res.status(201).json({ mensagem: 'Quadro criado com sucesso!', quadro: novoQuadro });
  } catch (err) {
    res.status(500).json({ mensagem: 'Erro ao criar quadro.', erro: err.message });
  }
});

// Rota para listar todos os quadros
router.get('/quadros', async (req, res) => {
  try {
    const quadros = await Board.find();
    res.json(quadros);
  } catch (err) {
    res.status(500).json({ mensagem: 'Erro ao buscar quadros.', erro: err.message });
  }
});

// Rota para buscar um quadro por ID
router.get('/quadros/:id', async (req, res) => {
  try {
    const quadro = await Board.findById(req.params.id);
    if (!quadro) {
      return res.status(404).json({ mensagem: 'Quadro não encontrado.' });
    }
    res.json(quadro);
  } catch (err) {
    res.status(500).json({ mensagem: 'Erro ao buscar quadro.', erro: err.message });
  }
});

module.exports = router; 