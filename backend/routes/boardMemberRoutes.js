const express = require('express');
const router = express.Router();
const BoardMember = require('../models/BoardMember');
const Board = require('../models/Board');
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');

// Rota para adicionar um membro a um board
router.post('/', protect, async (req, res) => {
  try {
    const { boardId, email } = req.body;
    
    if (!boardId || !email) {
      return res.status(400).json({ mensagem: 'boardId e email são obrigatórios.' });
    }

    // Verificar se o board existe
    const board = await Board.findById(boardId);
    if (!board) {
      return res.status(404).json({ mensagem: 'Quadro não encontrado.' });
    }

    // Verificar se o usuário logado é o dono do quadro
    if (board.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ mensagem: 'Apenas o dono do quadro pode adicionar membros.' });
    }

    // Buscar usuário pelo email
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ mensagem: 'Usuário com este email não encontrado.' });
    }

    // Verificar se o usuário já é membro do quadro
    const existingMember = await BoardMember.findOne({ boardId, userId: user._id });
    if (existingMember) {
      return res.status(400).json({ mensagem: 'Usuário já é membro deste quadro.' });
    }

    // Verificar se não está tentando adicionar a si mesmo
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ mensagem: 'Você já é o dono deste quadro.' });
    }

    const novoMembro = new BoardMember({ 
      boardId, 
      userId: user._id 
    });
    await novoMembro.save();

    // Retornar informações do membro adicionado
    const memberInfo = await BoardMember.findById(novoMembro._id).populate('userId', 'nome email');
    
    res.status(201).json({ 
      mensagem: 'Membro adicionado com sucesso!', 
      boardMember: memberInfo 
    });
  } catch (err) {
    res.status(500).json({ mensagem: 'Erro ao adicionar membro.', erro: err.message });
  }
});

// Rota para listar membros de um board específico
router.get('/board/:boardId', protect, async (req, res) => {
  try {
    const { boardId } = req.params;
    
    // Verificar se o board existe
    const board = await Board.findById(boardId);
    if (!board) {
      return res.status(404).json({ mensagem: 'Quadro não encontrado.' });
    }

    // Verificar se o usuário é dono ou membro do quadro
    const isOwner = board.owner.toString() === req.user._id.toString();
    const isMember = await BoardMember.findOne({ boardId, userId: req.user._id });
    
    if (!isOwner && !isMember) {
      return res.status(403).json({ mensagem: 'Acesso negado.' });
    }

    const membros = await BoardMember.find({ boardId }).populate('userId', 'nome email');
    res.json(membros);
  } catch (err) {
    res.status(500).json({ mensagem: 'Erro ao buscar membros.', erro: err.message });
  }
});

// Rota para remover um membro de um board
router.delete('/:id', protect, async (req, res) => {
  try {
    const { id } = req.params;
    
    const boardMember = await BoardMember.findById(id);
    if (!boardMember) {
      return res.status(404).json({ mensagem: 'Membro não encontrado.' });
    }

    // Verificar se o usuário é dono do quadro
    const board = await Board.findById(boardMember.boardId);
    if (!board) {
      return res.status(404).json({ mensagem: 'Quadro não encontrado.' });
    }

    if (board.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ mensagem: 'Apenas o dono do quadro pode remover membros.' });
    }

    await BoardMember.findByIdAndDelete(id);
    res.json({ mensagem: 'Membro removido com sucesso!' });
  } catch (err) {
    res.status(500).json({ mensagem: 'Erro ao remover membro.', erro: err.message });
  }
});

// Rota para listar todos os boards que o usuário é membro
router.get('/user/boards', protect, async (req, res) => {
  try {
    const boardMembers = await BoardMember.find({ userId: req.user._id })
      .populate('boardId', 'title description owner')
      .populate('userId', 'nome email');
    
    res.json(boardMembers);
  } catch (err) {
    res.status(500).json({ mensagem: 'Erro ao buscar quadros do usuário.', erro: err.message });
  }
});

module.exports = router;
