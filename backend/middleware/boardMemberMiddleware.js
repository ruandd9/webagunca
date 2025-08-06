const Board = require('../models/Board');
const BoardMember = require('../models/BoardMember');

// Middleware para verificar se o usuário é membro do board
const checkBoardMembership = async (req, res, next) => {
  try {
    const { boardId } = req.params;
    const userId = req.user._id;

    // Verificar se o board existe
    const board = await Board.findById(boardId);
    if (!board) {
      return res.status(404).json({ mensagem: 'Board não encontrado.' });
    }

    // Verificar se o usuário é o dono do board
    if (board.owner.toString() === userId.toString()) {
      req.board = board;
      return next();
    }

    // Verificar se o usuário é membro do board
    const isMember = await BoardMember.findOne({ boardId, userId });
    if (!isMember) {
      return res.status(403).json({ mensagem: 'Acesso negado. Você não é membro deste board.' });
    }

    req.board = board;
    next();
  } catch (error) {
    console.error('Erro ao verificar membership do board:', error);
    res.status(500).json({ mensagem: 'Erro interno do servidor.' });
  }
};

module.exports = { checkBoardMembership };