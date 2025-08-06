const Chat = require('../models/Chat');
const ChatMessage = require('../models/ChatMessage');
const User = require('../models/User');

// Buscar ou criar chat do board
const getOrCreateBoardChat = async (req, res) => {
  try {
    const { boardId } = req.params;

    // Verificar se já existe um chat para este board
    let chat = await Chat.findOne({ boardId });

    // Se não existir, criar um novo
    if (!chat) {
      chat = new Chat({
        boardId,
        name: `Chat - ${req.board.title}`
      });
      await chat.save();
    }

    res.json(chat);
  } catch (error) {
    console.error('Erro ao buscar/criar chat:', error);
    res.status(500).json({ mensagem: 'Erro ao acessar chat do board.' });
  }
};

// Listar mensagens do chat
const getChatMessages = async (req, res) => {
  try {
    const { boardId } = req.params;
    const { page = 1, limit = 50 } = req.query;

    // Buscar o chat do board
    const chat = await Chat.findOne({ boardId });
    if (!chat) {
      return res.status(404).json({ mensagem: 'Chat não encontrado.' });
    }

    // Buscar mensagens com paginação
    const messages = await ChatMessage.find({ 
      chatId: chat._id, 
      isDeleted: false 
    })
    .populate('senderId', 'nomeCompleto email')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

    // Inverter ordem para mostrar mensagens mais antigas primeiro
    messages.reverse();

    res.json({
      chat,
      messages,
      currentPage: parseInt(page),
      totalPages: Math.ceil(await ChatMessage.countDocuments({ chatId: chat._id, isDeleted: false }) / limit)
    });
  } catch (error) {
    console.error('Erro ao buscar mensagens:', error);
    res.status(500).json({ mensagem: 'Erro ao carregar mensagens.' });
  }
};

// Enviar mensagem
const sendMessage = async (req, res) => {
  try {
    const { boardId } = req.params;
    const { content, messageType = 'text' } = req.body;
    const senderId = req.user._id;

    if (!content || content.trim() === '') {
      return res.status(400).json({ mensagem: 'Conteúdo da mensagem é obrigatório.' });
    }

    // Buscar ou criar chat
    let chat = await Chat.findOne({ boardId });
    if (!chat) {
      chat = new Chat({
        boardId,
        name: `Chat - ${req.board.title}`
      });
      await chat.save();
    }

    // Criar nova mensagem
    const newMessage = new ChatMessage({
      chatId: chat._id,
      senderId,
      content: content.trim(),
      messageType
    });

    await newMessage.save();

    // Atualizar última atividade do chat
    chat.lastActivity = new Date();
    await chat.save();

    // Buscar mensagem com dados do usuário
    const messageWithUser = await ChatMessage.findById(newMessage._id)
      .populate('senderId', 'nomeCompleto email');

    res.status(201).json({
      mensagem: 'Mensagem enviada com sucesso!',
      message: messageWithUser
    });
  } catch (error) {
    console.error('Erro ao enviar mensagem:', error);
    res.status(500).json({ mensagem: 'Erro ao enviar mensagem.' });
  }
};

// Editar mensagem
const editMessage = async (req, res) => {
  try {
    const { boardId, messageId } = req.params;
    const { content } = req.body;
    const userId = req.user._id;

    if (!content || content.trim() === '') {
      return res.status(400).json({ mensagem: 'Conteúdo da mensagem é obrigatório.' });
    }

    // Buscar chat
    const chat = await Chat.findOne({ boardId });
    if (!chat) {
      return res.status(404).json({ mensagem: 'Chat não encontrado.' });
    }

    // Buscar mensagem
    const message = await ChatMessage.findOne({ 
      _id: messageId, 
      chatId: chat._id,
      isDeleted: false 
    });

    if (!message) {
      return res.status(404).json({ mensagem: 'Mensagem não encontrada.' });
    }

    // Verificar se o usuário é o autor da mensagem
    if (message.senderId.toString() !== userId.toString()) {
      return res.status(403).json({ mensagem: 'Você só pode editar suas próprias mensagens.' });
    }

    // Atualizar mensagem
    message.content = content.trim();
    message.editedAt = new Date();
    await message.save();

    // Buscar mensagem atualizada com dados do usuário
    const updatedMessage = await ChatMessage.findById(message._id)
      .populate('senderId', 'nomeCompleto email');

    res.json({
      mensagem: 'Mensagem editada com sucesso!',
      message: updatedMessage
    });
  } catch (error) {
    console.error('Erro ao editar mensagem:', error);
    res.status(500).json({ mensagem: 'Erro ao editar mensagem.' });
  }
};

// Deletar mensagem
const deleteMessage = async (req, res) => {
  try {
    const { boardId, messageId } = req.params;
    const userId = req.user._id;

    // Buscar chat
    const chat = await Chat.findOne({ boardId });
    if (!chat) {
      return res.status(404).json({ mensagem: 'Chat não encontrado.' });
    }

    // Buscar mensagem
    const message = await ChatMessage.findOne({ 
      _id: messageId, 
      chatId: chat._id,
      isDeleted: false 
    });

    if (!message) {
      return res.status(404).json({ mensagem: 'Mensagem não encontrada.' });
    }

    // Verificar se o usuário é o autor da mensagem
    if (message.senderId.toString() !== userId.toString()) {
      return res.status(403).json({ mensagem: 'Você só pode deletar suas próprias mensagens.' });
    }

    // Marcar mensagem como deletada
    message.isDeleted = true;
    await message.save();

    res.json({ mensagem: 'Mensagem deletada com sucesso!' });
  } catch (error) {
    console.error('Erro ao deletar mensagem:', error);
    res.status(500).json({ mensagem: 'Erro ao deletar mensagem.' });
  }
};

module.exports = {
  getOrCreateBoardChat,
  getChatMessages,
  sendMessage,
  editMessage,
  deleteMessage
};