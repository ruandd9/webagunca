// Função para validar o email
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Função para validar a senha
function validatePassword(password) {
    // Mínimo 8 caracteres, não aceita espaços
    return password.length >= 8 && !password.includes(' ');
}

// Função para registrar um novo usuário localmente
function registerUser(email, nomeCompleto, senha) {
    if (!validateEmail(email)) {
        throw new Error('Email inválido');
    }
    if (!validatePassword(senha)) {
        throw new Error('A senha deve ter no mínimo 8 caracteres e não pode conter espaços');
    }

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.some(user => user.email === email)) {
        throw new Error('Este email já está cadastrado');
    }

    const newUser = {
        email,
        nomeCompleto,
        senha, // Em ambiente real, use hash
        dataCadastro: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    const userData = {
        email,
        nomeCompleto,
        dataCadastro: newUser.dataCadastro
    };
    localStorage.setItem('userData', JSON.stringify(userData));

    return userData;
}

// Função para fazer login local
function loginUserLocal(email, senha) {
    if (!validateEmail(email)) {
        throw new Error('Email inválido');
    }

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email);

    if (!user) {
        throw new Error('Usuário não encontrado');
    }
    if (user.senha !== senha) {
        throw new Error('Senha incorreta');
    }

    const userData = {
        email: user.email,
        nomeCompleto: user.nomeCompleto,
        dataCadastro: user.dataCadastro
    };
    localStorage.setItem('userData', JSON.stringify(userData));

    return userData;
}

// Função para fazer login via API (backend)
async function loginUserApi(email, password) {
    try {
        const response = await fetch('http://localhost:5000/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            // Salva o ID do usuário e o token JWT.
            localStorage.setItem('userId', data.user._id);
            localStorage.setItem('token', data.token);
            // Redireciona para a página correta após o login
            window.location.href = './public/board-page.html';
        } else {
            if (window.toastManager) {
                window.toastManager.error(data.mensagem || 'Erro ao fazer login');
            } else {
                alert(data.mensagem || 'Erro ao fazer login');
            }
        }
    } catch (error) {
        if (window.toastManager) {
            window.toastManager.error('Erro na conexão com o servidor.');
        } else {
            alert('Erro na conexão com o servidor.');
        }
        console.error(error);
    }
}


// Função para fazer logout
function logoutUser() {
    // Remove todas as chaves de autenticação para garantir a saída
    localStorage.removeItem('userData');
    localStorage.removeItem('userId');
    localStorage.removeItem('token');
    window.location.href = '../index.html';
}

// Função para verificar se o usuário está logado
function isUserLoggedIn() {
    // A verificação é feita pela existência do token, que é a informação de autenticação
    return !!localStorage.getItem('token');
}

// Função para redirecionar se não estiver logado
function requireLogin() {
    if (!isUserLoggedIn()) {
        window.location.href = '../index.html';
    }
}

// Exportar funções
window.auth = {
    registerUser,
    loginUserLocal,
    loginUserApi,
    logoutUser,
    isUserLoggedIn,
    requireLogin,
    validateEmail,
    validatePassword
};