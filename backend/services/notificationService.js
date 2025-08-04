const Card = require('../models/Card');
const BoardMember = require('../models/BoardMember');
const { createNotification } = require('../routes/notificationRoutes');

// Função para verificar cartões próximos do vencimento e criar notificações
const checkDueDateNotifications = async () => {
  try {
    const now = new Date();
    const threeDaysFromNow = new Date(now.getTime() + (3 * 24 * 60 * 60 * 1000)); // 3 dias
    
    // Buscar cartões que vencem em até 3 dias e não estão completos
    const cardsDueSoon = await Card.find({
      dueDate: { 
        $gte: now, 
        $lte: threeDaysFromNow 
      },
      completed: false
    }).populate('boardId', 'title');
    
    for (const card of cardsDueSoon) {
      // Buscar membros do quadro
      const boardMembers = await BoardMember.find({ boardId: card.boardId._id });
      
      for (const member of boardMembers) {
        // Não notificar o criador do cartão
        if (member.userId.toString() === card.createdBy.toString()) {
          continue;
        }
        
        // Calcular dias restantes
        const daysUntilDue = Math.ceil((card.dueDate - now) / (1000 * 60 * 60 * 24));
        
        let message;
        if (daysUntilDue === 0) {
          message = `O cartão "${card.title}" vence hoje no quadro "${card.boardId.title}"`;
        } else if (daysUntilDue === 1) {
          message = `O cartão "${card.title}" vence amanhã no quadro "${card.boardId.title}"`;
        } else {
          message = `O cartão "${card.title}" vence em ${daysUntilDue} dias no quadro "${card.boardId.title}"`;
        }
        
        // Criar notificação
        await createNotification(
          member.userId,
          'card_due_soon',
          'Prazo próximo',
          message,
          { 
            boardId: card.boardId._id, 
            cardId: card._id 
          }
        );
      }
    }
    
    console.log(`Verificação de prazos concluída. ${cardsDueSoon.length} cartões próximos do vencimento encontrados.`);
  } catch (err) {
    console.error('Erro ao verificar notificações de prazo:', err);
  }
};

// Função para criar notificação quando um cartão é mencionado
const createMentionNotification = async (mentionedUserId, mentionedBy, cardId, boardId, cardTitle) => {
  try {
    await createNotification(
      mentionedUserId,
      'card_mentioned',
      'Você foi mencionado',
      `${mentionedBy.nomeCompleto} mencionou você no cartão "${cardTitle}"`,
      { 
        mentionedBy: mentionedBy._id,
        cardId: cardId,
        boardId: boardId
      }
    );
  } catch (err) {
    console.error('Erro ao criar notificação de menção:', err);
  }
};

// Função para criar notificação quando um cartão é movido
const createCardMovedNotification = async (movedBy, cardId, boardId, cardTitle, fromList, toList) => {
  try {
    // Buscar membros do quadro
    const boardMembers = await BoardMember.find({ boardId: boardId });
    
    for (const member of boardMembers) {
      // Não notificar quem moveu o cartão
      if (member.userId.toString() === movedBy._id.toString()) {
        continue;
      }
      
      await createNotification(
        member.userId,
        'card_moved',
        'Cartão movido',
        `${movedBy.nomeCompleto} moveu o cartão "${cardTitle}" de "${fromList}" para "${toList}"`,
        { 
          cardId: cardId,
          boardId: boardId
        }
      );
    }
  } catch (err) {
    console.error('Erro ao criar notificação de cartão movido:', err);
  }
};

// Função para criar notificação quando uma lista é criada
const createListCreatedNotification = async (createdBy, boardId, listName) => {
  try {
    // Buscar membros do quadro
    const boardMembers = await BoardMember.find({ boardId: boardId });
    
    for (const member of boardMembers) {
      // Não notificar quem criou a lista
      if (member.userId.toString() === createdBy._id.toString()) {
        continue;
      }
      
      await createNotification(
        member.userId,
        'list_created',
        'Nova lista criada',
        `${createdBy.nomeCompleto} criou uma nova lista "${listName}"`,
        { 
          boardId: boardId,
          listId: listName
        }
      );
    }
  } catch (err) {
    console.error('Erro ao criar notificação de lista criada:', err);
  }
};

module.exports = {
  checkDueDateNotifications,
  createMentionNotification,
  createCardMovedNotification,
  createListCreatedNotification
}; 