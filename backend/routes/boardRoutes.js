const express = require('express');
const router = express.Router();
const Board = require('../models/Board');
const { protect } = require('../middleware/authMiddleware');

// Rota para criar um novo board (protegida)
router.post('/', protect, async (req, res) => {
    try {
        const { title, description, visibility, cover_type, cover_value } = req.body;
        
        if (!title) {
            return res.status(400).json({ mensagem: 'O título é obrigatório.' });
        }

        const novoBoard = new Board({
            title,
            description,
            visibility,
            cover_type,
            cover_value,
            owner: req.user._id,
            members: [req.user._id]
        });

        await novoBoard.save();
        res.status(201).json({ mensagem: 'Board criado com sucesso!', board: novoBoard });
    } catch (err) {
        console.error('Erro ao criar board:', err);
        res.status(500).json({ mensagem: 'Erro ao criar board.', erro: err.message });
    }
});

// Rota para listar os boards do usuário logado (protegida)
router.get('/', protect, async (req, res) => {
    try {
        const boards = await Board.find({ owner: req.user._id });
        res.json(boards);
    } catch (err) {
        console.error('Erro ao buscar boards:', err);
        res.status(500).json({ mensagem: 'Erro ao buscar boards.', erro: err.message });
    }
});

// Rota para buscar um board específico por ID (protegida)
router.get('/:id', protect, async (req, res) => {
    try {
        const boardId = req.params.id;
        const board = await Board.findById(boardId);

        if (!board) {
            return res.status(404).json({ mensagem: 'Quadro não encontrado.' });
        }


        // Verifica se o usuário logado é o dono do quadro
        if (board.owner.toString() !== req.user._id.toString()) {
            // Se não for dono, verifica se é membro
            const BoardMember = require('../models/BoardMember');
            const isMember = await BoardMember.findOne({ boardId: board._id, userId: req.user._id });
            if (!isMember) {
                return res.status(403).json({ mensagem: 'Não autorizado para acessar este quadro.' });
            }
        }

        res.json(board);
    } catch (err) {
        console.error('Erro ao buscar board:', err);
        res.status(500).json({ mensagem: 'Erro ao buscar board.', erro: err.message });
    }
});

// Rota para atualizar um board (protegida)
router.put('/:id', protect, async (req, res) => {
    try {
        const boardId = req.params.id;
        const { title, description, visibility, cover_type, cover_value } = req.body;

        const board = await Board.findById(boardId);

        if (!board) {
            return res.status(404).json({ mensagem: 'Quadro não encontrado.' });
        }

        // Verifica se o usuário logado é o dono do quadro
        if (board.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ mensagem: 'Não autorizado para editar este quadro.' });
        }

        board.title = title || board.title;
        board.description = description || board.description;
        board.visibility = visibility || board.visibility;
        board.cover_type = cover_type || board.cover_type;
        board.cover_value = cover_value || board.cover_value;

        await board.save();
        res.json({ mensagem: 'Quadro atualizado com sucesso!', board });

    } catch (err) {
        console.error('Erro ao atualizar board:', err);
        res.status(500).json({ mensagem: 'Erro ao atualizar board.', erro: err.message });
    }
});

// Rota para deletar um board (protegida)
router.delete('/:id', protect, async (req, res) => {
    try {
        const boardId = req.params.id;
        const board = await Board.findById(boardId);

        if (!board) {
            return res.status(404).json({ mensagem: 'Quadro não encontrado.' });
        }

        // Verifica se o usuário logado é o dono do quadro
        if (board.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ mensagem: 'Não autorizado para deletar este quadro.' });
        }

        await Board.deleteOne({ _id: boardId });
        res.json({ mensagem: 'Quadro deletado com sucesso!' });

    } catch (err) {
        console.error('Erro ao deletar board:', err);
        res.status(500).json({ mensagem: 'Erro ao deletar board.', erro: err.message });
    }
});

module.exports = router;