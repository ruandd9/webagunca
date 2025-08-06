const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');
const cardRoutes = require('./routes/cardRoutes');
const boardRoutes = require('./routes/boardRoutes');
const boardMemberRoutes = require('./routes/boardMemberRoutes');
const listRoutes = require('./routes/listRoutes');
const commentRoutes = require('./routes/commentRoutes');
const cardLabelRoutes = require('./routes/cardLabelRoutes');
const { router: notificationRoutes } = require('./routes/notificationRoutes');
const chatRoutes = require('./routes/chatRoutes');
const { checkDueDateNotifications } = require('./services/notificationService');

// Configura variáveis de ambiente
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({}));

// Conexão com o MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Conectado ao MongoDB Atlas'))
.catch((err) => console.error('Erro ao conectar ao MongoDB:', err));

const PORT = process.env.PORT || 5000;
app.get('/', (req, res) => {
  res.json({ mensagem: 'API rodando!' });
});

app.use('/api', userRoutes);
app.use('/api/cards', cardRoutes);
app.use('/api/boards', boardRoutes);
app.use('/api/board-members', boardMemberRoutes);
app.use('/api/lists', listRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/card-labels', cardLabelRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/chat', chatRoutes);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  
  // Agendar verificação de notificações de prazo a cada 6 horas
  setInterval(checkDueDateNotifications, 6 * 60 * 60 * 1000);
  
  // Executar verificação inicial após 1 minuto
  setTimeout(checkDueDateNotifications, 60 * 1000);
});