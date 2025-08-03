// Função para atualizar o logo baseado no tema
function updateLogoForTheme(theme) {
    // Selecionar todas as imagens que podem ser logos (incluindo logoBag.png)
    const logoImages = document.querySelectorAll('img[alt*="Logo"], img[alt*="logo"], img[src*="logo"], img[src*="Logo"], img[src*="logoBag"]');
    
    logoImages.forEach((img) => {
        // Determinar o caminho base baseado na localização atual
        const isInPublicFolder = window.location.pathname.includes('/public/');
        const basePath = isInPublicFolder ? '../src/img/' : './src/img/';
        
        if (theme === 'light') {
            // Usar logo preto para tema claro
            if (img.src.includes('logoBag.png') || img.src.includes('logo-bagunca.svg') || img.src.includes('logo-bagunca-colorida')) {
                img.src = basePath + 'logo-bagunca-preto.svg';
            }
        } else {
            // Usar logo colorido para temas escuros
            if (img.src.includes('logo-bagunca-preto.svg')) {
                img.src = basePath + 'logoBag.png';
            }
        }
    });
}

// Função global para forçar atualização do logo (pode ser chamada externamente)
window.updateLogo = function(theme) {
    const currentTheme = theme || document.documentElement.getAttribute('data-theme') || 'dark';
    // Usar setTimeout para garantir que o DOM foi atualizado
    setTimeout(() => {
        updateLogoForTheme(currentTheme);
    }, 10);
};

// Função para aplicar o tema salvo
function applySavedTheme() {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const savedTheme = userData.tema || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    // Atualizar classes do body
    document.body.classList.remove('bg-gray-900', 'text-white');
    document.body.classList.add('bg-gray-900', 'text-white');
    
    // Atualizar logo baseado no tema
    updateLogoForTheme(savedTheme);
    
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
    
    // Atualizar logo baseado no tema
    updateLogoForTheme(theme);
    
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

// Observer para detectar mudanças no tema em tempo real
function setupThemeObserver() {
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
                const currentTheme = document.documentElement.getAttribute('data-theme');
                updateLogoForTheme(currentTheme);
            }
        });
    });

    observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-theme']
    });
}

// Aplicar o tema quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    // Aplicar o tamanho de fonte salvo
    if (typeof fontManager !== 'undefined') {
        fontManager.applySavedFontSize();
    }
    
    applySavedTheme();
    
    // Configurar observer para mudanças de tema
    setupThemeObserver();
    
    // Adicionar evento para mudança de tema
    document.querySelectorAll('.theme-button').forEach(button => {
        button.addEventListener('click', () => {
            const theme = button.getAttribute('data-theme');
            changeTheme(theme);
        });
    });
    
    // Adicionar um pequeno delay para garantir que as imagens carregaram
    setTimeout(() => {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
        updateLogoForTheme(currentTheme);
    }, 100);
}); 