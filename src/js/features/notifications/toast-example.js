// Exemplo de uso do sistema de notificações toast
// Este arquivo demonstra como usar as notificações temáticas

// Função para demonstrar diferentes tipos de notificações
function demonstrateToastNotifications() {
    // Notificação de sucesso
    if (window.toastManager) {
        window.toastManager.success('Operação realizada com sucesso!');
    }

    // Notificação de erro
    setTimeout(() => {
        if (window.toastManager) {
            window.toastManager.error('Ocorreu um erro na operação');
        }
    }, 2000);

    // Notificação de aviso
    setTimeout(() => {
        if (window.toastManager) {
            window.toastManager.warning('Atenção: Esta ação não pode ser desfeita');
        }
    }, 4000);

    // Notificação de informação
    setTimeout(() => {
        if (window.toastManager) {
            window.toastManager.info('Sistema atualizado com sucesso');
        }
    }, 6000);
}

// Função para demonstrar notificações com duração personalizada
function demonstrateCustomDuration() {
    if (window.toastManager) {
        // Notificação que permanece por 10 segundos
        window.toastManager.show('Esta notificação permanecerá por 10 segundos', 'info', 10000);
        
        // Notificação que permanece por 3 segundos
        setTimeout(() => {
            window.toastManager.show('Esta notificação permanecerá por 3 segundos', 'success', 3000);
        }, 2000);
    }
}

// Função para limpar todas as notificações
function clearAllNotifications() {
    if (window.toastManager) {
        window.toastManager.clearAll();
    }
}

// Exemplo de integração com o sistema de temas
function updateToastTheme() {
    if (window.toastManager) {
        window.toastManager.updateTheme();
    }
}

// Adicionar botões de demonstração ao DOM (opcional)
function addDemoButtons() {
    const demoContainer = document.createElement('div');
    demoContainer.className = 'toast-demo-container';
    demoContainer.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 20px;
        z-index: 10000;
        display: flex;
        flex-direction: column;
        gap: 10px;
    `;

    demoContainer.innerHTML = `
        <button onclick="demonstrateToastNotifications()" style="padding: 8px 16px; background: #3B82F6; color: white; border: none; border-radius: 4px; cursor: pointer;">
            Demonstrar Notificações
        </button>
        <button onclick="demonstrateCustomDuration()" style="padding: 8px 16px; background: #10B981; color: white; border: none; border-radius: 4px; cursor: pointer;">
            Duração Personalizada
        </button>
        <button onclick="clearAllNotifications()" style="padding: 8px 16px; background: #EF4444; color: white; border: none; border-radius: 4px; cursor: pointer;">
            Limpar Todas
        </button>
    `;

    document.body.appendChild(demoContainer);
}

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    // Aguardar um pouco para garantir que o toastManager esteja carregado
    setTimeout(() => {
        if (window.toastManager) {
            console.log('Sistema de notificações toast carregado com sucesso!');
            
            // Mostrar uma notificação de boas-vindas
            window.toastManager.info('Sistema de notificações temáticas ativo!');
            
            // Adicionar botões de demonstração (opcional - remover em produção)
            // addDemoButtons();
        } else {
            console.warn('Sistema de notificações toast não encontrado');
        }
    }, 1000);
});

// Exportar funções para uso global
window.toastExamples = {
    demonstrateToastNotifications,
    demonstrateCustomDuration,
    clearAllNotifications,
    updateToastTheme,
    addDemoButtons
}; 