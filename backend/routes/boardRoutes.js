const express = require('express');
const router = express.Router();
const Board = require('../models/Board');

// Rota para criar um novo board
router.post('/', async (req, res) => {
  try {
    const { title, description, visibility, cover_type, cover_value, owner } = req.body;
    if (!title || !owner) {
      return res.status(400).json({ mensagem: 'title e owner são obrigatórios.' });
    }
    const novoBoard = new Board({ title, description, visibility, cover_type, cover_value, owner });
    await novoBoard.save();
    res.status(201).json({ mensagem: 'Board criado com sucesso!', board: novoBoard });
  } catch (err) {
    res.status(500).json({ mensagem: 'Erro ao criar board.', erro: err.message });
  }
});

// Rota para listar todos os boards
router.get('/', async (req, res) => {
  try {
    const boards = await Board.find();
    res.json(boards);
  } catch (err) {
    res.status(500).json({ mensagem: 'Erro ao buscar boards.', erro: err.message });
  }
});

module.exports = router;
