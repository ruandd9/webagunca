const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');
const boardRoutes = require('./routes/boardRoutes');
// Removi a linha de boardRoutes

// Configura variáveis de ambiente
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

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
app.use('/api/boards', boardRoutes);
// Removi o uso de boardRoutes

console.log('Rotas de board carregadas!');

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
}); 