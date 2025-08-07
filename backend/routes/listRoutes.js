const express = require('express');
const router = express.Router();
const List = require('../models/List');
const { protect } = require('../middleware/authMiddleware');

// Rota para criar uma nova lista
router.post('/', protect, async (req, res) => {
  try {
    const { boardId, name, position } = req.body;
    if (!boardId || !name || position === undefined) {
      return res.status(400).json({ mensagem: 'boardId, name e position são obrigatórios.' });
    }
    
    // Gerar listId a partir do nome (mesmo algoritmo do frontend)
    const listId = name.toLowerCase().replace(/\s+/g, '-');
    
    const novaLista = new List({ boardId, name, listId, position });
    await novaLista.save();
    res.status(201).json({ mensagem: 'Lista criada com sucesso!', list: novaLista });
  } catch (err) {
    res.status(500).json({ mensagem: 'Erro ao criar lista.', erro: err.message });
  }
});

// Rota para listar todas as listas
router.get('/', protect, async (req, res) => {
  try {
    const listas = await List.find();
    res.json(listas);
  } catch (err) {
    res.status(500).json({ mensagem: 'Erro ao buscar listas.', erro: err.message });
  }
});

// Rota para buscar listas de um quadro específico
router.get('/board/:boardId', protect, async (req, res) => {
  try {
    const { boardId } = req.params;
    const listas = await List.find({ boardId: boardId }).sort({ position: 1 });
    res.json(listas);
  } catch (err) {
    res.status(500).json({ mensagem: 'Erro ao buscar listas do quadro.', erro: err.message });
  }
});

// Rota para deletar uma lista
router.delete('/:id', protect, async (req, res) => {
  try {
    const { id } = req.params;
    const lista = await List.findById(id);
    
    if (!lista) {
      return res.status(404).json({ mensagem: 'Lista não encontrada.' });
    }
    
    await List.findByIdAndDelete(id);
    res.json({ mensagem: 'Lista deletada com sucesso!' });
  } catch (err) {
    res.status(500).json({ mensagem: 'Erro ao deletar lista.', erro: err.message });
  }
});

module.exports = router;
