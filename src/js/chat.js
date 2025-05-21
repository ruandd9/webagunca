// Menu mobile principal
document.getElementById('mobile-menu-button').addEventListener('click', function() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('-translate-x-full');
});

// Menu do usuário
const userAvatar = document.querySelector('.dropdown');
const dropdownMenu = document.querySelector('.dropdown-content');

// Elementos do chat
const chatInput = document.querySelector('.chat-input');
const sendButton = document.querySelector('.send-button');
const messagesContainer = document.querySelector('.messages-container');

userAvatar.addEventListener('click', () => {
    dropdownMenu.classList.toggle('active');
});

// Fechar dropdown ao clicar fora
document.addEventListener('click', (e) => {
    if (!userAvatar.contains(e.target) && !dropdownMenu.contains(e.target)) {
        dropdownMenu.classList.remove('active');
    }
});

// Seleção de contato
const contactItems = document.querySelectorAll('.contact-item');
contactItems.forEach(item => {
    item.addEventListener('click', () => {
        contactItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');
    });
});

// Simulação de mensagens antigas (em um caso real, isso viria do backend)
const oldMessages = [
    {
        type: 'incoming',
        content: 'Vamos marcar uma reunião para discutir o projeto?',
        time: '14:25'
    },
    {
        type: 'outgoing',
        content: 'Claro! Que tal amanhã às 10h?',
        time: '14:26'
    },
    {
        type: 'incoming',
        content: 'Perfeito! Vou preparar a apresentação.',
        time: '14:27'
    },
    {
        type: 'outgoing',
        content: 'Ótimo! Vou revisar o código até lá.',
        time: '14:28'
    },
    {
        type: 'incoming',
        content: 'Não esqueça de atualizar a documentação.',
        time: '14:29'
    }
];

let currentPage = 1;
const messagesPerPage = 10;
let isLoading = false;

// Função para criar elemento de mensagem
function createMessageElement(message, isOutgoing = true) {
    const avatar = isOutgoing ? 'YF' : 'RM'; // Em um caso real, isso viria do usuário atual
    const messageHTML = `
        <div class="message-wrapper ${isOutgoing ? 'outgoing' : 'incoming'}">
            <div class="message-avatar">${avatar}</div>
            <div class="message ${isOutgoing ? 'outgoing' : 'incoming'}">
                <div class="message-content">
                    ${message.content}
                </div>
                <span class="message-time">${message.time}</span>
            </div>
        </div>
    `;
    return messageHTML;
}

// Função para carregar mensagens antigas
function loadOldMessages() {
    if (isLoading) return;
    
    isLoading = true;
    const loadingIndicator = document.createElement('div');
    loadingIndicator.className = 'loading-messages';
    loadingIndicator.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Carregando mensagens...';
    messagesContainer.insertBefore(loadingIndicator, messagesContainer.firstChild);

    setTimeout(() => {
        const start = (currentPage - 1) * messagesPerPage;
        const end = start + messagesPerPage;
        const messagesToLoad = oldMessages.slice(start, end);

        if (messagesToLoad.length > 0) {
            const fragment = document.createDocumentFragment();
            messagesToLoad.forEach(message => {
                const messageElement = document.createElement('div');
                messageElement.innerHTML = createMessageElement(message, message.type === 'outgoing');
                fragment.appendChild(messageElement.firstElementChild);
            });

            messagesContainer.removeChild(loadingIndicator);
            const firstMessage = messagesContainer.firstChild;
            messagesContainer.insertBefore(fragment, firstMessage);

            currentPage++;
        } else {
            messagesContainer.removeChild(loadingIndicator);
            const noMoreMessages = document.createElement('div');
            noMoreMessages.className = 'no-more-messages';
            noMoreMessages.textContent = 'Não há mais mensagens para carregar';
            messagesContainer.insertBefore(noMoreMessages, messagesContainer.firstChild);
        }

        isLoading = false;
    }, 1000);
}

// Observador de scroll para detectar quando chegar ao topo
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !isLoading) {
            loadOldMessages();
        }
    });
}, {
    root: messagesContainer,
    threshold: 0.1
});

// Adicionar elemento observador no topo do container
const observerElement = document.createElement('div');
observerElement.className = 'scroll-observer';
messagesContainer.insertBefore(observerElement, messagesContainer.firstChild);
observer.observe(observerElement);

// Função de envio de mensagem
function sendMessage() {
    const message = chatInput.value.trim();
    if (message) {
        const messageHTML = createMessageElement({
            content: message,
            time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
        }, true);
        
        const messageElement = document.createElement('div');
        messageElement.innerHTML = messageHTML;
        messagesContainer.appendChild(messageElement.firstElementChild);
        
        chatInput.value = '';
        messageElement.firstElementChild.scrollIntoView({ behavior: 'smooth' });
    }
}

// Event listeners para envio de mensagem
sendButton.addEventListener('click', sendMessage);
chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

// Scroll automático para a última mensagem ao carregar
messagesContainer.scrollTop = messagesContainer.scrollHeight;

// Controle do menu de temas
const themeButton = document.getElementById('theme-button');
const themeDropdown = document.getElementById('theme-dropdown');
const chatMessagesArea = document.querySelector('.chat-messages-area');

// Tema atual
let currentTheme = 'default';

// Função para aplicar o tema
function applyTheme(theme) {
    const themes = {
        'default': 'var(--bg-dark)',
        'light': '#F3F4F6',
        'dark-blue': '#1f547e',           // Azul escuro mais intenso
        'dark-purple': '#1e1b4b',         // Roxo escuro mais intenso
        'dark-green': '#1b2d1b'
    };

    chatMessagesArea.style.backgroundColor = themes[theme];
    currentTheme = theme;
    localStorage.setItem('chatTheme', theme);
}

// Carregar tema salvo
const savedTheme = localStorage.getItem('chatTheme');
if (savedTheme) {
    applyTheme(savedTheme);
}

// Toggle do dropdown
themeButton.addEventListener('click', (e) => {
    e.stopPropagation();
    themeDropdown.classList.toggle('active');
});

// Fechar dropdown ao clicar fora
document.addEventListener('click', (e) => {
    if (!themeButton.contains(e.target) && !themeDropdown.contains(e.target)) {
        themeDropdown.classList.remove('active');
    }
});

// Seleção de tema
document.querySelectorAll('.theme-option').forEach(option => {
    option.addEventListener('click', () => {
        const theme = option.dataset.theme;
        applyTheme(theme);
        themeDropdown.classList.remove('active');
    });
}); 