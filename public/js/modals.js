// Configuração das etiquetas disponíveis
window.labels = {
    design: { text: 'Design', color: 'bg-blue-500' },
    frontend: { text: 'Frontend', color: 'bg-purple-500' },
    backend: { text: 'Backend', color: 'bg-yellow-500' },
    feature: { text: 'Feature', color: 'bg-green-500' },
    urgent: { text: 'Urgente', color: 'bg-red-500' },
    uiux: { text: 'UI/UX', color: 'bg-indigo-500' }
};

// Modal de adicionar cartão
window.showAddCardModal = function(listId) {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    modal.innerHTML = `
        <div class="bg-gray-800 rounded-lg p-6 w-[500px]">
            <div class="flex justify-between items-start mb-4">
                <h2 class="text-lg font-semibold">Adicionar cartão</h2>
                <button class="text-gray-400 hover:text-white close-modal">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="space-y-4">
                <div>
                    <label class="block text-sm font-medium mb-1">Título</label>
                    <input type="text" class="w-full bg-gray-700 text-white rounded px-3 py-2" placeholder="Digite o título do cartão...">
                </div>
                <div>
                    <label class="block text-sm font-medium mb-1">Descrição</label>
                    <textarea class="w-full bg-gray-700 text-white rounded px-3 py-2 h-24" placeholder="Digite uma descrição..."></textarea>
                </div>
                <div>
                    <label class="block text-sm font-medium mb-1">Etiquetas</label>
                    <div class="grid grid-cols-2 gap-2">
                        ${Object.entries(window.labels).map(([key, label]) => `
                            <label class="flex items-center space-x-2 p-2 rounded hover:bg-gray-700 cursor-pointer">
                                <input type="checkbox" value="${key}">
                                <span class="w-8 h-2 rounded ${label.color}"></span>
                                <span>${label.text}</span>
                            </label>
                        `).join('')}
                    </div>
                </div>
                <div class="flex justify-end space-x-2">
                    <button class="px-4 py-2 text-gray-400 hover:text-white cancel">Cancelar</button>
                    <button class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 create">Criar cartão</button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Event listeners
    const closeBtn = modal.querySelector('.close-modal');
    const cancelBtn = modal.querySelector('.cancel');
    const createBtn = modal.querySelector('.create');
    const titleInput = modal.querySelector('input[type="text"]');
    const descriptionInput = modal.querySelector('textarea');
    const labelCheckboxes = modal.querySelectorAll('input[type="checkbox"]');

    const closeModal = () => modal.remove();

    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    createBtn.addEventListener('click', () => {
        const title = titleInput.value.trim();
        if (!title) {
            titleInput.classList.add('border', 'border-red-500');
            return;
        }

        const selectedLabels = [...labelCheckboxes]
            .filter(cb => cb.checked)
            .map(cb => cb.value);

        const card = {
            id: Date.now().toString(),
            title,
            description: descriptionInput.value.trim(),
            labels: selectedLabels,
            comments: 0,
            attachments: 0,
            assignees: [],
            createdAt: new Date().toISOString()
        };

        // Garante que a lista existe
        if (!window.boardState.lists[listId]) {
            window.boardState.lists[listId] = [];
        }

        // Adiciona o cartão
        window.boardState.lists[listId].push(card);
        
        // Salva e renderiza
        window.saveBoardState();
        window.renderBoard();
        
        closeModal();
    });
}

// Modal de erro
window.showErrorModal = function(message) {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    modal.innerHTML = `
        <div class="bg-gray-800 rounded-lg p-6 w-[400px] shadow-xl">
            <div class="text-center mb-6">
                <div class="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-red-100">
                    <i class="fas fa-times-circle text-3xl text-red-600"></i>
                </div>
                <h3 class="text-lg font-semibold mb-2">Erro</h3>
                <p class="text-gray-400">${message}</p>
            </div>
            <div class="flex justify-center">
                <button class="ok px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors">
                    OK
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Event listeners
    const okBtn = modal.querySelector('.ok');
    const closeModal = () => modal.remove();

    okBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
};

// Modal de adicionar lista
window.showAddListModal = function() {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    modal.innerHTML = `
        <div class="bg-gray-800 rounded-lg p-6 w-[400px]">
            <div class="flex justify-between items-start mb-4">
                <h2 class="text-lg font-semibold">Adicionar lista</h2>
                <button class="text-gray-400 hover:text-white close-modal">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="space-y-4">
                <div>
                    <label class="block text-sm font-medium mb-1">Título da lista</label>
                    <input type="text" class="w-full bg-gray-700 text-white rounded px-3 py-2" placeholder="Digite o título da lista...">
                </div>
                <div class="flex justify-end space-x-2">
                    <button class="px-4 py-2 text-gray-400 hover:text-white cancel">Cancelar</button>
                    <button class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 create">Criar lista</button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Event listeners
    const closeBtn = modal.querySelector('.close-modal');
    const cancelBtn = modal.querySelector('.cancel');
    const createBtn = modal.querySelector('.create');
    const titleInput = modal.querySelector('input[type="text"]');

    const closeModal = () => modal.remove();

    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    createBtn.addEventListener('click', () => {
        const title = titleInput.value.trim();
        if (!title) {
            titleInput.classList.add('border', 'border-red-500');
            return;
        }

        const listId = title.toLowerCase().replace(/\s+/g, '-');
        if (window.boardState.lists[listId]) {
            titleInput.classList.add('border', 'border-red-500');
            window.showErrorModal('Já existe uma lista com este nome. Por favor, escolha um nome diferente.');
            return;
        }

        // Cria a nova lista no DOM
        const board = document.querySelector('.flex.space-x-6');
        const addListBtn = document.querySelector('.add-list-btn');
        
        const newList = document.createElement('div');
        newList.id = listId;
        newList.className = 'list w-80 bg-gray-800 rounded-lg p-4 flex flex-col';
        newList.innerHTML = `
            <div class="flex justify-between items-center mb-4">
                <h2 class="text-lg font-semibold">${title}</h2>
                <button class="text-gray-400 hover:text-white delete-list-btn">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
            <div class="list-content space-y-4 flex-1">
            </div>
            <button class="add-card-btn w-full text-gray-400 hover:text-white text-sm py-2 flex items-center justify-center">
                <i class="fas fa-plus mr-2"></i>
                Adicionar cartão
            </button>
        `;

        // Insere a nova lista antes do botão de adicionar
        board.insertBefore(newList, addListBtn);

        // Atualiza o estado
        if (!window.boardState) {
            window.boardState = { lists: {} };
        }
        if (!window.boardState.lists) {
            window.boardState.lists = {};
        }
        window.boardState.lists[listId] = [];
        window.saveBoardState();

        // Adiciona eventos
        const addCardBtn = newList.querySelector('.add-card-btn');
        addCardBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            window.showAddCardModal(listId);
        });

        const deleteListBtn = newList.querySelector('.delete-list-btn');
        deleteListBtn.addEventListener('click', () => window.deleteList(listId));

        // Adiciona eventos de drag & drop
        const listContent = newList.querySelector('.list-content');
        if (listContent) {
            listContent.addEventListener('dragover', (e) => {
                e.preventDefault();
                const draggingOver = listContent.querySelector('.dragging-over');
                if (!draggingOver) {
                    listContent.classList.add('dragging-over');
                }
            });
            
            listContent.addEventListener('dragleave', (e) => {
                if (!e.relatedTarget || !listContent.contains(e.relatedTarget)) {
                    listContent.classList.remove('dragging-over');
                }
            });
            
            listContent.addEventListener('drop', (e) => {
                e.preventDefault();
                listContent.classList.remove('dragging-over');
                
                if (window.draggedCard && window.originalList) {
                    const targetList = listContent.closest('.list');
                    const targetListId = targetList.id;
                    const sourceListId = window.originalList.id;
                    
                    // Move o cartão para a nova lista
                    const cardId = window.draggedCard.dataset.cardId;
                    const cardIndex = window.boardState.lists[sourceListId].findIndex(card => card.id === cardId);
                    
                    if (cardIndex !== -1) {
                        const [movedCard] = window.boardState.lists[sourceListId].splice(cardIndex, 1);
                        window.boardState.lists[targetListId].push(movedCard);
                        
                        window.saveBoardState();
                        window.renderBoard();
                    }
                }
            });
        }
        
        closeModal();
    });
}

// Modal de visualizar/editar cartão
window.showCardModal = function(card) {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    modal.innerHTML = `
        <div class="bg-gray-800 rounded-lg p-6 w-[600px]">
            <div class="flex justify-between items-start mb-4">
                <div class="flex-1">
                    <input type="text" class="w-full bg-transparent text-xl font-semibold mb-2" value="${card.title}">
                    <div class="text-sm text-gray-400">
                        Criado em ${new Date(card.createdAt).toLocaleDateString('pt-BR')}
                    </div>
                </div>
                <button class="text-gray-400 hover:text-white close-modal">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="space-y-6">
                <!-- Descrição -->
                <div>
                    <label class="block text-sm font-medium mb-2">Descrição</label>
                    <textarea class="w-full bg-gray-700 text-white rounded px-3 py-2 h-32">${card.description || ''}</textarea>
                </div>

                <!-- Etiquetas -->
                <div>
                    <h4 class="font-medium mb-2">Etiquetas</h4>
                    <div class="grid grid-cols-2 gap-2">
                        ${Object.entries(window.labels).map(([key, label]) => `
                            <label class="flex items-center space-x-2 p-2 rounded hover:bg-gray-700 cursor-pointer">
                                <input type="checkbox" value="${key}" ${card.labels.includes(key) ? 'checked' : ''}>
                                <span class="w-8 h-2 rounded ${label.color}"></span>
                                <span>${label.text}</span>
                            </label>
                        `).join('')}
                    </div>
                </div>

                <!-- Comentários -->
                <div>
                    <h4 class="font-medium mb-2">Comentários</h4>
                    <div class="space-y-4">
                        ${card.comments && Array.isArray(card.comments) ? card.comments.map(comment => `
                            <div class="bg-gray-700 rounded p-3">
                                <div class="flex items-center mb-2">
                                    <img src="https://ui-avatars.com/api/?name=${comment.author}" 
                                         alt="${comment.author}" 
                                         class="w-6 h-6 rounded-full mr-2">
                                    <span class="font-medium">${comment.author}</span>
                                    <span class="text-gray-400 text-sm ml-2">${new Date(comment.date).toLocaleDateString('pt-BR')}</span>
                                </div>
                                <p class="text-sm">${comment.text}</p>
                            </div>
                        `).join('') : ''}
                        
                        <!-- Adicionar comentário -->
                        <div class="flex items-start space-x-2">
                            <img src="https://ui-avatars.com/api/?name=User" 
                                 alt="User" 
                                 class="w-8 h-8 rounded-full">
                            <div class="flex-1">
                                <textarea class="w-full bg-gray-700 text-white rounded px-3 py-2 h-20 mb-2 new-comment" 
                                          placeholder="Adicione um comentário..."></textarea>
                                <button class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 add-comment">
                                    Adicionar comentário
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Ações -->
                <div class="flex justify-end space-x-2 pt-4 border-t border-gray-700">
                    <button class="px-4 py-2 text-gray-400 hover:text-white cancel">Cancelar</button>
                    <button class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 save">Salvar alterações</button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Event listeners
    const closeBtn = modal.querySelector('.close-modal');
    const cancelBtn = modal.querySelector('.cancel');
    const saveBtn = modal.querySelector('.save');
    const titleInput = modal.querySelector('input[type="text"]');
    const descriptionInput = modal.querySelector('textarea:not(.new-comment)');
    const labelCheckboxes = modal.querySelectorAll('input[type="checkbox"]');
    const addCommentBtn = modal.querySelector('.add-comment');
    const newCommentInput = modal.querySelector('.new-comment');

    const closeModal = () => modal.remove();

    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    // Adicionar comentário
    addCommentBtn.addEventListener('click', () => {
        const commentText = newCommentInput.value.trim();
        if (!commentText) return;

        if (!card.comments) {
            card.comments = [];
        }

        const comment = {
            id: Date.now().toString(),
            author: 'User',
            text: commentText,
            date: new Date().toISOString()
        };

        card.comments.push(comment);
        window.saveBoardState();

        // Atualiza a lista de comentários
        const commentsContainer = modal.querySelector('.space-y-4');
        const commentElement = document.createElement('div');
        commentElement.className = 'bg-gray-700 rounded p-3';
        commentElement.innerHTML = `
            <div class="flex items-center mb-2">
                <img src="https://ui-avatars.com/api/?name=${comment.author}" 
                     alt="${comment.author}" 
                     class="w-6 h-6 rounded-full mr-2">
                <span class="font-medium">${comment.author}</span>
                <span class="text-gray-400 text-sm ml-2">${new Date(comment.date).toLocaleDateString('pt-BR')}</span>
            </div>
            <p class="text-sm">${comment.text}</p>
        `;
        commentsContainer.insertBefore(commentElement, commentsContainer.lastElementChild);
        newCommentInput.value = '';
    });

    // Salvar alterações
    saveBtn.addEventListener('click', () => {
        const title = titleInput.value.trim();
        if (!title) {
            titleInput.classList.add('border', 'border-red-500');
            return;
        }

        card.title = title;
        card.description = descriptionInput.value.trim();
        card.labels = [...labelCheckboxes]
            .filter(cb => cb.checked)
            .map(cb => cb.value);

        window.saveBoardState();
        window.renderBoard();
        closeModal();
    });
}
