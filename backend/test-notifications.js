const mongoose = require('mongoose');
const Notification = require('./models/Notification');
const User = require('./models/User');
const Board = require('./models/Board');
const Card = require('./models/Card');
const { createNotification } = require('./routes/notificationRoutes');
require('dotenv').config();

// Conectar ao MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Conectado ao MongoDB para testes'))
.catch((err) => console.error('Erro ao conectar ao MongoDB:', err));

async function testNotifications() {
  try {
    console.log('🧪 Iniciando testes do sistema de notificações...\n');

    // Buscar usuários de teste
    const users = await User.find().limit(2);
    if (users.length < 2) {
      console.log('❌ É necessário ter pelo menos 2 usuários no banco para testar');
      return;
    }

    const user1 = users[0];
    const user2 = users[1];

    console.log(`👤 Usuário 1: ${user1.nomeCompleto} (${user1.email})`);
    console.log(`👤 Usuário 2: ${user2.nomeCompleto} (${user2.email})\n`);

    // Teste 1: Criar notificação de quadro adicionado
    console.log('📋 Teste 1: Notificação de quadro adicionado');
    await createNotification(
      user2._id,
      'board_added',
      'Você foi adicionado a um quadro',
      `${user1.nomeCompleto} adicionou você ao quadro "Projeto Teste"`,
      { boardId: new mongoose.Types.ObjectId() }
    );
    console.log('✅ Notificação de quadro adicionado criada\n');

    // Teste 2: Criar notificação de prazo próximo
    console.log('⏰ Teste 2: Notificação de prazo próximo');
    await createNotification(
      user2._id,
      'card_due_soon',
      'Prazo próximo',
      'O cartão "Implementar login" vence em 2 dias no quadro "Projeto Teste"',
      { 
        boardId: new mongoose.Types.ObjectId(),
        cardId: new mongoose.Types.ObjectId()
      }
    );
    console.log('✅ Notificação de prazo próximo criada\n');

    // Teste 3: Criar notificação de menção
    console.log('📝 Teste 3: Notificação de menção');
    await createNotification(
      user2._id,
      'card_mentioned',
      'Você foi mencionado',
      `${user1.nomeCompleto} mencionou você no cartão "Criar API"`,
      { 
        mentionedBy: user1._id,
        cardId: new mongoose.Types.ObjectId(),
        boardId: new mongoose.Types.ObjectId()
      }
    );
    console.log('✅ Notificação de menção criada\n');

    // Teste 4: Criar notificação de cartão movido
    console.log('🔄 Teste 4: Notificação de cartão movido');
    await createNotification(
      user2._id,
      'card_moved',
      'Cartão movido',
      `${user1.nomeCompleto} moveu o cartão "Configurar ambiente" de "A fazer" para "Em andamento"`,
      { 
        cardId: new mongoose.Types.ObjectId(),
        boardId: new mongoose.Types.ObjectId()
      }
    );
    console.log('✅ Notificação de cartão movido criada\n');

    // Teste 5: Criar notificação de lista criada
    console.log('📋 Teste 5: Notificação de lista criada');
    await createNotification(
      user2._id,
      'list_created',
      'Nova lista criada',
      `${user1.nomeCompleto} criou uma nova lista "Code Review"`,
      { 
        boardId: new mongoose.Types.ObjectId(),
        listId: 'Code Review'
      }
    );
    console.log('✅ Notificação de lista criada criada\n');

    // Verificar notificações criadas
    console.log('🔍 Verificando notificações criadas...');
    const notifications = await Notification.find({ userId: user2._id })
      .sort({ createdAt: -1 })
      .limit(5);

    console.log(`📊 Total de notificações para ${user2.nomeCompleto}: ${notifications.length}`);
    
    notifications.forEach((notification, index) => {
      console.log(`\n${index + 1}. ${notification.title}`);
      console.log(`   Tipo: ${notification.type}`);
      console.log(`   Mensagem: ${notification.message}`);
      console.log(`   Lida: ${notification.read ? 'Sim' : 'Não'}`);
      console.log(`   Criada em: ${notification.createdAt.toLocaleString('pt-BR')}`);
    });

    console.log('\n🎉 Testes concluídos com sucesso!');
    console.log('\n💡 Para testar no frontend:');
    console.log('1. Inicie o servidor: npm start');
    console.log('2. Acesse a página de notificações');
    console.log('3. Faça login com o usuário que recebeu as notificações');

  } catch (error) {
    console.error('❌ Erro durante os testes:', error);
  } finally {
    mongoose.connection.close();
    console.log('\n🔌 Conexão com MongoDB fechada');
  }
}

// Executar testes se o arquivo for executado diretamente
if (require.main === module) {
  testNotifications();
}

module.exports = { testNotifications }; 