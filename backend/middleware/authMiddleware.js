const jwt = require('jsonwebtoken');
const User = require('../models/User');
const dotenv = require('dotenv');

dotenv.config();

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];

            // VERIFICA SE O TOKEN REALMENTE EXISTE E NÃO É APENAS 'Bearer'
            if (!token) {
                return res.status(401).json({ mensagem: 'Não autorizado, token faltando.' });
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-senha');
            next();
        } catch (error) {
            // Este catch irá pegar o erro "jwt malformed"
            console.error('Erro de autenticação:', error.message);
            res.status(401).json({ mensagem: 'Não autorizado, token inválido.' });
        }
    } else {
        res.status(401).json({ mensagem: 'Não autorizado, nenhum token encontrado.' });
    }
};

module.exports = { protect };