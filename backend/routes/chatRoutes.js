const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { checkBoardMembership } = require('../middleware/boardMemberMiddleware');
const {
  getOrCreateBoardChat,
  getChatMessages,
  sendMessage,
  editMessage,
  deleteMessage
} = require('../controllers/chatController');

// Todas as rotas são protegidas e verificam membership do board
router.use(protect);

// Buscar ou criar chat do board
router.get('/group/:boardId', checkBoardMembership, getOrCreateBoardChat);

// Listar mensagens do chat de grupo
router.get('/group/:boardId/messages', checkBoardMembership, getChatMessages);

// Enviar mensagem no chat de grupo
router.post('/group/:boardId', checkBoardMembership, sendMessage);

// Editar mensagem
router.put('/group/:boardId/message/:messageId', checkBoardMembership, editMessage);

// Deletar mensagem
router.delete('/group/:boardId/message/:messageId', checkBoardMembership, deleteMessage);

module.exports = router;