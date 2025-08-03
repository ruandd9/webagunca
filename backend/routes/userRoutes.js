const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { protect } = require('../middleware/authMiddleware');

dotenv.config();

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
        console.error('Erro no cadastro de usuário:', err);
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
        const payload = { id: usuario._id };
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: '1h'
        });
        res.json({
            mensagem: 'Login realizado com sucesso!',
            user: {
                _id: usuario._id,
                nomeCompleto: usuario.nomeCompleto,
                email: usuario.email,
                nomeUsuario: usuario.nomeUsuario,
                telefone: usuario.telefone
            },
            token: token
        });
    } catch (err) {
        console.error('Erro no login:', err);
        res.status(500).json({ mensagem: 'Erro ao fazer login.', erro: err.message });
    }
});

// Rota para buscar dados do usuário logado (protegida)
router.get('/profile', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-senha');
        if (!user) {
            return res.status(404).json({ mensagem: 'Usuário não encontrado.' });
        }
        res.json(user);
    } catch (err) {
        console.error('Erro ao buscar dados do perfil:', err);
        res.status(500).json({ mensagem: 'Erro ao buscar dados do perfil.', erro: err.message });
    }
});

// Rota para atualizar os dados do perfil (protegida)
router.put('/profile', protect, async (req, res) => {
    try {
        const userId = req.user._id;
        const { nomeCompleto, nomeUsuario, email, telefone } = req.body;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ mensagem: 'Usuário não encontrado.' });
        }

        user.nomeCompleto = nomeCompleto || user.nomeCompleto;
        user.nomeUsuario = nomeUsuario || user.nomeUsuario;
        user.email = email || user.email;
        user.telefone = telefone || user.telefone;
        
        await user.save();
        res.json({ mensagem: 'Perfil atualizado com sucesso!', user });

    } catch (err) {
        console.error('Erro ao atualizar perfil:', err);
        res.status(500).json({ mensagem: 'Erro ao atualizar perfil.', erro: err.message });
    }
});

// Rota para atualizar a senha do usuário (protegida)
router.put('/profile/password', protect, async (req, res) => {
    try {
        const userId = req.user._id;
        const { senhaAtual, novaSenha } = req.body;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ mensagem: 'Usuário não encontrado.' });
        }

        const senhaValida = await bcrypt.compare(senhaAtual, user.senha);
        if (!senhaValida) {
            return res.status(400).json({ mensagem: 'Senha atual inválida.' });
        }

        const novaSenhaHash = await bcrypt.hash(novaSenha, 10);
        user.senha = novaSenhaHash;
        
        await user.save();
        res.json({ mensagem: 'Senha atualizada com sucesso!' });

    } catch (err) {
        console.error('Erro ao atualizar senha:', err);
        res.status(500).json({ mensagem: 'Erro ao atualizar senha.', erro: err.message });
    }
});

// Rota para atualizar a imagem do perfil (protegida)
router.put('/profile/image', protect, async (req, res) => {
    try {
        const userId = req.user._id;
        const { profileImage } = req.body;
        
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ mensagem: 'Usuário não encontrado.' });
        }

        user.profileImage = profileImage;
        await user.save();

        res.json({ mensagem: 'Imagem de perfil atualizada com sucesso!', user });

    } catch (err) {
        console.error('Erro ao atualizar imagem de perfil:', err);
        res.status(500).json({ mensagem: 'Erro ao atualizar imagem de perfil.', erro: err.message });
    }
});

module.exports = router;