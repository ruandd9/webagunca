// Utilitários para interface do chat
class ChatUI {
    constructor() {
        this.initializeThemeControls();
        this.initializeMobileControls();
    }

    // Inicializar controles de tema
    initializeThemeControls() {
        const themeButton = document.getElementById('theme-button');
        const themeDropdown = document.getElementById('theme-dropdown');
        const chatMessagesArea = document.querySelector('.chat-messages-area');

        if (!themeButton || !themeDropdown || !chatMessagesArea) return;

        // Carregar tema salvo
        const savedTheme = localStorage.getItem('chatTheme') || 'default';
        this.applyTheme(savedTheme);

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
                this.applyTheme(theme);
                themeDropdown.classList.remove('active');
            });
        });
    }

    // Aplicar tema
    applyTheme(theme) {
        const chatMessagesArea = document.querySelector('.chat-messages-area');
        if (!chatMessagesArea) return;

        const themes = {
            'default': 'var(--bg-dark)',
            'light': '#F3F4F6',
            'dark-blue': '#1f547e',
            'dark-purple': '#1e1b4b',
            'dark-green': '#1b2d1b'
        };

        chatMessagesArea.style.backgroundColor = themes[theme] || themes['default'];
        localStorage.setItem('chatTheme', theme);
    }

    // Inicializar controles mobile
    initializeMobileControls() {
        const sidebar = document.getElementById('sidebar');
        const mobileMenuButton = document.getElementById('mobile-menu-button');
        
        if (!sidebar || !mobileMenuButton) return;

        let isSidebarOpen = false;

        // Toggle mobile menu
        mobileMenuButton.addEventListener('click', (e) => {
            e.stopPropagation();
            isSidebarOpen = !isSidebarOpen;
            
            if (isSidebarOpen) {
                sidebar.classList.remove('-translate-x-full');
                sidebar.classList.add('translate-x-0');
            } else {
                sidebar.classList.remove('translate-x-0');
                sidebar.classList.add('-translate-x-full');
            }
        });

        // Fechar sidebar ao clicar fora em dispositivos móveis
        document.addEventListener('click', (event) => {
            if (window.innerWidth < 768) {
                if (!sidebar.contains(event.target) && 
                    !mobileMenuButton.contains(event.target) && 
                    isSidebarOpen) {
                    isSidebarOpen = false;
                    sidebar.classList.remove('translate-x-0');
                    sidebar.classList.add('-translate-x-full');
                }
            }
        });

        // Prevenir que o clique dentro da sidebar feche o menu
        sidebar.addEventListener('click', (event) => {
            event.stopPropagation();
        });
    }

    // Formatar data/hora para exibição
    static formatMessageTime(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = (now - date) / (1000 * 60 * 60);

        if (diffInHours < 24) {
            // Menos de 24 horas - mostrar apenas hora
            return date.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
            });
        } else if (diffInHours < 24 * 7) {
            // Menos de uma semana - mostrar dia da semana
            return date.toLocaleDateString([], {
                weekday: 'short',
                hour: '2-digit',
                minute: '2-digit'
            });
        } else {
            // Mais de uma semana - mostrar data completa
            return date.toLocaleDateString([], {
                day: '2-digit',
                month: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            });
        }
    }

    // Criar elemento de notificação
    static createNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span>${message}</span>
                <button class="notification-close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        // Auto-remover após 5 segundos
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);

        // Botão de fechar
        const closeButton = notification.querySelector('.notification-close');
        closeButton.addEventListener('click', () => {
            notification.remove();
        });

        return notification;
    }

    // Mostrar notificação
    static showNotification(message, type = 'info') {
        const notification = ChatUI.createNotification(message, type);
        
        // Adicionar ao container de notificações ou ao body
        let notificationContainer = document.querySelector('.notification-container');
        if (!notificationContainer) {
            notificationContainer = document.createElement('div');
            notificationContainer.className = 'notification-container';
            document.body.appendChild(notificationContainer);
        }

        notificationContainer.appendChild(notification);
    }

    // Validar entrada de mensagem
    static validateMessageInput(content) {
        if (!content || content.trim() === '') {
            return { valid: false, error: 'Mensagem não pode estar vazia' };
        }

        if (content.length > 1000) {
            return { valid: false, error: 'Mensagem muito longa (máximo 1000 caracteres)' };
        }

        return { valid: true };
    }

    // Escapar HTML para prevenir XSS
    static escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Detectar e converter URLs em links
    static linkifyText(text) {
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        return text.replace(urlRegex, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>');
    }

    // Processar conteúdo da mensagem
    static processMessageContent(content) {
        // Escapar HTML primeiro
        let processedContent = ChatUI.escapeHtml(content);
        
        // Converter URLs em links
        processedContent = ChatUI.linkifyText(processedContent);
        
        // Converter quebras de linha
        processedContent = processedContent.replace(/\n/g, '<br>');
        
        return processedContent;
    }

    // Animar entrada de nova mensagem
    static animateNewMessage(messageElement) {
        messageElement.style.opacity = '0';
        messageElement.style.transform = 'translateY(20px)';
        
        // Forçar reflow
        messageElement.offsetHeight;
        
        messageElement.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        messageElement.style.opacity = '1';
        messageElement.style.transform = 'translateY(0)';
    }

    // Scroll suave para elemento
    static smoothScrollToElement(element, container) {
        if (!element || !container) return;

        const containerRect = container.getBoundingClientRect();
        const elementRect = element.getBoundingClientRect();
        
        const scrollTop = container.scrollTop;
        const targetScrollTop = scrollTop + elementRect.top - containerRect.top - (containerRect.height / 2);

        container.scrollTo({
            top: targetScrollTop,
            behavior: 'smooth'
        });
    }

    // Verificar se elemento está visível no container
    static isElementVisible(element, container) {
        if (!element || !container) return false;

        const containerRect = container.getBoundingClientRect();
        const elementRect = element.getBoundingClientRect();

        return (
            elementRect.top >= containerRect.top &&
            elementRect.bottom <= containerRect.bottom
        );
    }
}

// Inicializar UI do chat
const chatUI = new ChatUI();
window.ChatUI = ChatUI;