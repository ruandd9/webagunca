class ToastNotificationManager {
    constructor() {
        this.container = null;
        this.notifications = [];
        this.initialized = false;
    }

    init() {
        if (this.initialized) return;
        
        this.createContainer();
        this.loadTheme();
        this.initialized = true;
        console.log('ToastNotificationManager inicializado');
    }

    createContainer() {
        // Remove container existente se houver
        const existingContainer = document.getElementById('toast-notifications-container');
        if (existingContainer) {
            existingContainer.remove();
        }

        // Cria novo container
        this.container = document.createElement('div');
        this.container.id = 'toast-notifications-container';
        this.container.className = 'toast-notifications-container';
        document.body.appendChild(this.container);
    }

    loadTheme() {
        // Aplica o tema atual às notificações
        const currentTheme = localStorage.getItem('theme') || 'dark';
        this.container.setAttribute('data-theme', currentTheme);
    }

    show(message, type = 'info', duration = 5000) {
        // Garantir que está inicializado
        if (!this.initialized) {
            this.init();
        }
        
        if (!this.container) {
            console.error('Container de toast não encontrado');
            return null;
        }
        
        const notification = this.createNotification(message, type);
        this.container.appendChild(notification);
        this.notifications.push(notification);

        // Animação de entrada
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);

        // Auto-remover após duração
        if (duration > 0) {
            setTimeout(() => {
                this.hide(notification);
            }, duration);
        }

        return notification;
    }

    createNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `toast-notification toast-${type}`;
        
        const icon = this.getIcon(type);
        const title = this.getTitle(type);
        
        notification.innerHTML = `
            <div class="toast-content">
                <div class="toast-icon">
                    ${icon}
                </div>
                <div class="toast-text">
                    <div class="toast-title">${title}</div>
                    <div class="toast-message">${message}</div>
                </div>
                <button class="toast-close" onclick="toastManager.hide(this.parentElement.parentElement)">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>
            <div class="toast-progress"></div>
        `;

        return notification;
    }

    getIcon(type) {
        const icons = {
            success: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22,4 12,14.01 9,11.01"></polyline></svg>',
            error: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>',
            warning: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>',
            info: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>'
        };
        return icons[type] || icons.info;
    }

    getTitle(type) {
        const titles = {
            success: 'Sucesso',
            error: 'Erro',
            warning: 'Aviso',
            info: 'Informação'
        };
        return titles[type] || titles.info;
    }

    hide(notification) {
        if (!notification) return;
        
        notification.classList.add('hiding');
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
            const index = this.notifications.indexOf(notification);
            if (index > -1) {
                this.notifications.splice(index, 1);
            }
        }, 300);
    }

    // Métodos de conveniência
    success(message, duration = 5000) {
        return this.show(message, 'success', duration);
    }

    error(message, duration = 7000) {
        return this.show(message, 'error', duration);
    }

    warning(message, duration = 6000) {
        return this.show(message, 'warning', duration);
    }

    info(message, duration = 5000) {
        return this.show(message, 'info', duration);
    }

    // Limpar todas as notificações
    clearAll() {
        this.notifications.forEach(notification => {
            this.hide(notification);
        });
    }

    // Atualizar tema quando mudar
    updateTheme() {
        this.loadTheme();
    }
}

// Instância global
const toastManager = new ToastNotificationManager();

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    toastManager.init();
});

// Função global para compatibilidade
window.showToast = (message, type = 'info', duration = 5000) => {
    return toastManager.show(message, type, duration);
};

// Exportar para uso em módulos
window.toastManager = toastManager; 