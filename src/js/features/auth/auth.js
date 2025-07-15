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

// Função para registrar um novo usuário
function registerUser(email, nomeCompleto, senha) {
    // Validar email
    if (!validateEmail(email)) {
        throw new Error('Email inválido');
    }

    // Validar senha
    if (!validatePassword(senha)) {
        throw new Error('A senha deve ter no mínimo 8 caracteres e não pode conter espaços');
    }

    // Verificar se o usuário já existe
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.some(user => user.email === email)) {
        throw new Error('Este email já está cadastrado');
    }

    // Criar novo usuário
    const newUser = {
        email,
        nomeCompleto,
        senha, // Em um ambiente real, a senha deveria ser criptografada
        dataCadastro: new Date().toISOString()
    };

    // Salvar usuário
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    // Criar dados do usuário
    const userData = {
        email,
        nomeCompleto,
        dataCadastro: newUser.dataCadastro
    };
    localStorage.setItem('userData', JSON.stringify(userData));

    return userData;
}

// Função para fazer login
function loginUser(email, senha) {
    // Validar email
    if (!validateEmail(email)) {
        throw new Error('Email inválido');
    }

    // Buscar usuário
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email);

    if (!user) {
        throw new Error('Usuário não encontrado');
    }

    // Verificar senha
    if (user.senha !== senha) {
        throw new Error('Senha incorreta');
    }

    // Criar dados do usuário
    const userData = {
        email: user.email,
        nomeCompleto: user.nomeCompleto,
        dataCadastro: user.dataCadastro
    };
    localStorage.setItem('userData', JSON.stringify(userData));

    return userData;
}

// Função para fazer logout
function logoutUser() {
    localStorage.removeItem('userData');
    window.location.href = '../index.html';
}

// Função para verificar se o usuário está logado
function isUserLoggedIn() {
    return !!localStorage.getItem('userData');
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
    loginUser,
    logoutUser,
    isUserLoggedIn,
    requireLogin,
    validateEmail,
    validatePassword
}; 