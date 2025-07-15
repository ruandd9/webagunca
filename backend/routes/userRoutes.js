const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Rota de cadastro
router.post('/cadastrar', async (req, res) => {
  try {
    const { nomeCompleto, email, senha } = req.body;
    if (!nomeCompleto || !email || !senha) {
      return res.status(400).json({ mensagem: 'Preencha todos os campos.' });
    }
    const usuarioExistente = await User.findOne({ email });
    if (usuarioExistente) {
      return res.status(400).json({ mensagem: 'E-mail já cadastrado.' });
    }
    const senhaHash = await bcrypt.hash(senha, 10);
    const novoUsuario = new User({ nomeCompleto, email, senha: senhaHash });
    await novoUsuario.save();
    res.status(201).json({ mensagem: 'Usuário cadastrado com sucesso!' });
  } catch (err) {
    res.status(500).json({ mensagem: 'Erro ao cadastrar usuário.', erro: err.message });
  }
});

// Rota de login
router.post('/login', async (req, res) => {
  try {
    const { email, senha } = req.body;
    const usuario = await User.findOne({ email });
    if (!usuario) {
      return res.status(400).json({ mensagem: 'E-mail ou senha inválidos.' });
    }
    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
      return res.status(400).json({ mensagem: 'E-mail ou senha inválidos.' });
    }
    res.json({ mensagem: 'Login realizado com sucesso!' });
  } catch (err) {
    res.status(500).json({ mensagem: 'Erro ao fazer login.', erro: err.message });
  }
});

// Rota para listar usuários (sem mostrar senha)
router.get('/usuarios', async (req, res) => {
  try {
    const usuarios = await User.find({}, '-senha');
    res.json(usuarios);
  } catch (err) {
    res.status(500).json({ mensagem: 'Erro ao buscar usuários.', erro: err.message });
  }
});

module.exports = router; 