/**
 * Atualiza as iniciais do usuário no elemento com ID 'userInitials'
 */
function updateUserInitials() {
    const userInitialsElement = document.getElementById('userInitials');
    if (!userInitialsElement) return;

    const userData = JSON.parse(localStorage.getItem('userData'));
    if (!userData || !userData.nomeCompleto) {
        userInitialsElement.textContent = 'U';
        return;
    }

    const names = userData.nomeCompleto.split(' ');
    let initials = '';

    if (names.length >= 2) {
        // Pega a primeira letra do primeiro nome e a primeira letra do último nome
        initials = (names[0][0] + names[names.length - 1][0]).toUpperCase();
    } else if (names.length === 1) {
        // Se tiver apenas um nome, pega as duas primeiras letras
        initials = names[0].substring(0, 2).toUpperCase();
    }

    userInitialsElement.textContent = initials;
}

// Atualizar as iniciais quando a página carregar
document.addEventListener('DOMContentLoaded', updateUserInitials);

// Atualizar as iniciais quando houver mudanças no localStorage
window.addEventListener('storage', (event) => {
    if (event.key === 'userData') {
        updateUserInitials();
    }
}); 