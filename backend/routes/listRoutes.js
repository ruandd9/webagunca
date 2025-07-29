const express = require('express');
const router = express.Router();
const List = require('../models/List');

// Rota para criar uma nova lista
router.post('/', async (req, res) => {
  try {
    const { boardId, name, position } = req.body;
    if (!boardId || !name || position === undefined) {
      return res.status(400).json({ mensagem: 'boardId, name e position são obrigatórios.' });
    }
    const novaLista = new List({ boardId, name, position });
    await novaLista.save();
    res.status(201).json({ mensagem: 'Lista criada com sucesso!', list: novaLista });
  } catch (err) {
    res.status(500).json({ mensagem: 'Erro ao criar lista.', erro: err.message });
  }
});

// Rota para listar todas as listas
router.get('/', async (req, res) => {
  try {
    const listas = await List.find();
    res.json(listas);
  } catch (err) {
    res.status(500).json({ mensagem: 'Erro ao buscar listas.', erro: err.message });
  }
});

module.exports = router;
