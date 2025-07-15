const express = require('express');
const router = express.Router();
const Board = require('../models/Board');

// Criar um novo quadro
router.post('/', async (req, res) => {
  try {
    const { title, description, visibility, cover_type, cover_value, owner } = req.body;

    if (!title || !owner) {
      return res.status(400).json({ mensagem: 'Título e ID do dono são obrigatórios.' });
    }

    const novoQuadro = new Board({
      title,
      description,
      visibility,
      cover_type,
      cover_value,
      owner
    });

    const quadroSalvo = await novoQuadro.save();
    res.status(201).json(quadroSalvo);

  } catch (err) {
    res.status(500).json({ mensagem: 'Erro ao criar o quadro.', erro: err.message });
  }
});

// Listar todos os quadros de um usuário
router.get('/', async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ mensagem: 'ID do usuário é obrigatório na query string.' });
    }

    const quadros = await Board.find({ owner: userId });
    res.json(quadros);
  } catch (err) {
    res.status(500).json({ mensagem: 'Erro ao buscar quadros.', erro: err.message });
  }
});

// Obter um quadro específico por ID
router.get('/:id', async (req, res) => {
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