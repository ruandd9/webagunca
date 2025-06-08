// Função para aplicar o tema salvo
function applySavedTheme() {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const savedTheme = userData.tema || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    // Atualizar classes do body
    document.body.classList.remove('bg-gray-900', 'text-white');
    document.body.classList.add('bg-gray-900', 'text-white');
    
    // Atualizar visual dos botões de tema se existirem
    document.querySelectorAll('.theme-button').forEach(button => {
        if (button.getAttribute('data-theme') === savedTheme) {
            button.classList.add('ring-2', 'ring-blue-500');
        } else {
            button.classList.remove('ring-2', 'ring-blue-500');
        }
    });
}

// Função para mudar o tema
function changeTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    
    // Atualizar visual dos botões de tema se existirem
    document.querySelectorAll('.theme-button').forEach(button => {
        if (button.getAttribute('data-theme') === theme) {
            button.classList.add('ring-2', 'ring-blue-500');
        } else {
            button.classList.remove('ring-2', 'ring-blue-500');
        }
    });

    // Salvar o tema no localStorage
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    userData.tema = theme;
    localStorage.setItem('userData', JSON.stringify(userData));
}

// Aplicar o tema quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    applySavedTheme();
    
    // Adicionar evento para mudança de tema
    document.querySelectorAll('.theme-button').forEach(button => {
        button.addEventListener('click', () => {
            const theme = button.getAttribute('data-theme');
            changeTheme(theme);
        });
    });
}); 