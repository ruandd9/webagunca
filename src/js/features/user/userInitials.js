document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (token) {
        // Inicializa as iniciais do usuário e a imagem de perfil
        loadUserInitials();
    }
});

// Função para buscar os dados do usuário e atualizar as iniciais/imagem
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
            updateUserDisplay(user); // Chama uma nova função para lidar com imagem ou iniciais
        } else {
            console.error('Erro ao buscar dados do usuário para as iniciais/imagem.');
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

// Nova função para atualizar a exibição do usuário (imagem ou iniciais)
function updateUserDisplay(user) {
    const userInitialsDiv = document.getElementById('userInitials');
    if (!userInitialsDiv) return;

    if (user.profileImage) {
        // Se houver imagem, define como background e limpa o texto
        userInitialsDiv.style.backgroundImage = `url('${user.profileImage}')`;
        userInitialsDiv.style.backgroundSize = 'cover';
        userInitialsDiv.style.backgroundPosition = 'center';
        userInitialsDiv.textContent = ''; // Limpa o texto das iniciais
    } else {
        // Se não houver imagem, exibe as iniciais e limpa o background
        userInitialsDiv.textContent = getInitials(user.nomeCompleto);
        userInitialsDiv.style.backgroundImage = 'none'; // Remove qualquer imagem de fundo
        userInitialsDiv.style.backgroundColor = '#3B82F6'; // Cor de fundo padrão para iniciais
    }
}