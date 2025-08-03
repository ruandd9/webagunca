// src/js/features/user/userInitials.js

document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (token) {
        // Inicializa as iniciais do usuário e a imagem de perfil
        loadUserInitials();
    }
});

// Função para buscar os dados do usuário e atualizar as iniciais
async function loadUserInitials() {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
        const response = await fetch('http://localhost:5000/api/profile', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const user = await response.json();
            updateUserInitials(user.nomeCompleto);
        } else {
            console.error('Erro ao buscar dados do usuário para as iniciais.');
        }
    } catch (error) {
        console.error('Erro de conexão ao buscar dados do usuário:', error);
    }
}

// Função para gerar as iniciais do nome
function getInitials(name) {
    if (!name) return '';
    const names = name.split(' ');
    let initials = names[0].charAt(0).toUpperCase();
    if (names.length > 1) {
        initials += names[names.length - 1].charAt(0).toUpperCase();
    }
    return initials;
}

// Função para atualizar as iniciais no dropdown
function updateUserInitials(nomeCompleto) {
    const userInitialsDiv = document.getElementById('userInitials');
    if (userInitialsDiv) {
        userInitialsDiv.textContent = getInitials(nomeCompleto);
    }
}