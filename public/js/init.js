// Inicialização do quadro
document.addEventListener('DOMContentLoaded', () => {
    // Estado inicial do quadro
    window.boardState = {
        lists: {
            'para-fazer': [],
            'fazendo': [],
            'concluido': []
        }
    };

    // Configuração das etiquetas
    window.labels = {
        design: { text: 'Design', color: 'bg-blue-500' },
        frontend: { text: 'Frontend', color: 'bg-purple-500' },
        backend: { text: 'Backend', color: 'bg-yellow-500' },
        feature: { text: 'Feature', color: 'bg-green-500' },
        urgent: { text: 'Urgente', color: 'bg-red-500' },
        uiux: { text: 'UI/UX', color: 'bg-indigo-500' }
    };

    // Carrega o estado salvo
    const savedState = localStorage.getItem('boardState');
    if (savedState) {
        window.boardState = JSON.parse(savedState);
    }

    // Inicializa os botões
    const addListButton = document.querySelector('.add-list-btn');
    if (addListButton) {
        addListButton.addEventListener('click', () => window.showAddListModal());
    }

    const addCardButtons = document.querySelectorAll('.add-card-btn');
    addCardButtons.forEach(button => {
        const listId = button.closest('.list').id;
        button.addEventListener('click', () => window.showAddCardModal(listId));
    });

    // Renderiza o quadro inicial
    window.renderBoard();
});
