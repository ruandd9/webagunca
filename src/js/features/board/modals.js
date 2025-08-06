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
                    <label class="block text-sm font-medium mb-1">Prazo</label>
                    <input type="datetime-local" class="w-full bg-gray-700 text-white rounded px-3 py-2">
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
    const deadlineInput = modal.querySelector('input[type="datetime-local"]');
    const labelCheckboxes = modal.querySelectorAll('input[type="checkbox"]');

    const closeModal = () => modal.remove();

    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    createBtn.addEventListener('click', async () => {
        const title = titleInput.value.trim();
        if (!title) {
            titleInput.classList.add('border', 'border-red-500');
            return;
        }

        const selectedLabels = [...labelCheckboxes]
            .filter(cb => cb.checked)
            .map(cb => cb.value);

        try {
            // Obter boardId da URL
            const urlParams = new URLSearchParams(window.location.search);
            const boardId = urlParams.get('board');
            
            if (!boardId) {
                throw new Error('ID do quadro não encontrado');
            }

            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Token de autenticação não encontrado');
            }

            // Criar card no banco de dados
            const response = await fetch('http://localhost:5000/api/cards', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    boardId,
                    listId,
                    title,
                    description: descriptionInput.value.trim(),
                    dueDate: deadlineInput.value || null
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.mensagem || 'Erro ao criar card.');
            }

            const newCard = await response.json();
            
            // Salvar etiquetas no banco de dados
            if (selectedLabels.length > 0) {
                console.log('Etiquetas selecionadas:', selectedLabels);
                for (const labelKey of selectedLabels) {
                    const label = window.labels[labelKey];
                    console.log('Processando etiqueta:', labelKey, label);
                    if (label) {
                        try {
                            console.log('Salvando etiqueta no banco:', {
                                cardId: newCard.card._id,
                                name: label.text,
                                color: label.color
                            });
                            
                            const labelResponse = await fetch('http://localhost:5000/api/card-labels', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': `Bearer ${token}`
                                },
                                body: JSON.stringify({
                                    cardId: newCard.card._id,
                                    name: label.text,
                                    color: label.color
                                })
                            });
                            
                            console.log('Resposta da criação de etiqueta:', labelResponse.status);
                            
                            if (!labelResponse.ok) {
                                const errorData = await labelResponse.json();
                                console.error('Erro ao salvar etiqueta:', errorData);
                            } else {
                                const savedLabel = await labelResponse.json();
                                console.log('Etiqueta salva com sucesso:', savedLabel);
                            }
                        } catch (labelError) {
                            console.error('Erro ao salvar etiqueta:', labelError);
                            // Não falhar o card se a etiqueta não salvar
                        }
                    }
                }
            } else {
                console.log('Nenhuma etiqueta selecionada');
            }
            
            // Adicionar ao estado local
            const card = {
                id: newCard.card._id,
                title: newCard.card.title,
                description: newCard.card.description,
                deadline: newCard.card.dueDate,
                labels: selectedLabels,
                comments: 0,
                attachments: 0,
                assignees: [],
                createdAt: newCard.card.createdAt,
                completed: newCard.card.completed
            };

            // Garante que a lista existe
            if (!window.boardState.lists[listId]) {
                window.boardState.lists[listId] = [];
            }

            // Adiciona o cartão
            window.boardState.lists[listId].push(card);
            
            // Renderiza
            window.renderBoard();
            
            closeModal();
        } catch (error) {
            console.error('Erro ao criar card:', error);
            if (window.toastManager) {
                window.toastManager.error('Erro ao criar card: ' + error.message);
            } else {
                alert('Erro ao criar card: ' + error.message);
            }
        }
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

    createBtn.addEventListener('click', async () => {
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

        try {
            // Obter o ID do quadro da URL
            const urlParams = new URLSearchParams(window.location.search);
            const boardId = urlParams.get('board');
            
            if (!boardId) {
                window.showErrorModal('ID do quadro não encontrado');
                return;
            }

            // Salvar a lista no banco de dados
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/lists', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    boardId: boardId,
                    name: title,
                    position: Object.keys(window.boardState.lists).length // Posição baseada no número de listas existentes
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.mensagem || 'Erro ao criar lista.');
            }

            const newListData = await response.json();

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
        } catch (error) {
            console.error('Erro ao criar lista:', error);
            window.showErrorModal('Erro ao criar lista: ' + error.message);
        }
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

                <!-- Prazo -->
                <div>
                    <label class="block text-sm font-medium mb-2">Prazo</label>
                    <input type="datetime-local" class="w-full bg-gray-700 text-white rounded px-3 py-2" value="${card.deadline || ''}">
                </div>

                <!-- Etiquetas -->
                <div>
                    <h4 class="font-medium mb-2">Etiquetas</h4>
                    <div class="grid grid-cols-2 gap-2">
                        ${Object.entries(window.labels).map(([key, label]) => `
                            <label class="flex items-center space-x-2 p-2 rounded hover:bg-gray-700 cursor-pointer">
                                <input type="checkbox" value="${key}" ${card.labels && card.labels.includes(key) ? 'checked' : ''}>
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
                            <div class="bg-gray-700 rounded p-3" data-comment-id="${comment.id}">
                                <div class="flex items-center mb-2">
                                    <img src="${comment.authorImage ? comment.authorImage : 'https://ui-avatars.com/api/?name=' + encodeURIComponent(comment.author)}" 
                                         alt="${comment.author}" 
                                         class="w-6 h-6 rounded-full mr-2">
                                    <span class="font-medium">${comment.author}</span>
                                    <span class="text-gray-400 text-sm ml-2">${new Date(comment.date).toLocaleDateString('pt-BR')}</span>
                                    <div class="ml-auto flex space-x-2">
                                        <button class="edit-comment text-white hover:text-blue-300 text-sm bg-blue-500 px-2 py-1 rounded">
                                            Editar
                                        </button>
                                        <button class="delete-comment text-white hover:text-red-300 text-sm bg-red-500 px-2 py-1 rounded">
                                            Excluir
                                        </button>
                                    </div>
                                </div>
                                <p class="text-sm comment-text">${comment.text}</p>
                                <div class="edit-comment-form hidden mt-2">
                                    <textarea class="w-full bg-gray-600 text-white rounded px-3 py-2 h-20 mb-2 edit-comment-text">${comment.text}</textarea>
                                    <div class="flex justify-end space-x-2">
                                        <button class="cancel-edit px-3 py-1 text-gray-400 hover:text-white">Cancelar</button>
                                        <button class="save-edit px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">Salvar</button>
                                    </div>
                                </div>
                            </div>
                        `).join('') : ''}
                        
                        <!-- Adicionar comentário -->
                        <div class="flex items-start space-x-2">
                            <img id="userCommentProfileImg" src="https://ui-avatars.com/api/?name=User" 
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
                    <button class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 delete">Excluir</button>
                    <button class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 complete">Marcar como Concluído</button>
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
    const deleteBtn = modal.querySelector('.delete');
    const completeBtn = modal.querySelector('.complete');
    const titleInput = modal.querySelector('input[type="text"]');
    const descriptionInput = modal.querySelector('textarea:not(.new-comment)');
    const deadlineInput = modal.querySelector('input[type="datetime-local"]');
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
        commentElement.dataset.commentId = comment.id;
        commentElement.innerHTML = `
            <div class="flex items-center mb-2">
                <img src="https://ui-avatars.com/api/?name=${comment.author}" 
                     alt="${comment.author}" 
                     class="w-6 h-6 rounded-full mr-2">
                <span class="font-medium">${comment.author}</span>
                <span class="text-gray-400 text-sm ml-2">${new Date(comment.date).toLocaleDateString('pt-BR')}</span>
                <div class="ml-auto flex space-x-2">
                    <button class="edit-comment text-white hover:text-blue-300 text-sm bg-blue-500 px-2 py-1 rounded">
                        Editar
                    </button>
                    <button class="delete-comment text-white hover:text-red-300 text-sm bg-red-500 px-2 py-1 rounded">
                        Excluir
                    </button>
                </div>
            </div>
            <p class="text-sm comment-text">${comment.text}</p>
            <div class="edit-comment-form hidden mt-2">
                <textarea class="w-full bg-gray-600 text-white rounded px-3 py-2 h-20 mb-2 edit-comment-text">${comment.text}</textarea>
                <div class="flex justify-end space-x-2">
                    <button class="cancel-edit px-3 py-1 text-gray-400 hover:text-white">Cancelar</button>
                    <button class="save-edit px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">Salvar</button>
                </div>
            </div>
        `;
        commentsContainer.insertBefore(commentElement, commentsContainer.lastElementChild);
        newCommentInput.value = '';

        // Adicionar eventos para os novos botões
        setupCommentButtons(commentElement, card, comment.id);
    });

    // Função para configurar os botões de comentário
    function setupCommentButtons(commentElement, card, commentId) {
        const editBtn = commentElement.querySelector('.edit-comment');
        const deleteBtn = commentElement.querySelector('.delete-comment');
        const editForm = commentElement.querySelector('.edit-comment-form');
        const commentText = commentElement.querySelector('.comment-text');
        const editTextarea = commentElement.querySelector('.edit-comment-text');
        const cancelEditBtn = commentElement.querySelector('.cancel-edit');
        const saveEditBtn = commentElement.querySelector('.save-edit');

        // Editar comentário
        editBtn.addEventListener('click', () => {
            editForm.classList.remove('hidden');
            commentText.classList.add('hidden');
        });

        // Cancelar edição
        cancelEditBtn.addEventListener('click', () => {
            editForm.classList.add('hidden');
            commentText.classList.remove('hidden');
            editTextarea.value = commentText.textContent;
        });

        // Salvar edição
        saveEditBtn.addEventListener('click', () => {
            const newText = editTextarea.value.trim();
            if (!newText) return;

            const comment = card.comments.find(c => c.id === commentId);
            if (comment) {
                comment.text = newText;
                commentText.textContent = newText;
                window.saveBoardState();
            }

            editForm.classList.add('hidden');
            commentText.classList.remove('hidden');
        });

        // Excluir comentário
        deleteBtn.addEventListener('click', () => {
            if (confirm('Tem certeza que deseja excluir este comentário?')) {
                const commentIndex = card.comments.findIndex(c => c.id === commentId);
                if (commentIndex !== -1) {
                    card.comments.splice(commentIndex, 1);
                    commentElement.remove();
                    window.saveBoardState();
                }
            }
        });
    }

    // Configurar botões para comentários existentes
    modal.querySelectorAll('[data-comment-id]').forEach(commentElement => {
        const commentId = commentElement.dataset.commentId;
        setupCommentButtons(commentElement, card, commentId);
    });

    // Salvar alterações
    saveBtn.addEventListener('click', async () => {
        const title = titleInput.value.trim();
        if (!title) {
            titleInput.classList.add('border', 'border-red-500');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Token de autenticação não encontrado');
            }

            // Atualizar card no banco de dados
            const response = await fetch(`http://localhost:5000/api/cards/${card.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    title,
                    description: descriptionInput.value.trim(),
                    dueDate: deadlineInput.value || null
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.mensagem || 'Erro ao atualizar card.');
            }

            // Atualizar estado local
            card.title = title;
            card.description = descriptionInput.value.trim();
            card.deadline = deadlineInput.value;
            card.labels = [...labelCheckboxes]
                .filter(cb => cb.checked)
                .map(cb => cb.value);

            window.renderBoard();
            closeModal();
        } catch (error) {
            console.error('Erro ao atualizar card:', error);
            if (window.toastManager) {
                window.toastManager.error('Erro ao atualizar card: ' + error.message);
            } else {
                alert('Erro ao atualizar card: ' + error.message);
            }
        }
    });

    deleteBtn.addEventListener('click', () => {
        window.showConfirmModal('Tem certeza que deseja excluir este cartão?', async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('Token de autenticação não encontrado');
                }

                // Deletar card do banco de dados
                const response = await fetch(`http://localhost:5000/api/cards/${card.id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.mensagem || 'Erro ao deletar card.');
                }

                // Remover do estado local
                for (const listId in window.boardState.lists) {
                    const idx = window.boardState.lists[listId].findIndex(c => c.id === card.id);
                    if (idx !== -1) {
                        window.boardState.lists[listId].splice(idx, 1);
                        break;
                    }
                }
                
                window.renderBoard();
                closeModal();
            } catch (error) {
                console.error('Erro ao deletar card:', error);
                if (window.toastManager) {
                    window.toastManager.error('Erro ao deletar card: ' + error.message);
                } else {
                    alert('Erro ao deletar card: ' + error.message);
                }
            }
        });
    });

    // Adicionar evento para marcar como concluído
    completeBtn.addEventListener('click', async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Token de autenticação não encontrado');
            }

            // Atualizar card no banco de dados para marcar como concluído
            const response = await fetch(`http://localhost:5000/api/cards/${card.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    listId: 'concluido',
                    completed: true
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.mensagem || 'Erro ao marcar card como concluído.');
            }

            // Verifica se a lista "concluido" existe, se não, cria
            if (!window.boardState.lists['concluido']) {
                window.boardState.lists['concluido'] = [];
            }

            // Encontra o cartão na lista atual e remove
            for (const listId in window.boardState.lists) {
                const idx = window.boardState.lists[listId].findIndex(c => c.id === card.id);
                if (idx !== -1) {
                    const [movedCard] = window.boardState.lists[listId].splice(idx, 1);
                    movedCard.completed = true;
                    // Adiciona o cartão à lista "concluido"
                    window.boardState.lists['concluido'].push(movedCard);
                    break;
                }
            }
            
            window.renderBoard();
            closeModal();
        } catch (error) {
            console.error('Erro ao marcar card como concluído:', error);
            if (window.toastManager) {
                window.toastManager.error('Erro ao marcar card como concluído: ' + error.message);
            } else {
                alert('Erro ao marcar card como concluído: ' + error.message);
            }
        }
    });
}

// Função para atualizar etiquetas de um card
window.updateCardLabels = async function(cardId, selectedLabels) {
    try {
        const token = localStorage.getItem('token');
        
        // Primeiro, buscar etiquetas existentes
        const existingLabelsResponse = await fetch(`http://localhost:5000/api/card-labels/card/${cardId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (existingLabelsResponse.ok) {
            const existingLabels = await existingLabelsResponse.json();
            
            // Deletar etiquetas que não estão mais selecionadas
            for (const existingLabel of existingLabels) {
                const labelKey = Object.keys(window.labels).find(key => 
                    window.labels[key].text === existingLabel.name && 
                    window.labels[key].color === existingLabel.color
                );
                
                if (!selectedLabels.includes(labelKey)) {
                    await fetch(`http://localhost:5000/api/card-labels/${existingLabel._id}`, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        }
                    });
                }
            }
        }

        // Adicionar novas etiquetas selecionadas
        for (const labelKey of selectedLabels) {
            const label = window.labels[labelKey];
            if (label) {
                // Verificar se a etiqueta já existe
                const labelExists = existingLabelsResponse.ok && 
                    (await existingLabelsResponse.json()).some(existingLabel => 
                        existingLabel.name === label.text && existingLabel.color === label.color
                    );
                
                if (!labelExists) {
                    await fetch('http://localhost:5000/api/card-labels', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({
                            cardId: cardId,
                            name: label.text,
                            color: label.color
                        })
                    });
                }
            }
        }
    } catch (error) {
        console.error('Erro ao atualizar etiquetas:', error);
        throw error;
    }
}

// Modal para adicionar membros ao quadro
window.showAddMemberModal = function(boardId) {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    modal.innerHTML = `
        <div class="bg-gray-800 rounded-lg p-6 w-[500px]">
            <div class="flex justify-between items-start mb-4">
                <h2 class="text-lg font-semibold">Adicionar Membro</h2>
                <button class="text-gray-400 hover:text-white close-modal">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="space-y-4">
                <div>
                    <label class="block text-sm font-medium mb-1">Email do usuário</label>
                    <input type="email" class="w-full bg-gray-700 text-white rounded px-3 py-2" placeholder="Digite o email do usuário...">
                </div>
                <div class="text-sm text-gray-400">
                    <p>• Apenas usuários cadastrados podem ser adicionados</p>
                    <p>• O usuário receberá acesso ao quadro</p>
                    <p>• Apenas o dono do quadro pode adicionar membros</p>
                </div>
                <div class="flex justify-end space-x-2">
                    <button class="px-4 py-2 text-gray-400 hover:text-white cancel">Cancelar</button>
                    <button class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 add-member">Adicionar Membro</button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Event listeners
    const closeBtn = modal.querySelector('.close-modal');
    const cancelBtn = modal.querySelector('.cancel');
    const addMemberBtn = modal.querySelector('.add-member');
    const emailInput = modal.querySelector('input[type="email"]');

    const closeModal = () => modal.remove();

    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    addMemberBtn.addEventListener('click', async () => {
        const email = emailInput.value.trim();
        if (!email) {
            emailInput.classList.add('border', 'border-red-500');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/board-members', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    boardId: boardId,
                    email: email
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.mensagem || 'Erro ao adicionar membro.');
            }

            const result = await response.json();
            if (window.toastManager) {
                window.toastManager.success('Membro adicionado com sucesso!');
            } else {
                alert('Membro adicionado com sucesso!');
            }
            closeModal();
            
            // Recarregar a lista de membros se necessário
            if (typeof loadBoardMembers === 'function') {
                loadBoardMembers(boardId);
            }
        } catch (error) {
            console.error('Erro ao adicionar membro:', error);
            if (window.toastManager) {
                window.toastManager.error('Erro ao adicionar membro: ' + error.message);
            } else {
                alert('Erro ao adicionar membro: ' + error.message);
            }
        }
    });
};

// Modal para gerenciar membros do quadro
window.showManageMembersModal = function(boardId) {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    modal.innerHTML = `
        <div class="bg-gray-800 rounded-lg p-6 w-[600px] max-h-[80vh] overflow-y-auto">
            <div class="flex justify-between items-start mb-4">
                <h2 class="text-lg font-semibold">Gerenciar Membros</h2>
                <button class="text-gray-400 hover:text-white close-modal">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="space-y-4">
                <div class="flex justify-between items-center">
                    <h3 class="text-md font-medium">Membros do Quadro</h3>
                    <button class="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 add-new-member">
                        <i class="fas fa-plus mr-1"></i>Adicionar
                    </button>
                </div>
                <div class="members-list space-y-2">
                    <div class="text-center text-gray-400 py-4">
                        <i class="fas fa-spinner fa-spin mr-2"></i>
                        Carregando membros...
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Event listeners
    const closeBtn = modal.querySelector('.close-modal');
    const addNewMemberBtn = modal.querySelector('.add-new-member');

    const closeModal = () => modal.remove();

    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    addNewMemberBtn.addEventListener('click', () => {
        closeModal();
        window.showAddMemberModal(boardId);
    });

    // Carregar membros
    loadBoardMembers(boardId, modal);
};

// Função para carregar membros do quadro
async function loadBoardMembers(boardId, modal = null) {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5000/api/board-members/board/${boardId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Erro ao carregar membros.');
        }

        const members = await response.json();
        
        if (modal) {
            const membersList = modal.querySelector('.members-list');
            if (members.length === 0) {
                membersList.innerHTML = `
                    <div class="text-center text-gray-400 py-4">
                        Nenhum membro adicionado ainda.
                    </div>
                `;
            } else {
                membersList.innerHTML = members.map(member => `
                    <div class="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                        <div class="flex items-center space-x-3">
                            <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-sm font-medium">
                                ${
                                    member?.userId?.nome
                                        ? member.userId.nome.charAt(0).toUpperCase()
                                        : (member?.userId?.email
                                            ? member.userId.email.charAt(0).toUpperCase()
                                            : '?')
                                }
                            </div>
                            <div>
                                <div class="font-medium">${member?.userId?.nome || member?.userId?.email || 'Usuário'}</div>
                                <div class="text-sm text-gray-400">${member?.userId?.email || ''}</div>
                            </div>
                        </div>
                        <button class="text-red-400 hover:text-red-300 p-2 remove-member" data-member-id="${member._id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                `).join('');

                // Adicionar eventos para remover membros
                membersList.querySelectorAll('.remove-member').forEach(btn => {
                    btn.addEventListener('click', async () => {
                        const memberId = btn.dataset.memberId;
                        if (confirm('Tem certeza que deseja remover este membro?')) {
                            try {
                                const deleteResponse = await fetch(`http://localhost:5000/api/board-members/${memberId}`, {
                                    method: 'DELETE',
                                    headers: {
                                        'Content-Type': 'application/json',
                                        'Authorization': `Bearer ${token}`
                                    }
                                });

                                if (!deleteResponse.ok) {
                                    throw new Error('Erro ao remover membro.');
                                }

                                if (window.toastManager) {
                                    window.toastManager.success('Membro removido com sucesso!');
                                } else {
                                    alert('Membro removido com sucesso!');
                                }
                                loadBoardMembers(boardId, modal);
                            } catch (error) {
                                console.error('Erro ao remover membro:', error);
                                if (window.toastManager) {
                                    window.toastManager.error('Erro ao remover membro: ' + error.message);
                                } else {
                                    alert('Erro ao remover membro: ' + error.message);
                                }
                            }
                        }
                    });
                });
            }
        }
    } catch (error) {
        console.error('Erro ao carregar membros:', error);
        if (modal) {
            const membersList = modal.querySelector('.members-list');
            membersList.innerHTML = `
                <div class="text-center text-red-400 py-4">
                    Erro ao carregar membros: ${error.message}
                </div>
            `;
        }
    }
}