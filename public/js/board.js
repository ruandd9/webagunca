// Estado dos filtros e drag & drop
window.filters = {
    labels: [],
    search: ''
};

window.draggedCard = null;
window.originalList = null;

// Funções principais
window.saveBoardState = function() {
    localStorage.setItem('boardState', JSON.stringify(window.boardState));
};

window.showConfirmModal = function(message, onConfirm) {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    modal.innerHTML = `
        <div class="bg-gray-800 rounded-lg p-6 w-[400px] shadow-xl">
            <div class="text-center mb-6">
                <div class="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-red-100">
                    <i class="fas fa-exclamation-triangle text-3xl text-red-600"></i>
                </div>
                <h3 class="text-lg font-semibold mb-2">Confirmar exclusão</h3>
                <p class="text-gray-400">${message}</p>
            </div>
            <div class="flex justify-center space-x-3">
                <button class="cancel px-4 py-2 bg-gray-700 text-gray-300 rounded hover:bg-gray-600 transition-colors">
                    Cancelar
                </button>
                <button class="confirm px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors">
                    Excluir
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Event listeners
    const confirmBtn = modal.querySelector('.confirm');
    const cancelBtn = modal.querySelector('.cancel');
    const closeModal = () => modal.remove();

    confirmBtn.addEventListener('click', () => {
        onConfirm();
        closeModal();
    });

    cancelBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
};

window.deleteList = function(listId) {
    window.showConfirmModal('Tem certeza que deseja excluir esta lista e todos os seus cartões?', () => {
        // Remove do estado
        delete window.boardState.lists[listId];
        window.saveBoardState();

        // Remove do DOM
        const listElement = document.getElementById(listId);
        if (listElement) {
            listElement.remove();
        }
    });
};

window.renderBoard = function() {
    Object.keys(window.boardState.lists).forEach(listId => {
        const listElement = document.getElementById(listId);
        if (listElement) {
            // Adiciona evento de excluir lista
            const deleteListBtn = listElement.querySelector('.delete-list-btn');
            if (deleteListBtn) {
                deleteListBtn.onclick = () => window.deleteList(listId);
            }

            const listContent = listElement.querySelector('.list-content');
            if (listContent) {
                // Adiciona eventos de drag & drop na lista
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
                
                // Limpa o conteúdo atual
                listContent.innerHTML = '';
                
                // Filtra e adiciona os cartões
                if (window.boardState.lists[listId] && Array.isArray(window.boardState.lists[listId])) {
                    window.boardState.lists[listId]
                        .filter(card => {
                            // Filtro por etiquetas
                            if (window.filters.labels.length > 0) {
                                if (!card.labels || !Array.isArray(card.labels)) return false;
                                const hasMatchingLabel = card.labels.some(label => 
                                    window.filters.labels.includes(label)
                                );
                                if (!hasMatchingLabel) return false;
                            }

                            // Filtro por texto
                            if (window.filters.search) {
                                const searchLower = window.filters.search.toLowerCase();
                                const titleMatch = card.title.toLowerCase().includes(searchLower);
                                const descMatch = card.description && card.description.toLowerCase().includes(searchLower);
                                if (!titleMatch && !descMatch) return false;
                            }

                            return true;
                        })
                        .forEach(card => {
                            const cardElement = createCardElement(card);
                            if (cardElement) {
                                listContent.appendChild(cardElement);
                            }
                        });
                }

                // Adiciona o botão de adicionar cartão
                const addCardBtn = listElement.querySelector('.add-card-btn');
                if (!addCardBtn) {
                    const newAddCardBtn = document.createElement('button');
                    newAddCardBtn.className = 'add-card-btn w-full text-gray-400 hover:text-white text-sm py-2 flex items-center justify-center';
                    newAddCardBtn.innerHTML = `
                        <i class="fas fa-plus mr-2"></i>
                        Adicionar cartão
                    `;
                    newAddCardBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        window.showAddCardModal(listId);
                    });
                    listElement.appendChild(newAddCardBtn);
                }
            }
        }
    });

    // Atualiza a visibilidade do botão de limpar filtros
    const clearFiltersBtn = document.getElementById('clear-filters');
    if (clearFiltersBtn) {
        clearFiltersBtn.style.display = 
            (window.filters.labels.length > 0 || window.filters.search) ? 'flex' : 'none';
    }

    // Atualiza o contador de filtros ativos
    const activeFiltersCount = document.getElementById('active-filters-count');
    if (activeFiltersCount) {
        const totalFilters = window.filters.labels.length + (window.filters.search ? 1 : 0);
        activeFiltersCount.textContent = totalFilters;
        activeFiltersCount.classList.toggle('hidden', totalFilters === 0);
    }

    // Atualiza a exibição das tags filtradas ativas
    const activeFiltersContainer = document.getElementById('active-filters');
    if (activeFiltersContainer) {
        activeFiltersContainer.innerHTML = '';
        
        // Adiciona as tags de etiquetas
        window.filters.labels.forEach(label => {
            const tag = document.createElement('div');
            tag.className = `px-3 py-1 rounded-full text-sm flex items-center space-x-2 ${window.labels[label].color} text-white`;
            tag.innerHTML = `
                <span>${window.labels[label].text}</span>
                <button class="remove-filter" data-type="label" data-value="${label}">
                    <i class="fas fa-times"></i>
                </button>
            `;
            activeFiltersContainer.appendChild(tag);
        });

        // Adiciona a tag de pesquisa se houver
        if (window.filters.search) {
            const searchTag = document.createElement('div');
            searchTag.className = 'px-3 py-1 rounded-full text-sm flex items-center space-x-2 bg-gray-700 text-white';
            searchTag.innerHTML = `
                <span>Pesquisa: ${window.filters.search}</span>
                <button class="remove-filter" data-type="search">
                    <i class="fas fa-times"></i>
                </button>
            `;
            activeFiltersContainer.appendChild(searchTag);
        }

        // Adiciona eventos para remover filtros individuais
        activeFiltersContainer.querySelectorAll('.remove-filter').forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                const type = button.dataset.type;
                const value = button.dataset.value;

                if (type === 'label') {
                    window.filters.labels = window.filters.labels.filter(l => l !== value);
                    const checkbox = document.querySelector(`.filter-label[value="${value}"]`);
                    if (checkbox) checkbox.checked = false;
                } else if (type === 'search') {
                    window.filters.search = '';
                    const searchInput = document.getElementById('search-input');
                    if (searchInput) searchInput.value = '';
                }

                window.renderBoard();
            });
        });
    }
};

// Função auxiliar para criar elemento de cartão
function createCardElement(card) {
    if (!card || !card.id || !card.title) return null;

    const div = document.createElement('div');
    div.className = 'card bg-gray-700 rounded p-3 cursor-pointer hover:bg-gray-600 transition-colors';
    div.draggable = true;
    div.dataset.cardId = card.id;
    
    // Adiciona eventos de drag & drop
    div.addEventListener('dragstart', (e) => {
        window.draggedCard = e.target;
        window.originalList = e.target.closest('.list');
        e.target.classList.add('opacity-50');
        
        // Necessário para Firefox
        e.dataTransfer.setData('text/plain', '');
    });
    
    div.addEventListener('dragend', (e) => {
        e.target.classList.remove('opacity-50');
        window.draggedCard = null;
        window.originalList = null;
        
        // Remove classes de hover de todas as listas
        document.querySelectorAll('.list-content').forEach(list => {
            list.classList.remove('dragging-over');
        });
    });
    
    div.innerHTML = `
        <div class="flex justify-between items-start mb-3">
            <div class="flex space-x-2">
                ${card.labels && Array.isArray(card.labels) ? card.labels.map(label => `
                    <span class="px-2 py-1 text-xs rounded ${window.labels[label].color} text-white">
                        ${window.labels[label].text}
                    </span>
                `).join('') : ''}
            </div>
            <button class="text-gray-400 hover:text-white card-menu-btn">
                <i class="fas fa-ellipsis-h"></i>
            </button>
        </div>
        <h3 class="font-medium mb-2">${card.title}</h3>
        <p class="text-sm text-gray-400 mb-3">${card.description || ''}</p>
        <div class="flex justify-between items-center text-sm text-gray-400">
            <div class="flex space-x-3">
                ${card.comments > 0 ? `
                    <span class="flex items-center">
                        <i class="fas fa-comment-alt mr-1"></i>
                        ${card.comments}
                    </span>
                ` : ''}
                ${card.attachments > 0 ? `
                    <span class="flex items-center">
                        <i class="fas fa-paperclip mr-1"></i>
                        ${card.attachments}
                    </span>
                ` : ''}
            </div>
            <div class="flex -space-x-2">
                ${card.assignees && Array.isArray(card.assignees) ? card.assignees.map(assignee => `
                    <img src="https://ui-avatars.com/api/?name=${assignee}" 
                         alt="${assignee}" 
                         class="w-6 h-6 rounded-full border-2 border-gray-700">
                `).join('') : ''}
            </div>
        </div>
    `;

    // Adiciona evento de clique para abrir o modal de edição
    div.addEventListener('click', (e) => {
        if (!e.target.closest('.card-menu-btn')) {
            window.showCardModal(card);
        }
    });

    return div;
}

// Inicializa os eventos de filtro e lixeira quando o documento estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    // Carregar tema
    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        if (settings.theme) {
            document.documentElement.setAttribute('data-theme', settings.theme);
        }
    }

    // Carregar estado do quadro
    const savedState = localStorage.getItem('boardState');
    if (savedState) {
        window.boardState = JSON.parse(savedState);
    }

    // Inicializar filtros
    const filterDropdown = document.getElementById('filter-dropdown');
    const filterMenu = filterDropdown.querySelector('div');
    const filterButton = filterDropdown.querySelector('button');
    const applyFiltersBtn = document.getElementById('apply-filters');
    const clearFiltersBtn = document.getElementById('clear-filters');
    const searchInput = document.getElementById('search-input');

    // Toggle do menu de filtros
    filterButton.addEventListener('click', (e) => {
        e.stopPropagation();
        filterMenu.classList.toggle('hidden');
    });

    // Fechar menu ao clicar fora
    document.addEventListener('click', (e) => {
        if (!filterDropdown.contains(e.target)) {
            filterMenu.classList.add('hidden');
        }
    });

    // Aplicar filtros
    applyFiltersBtn.addEventListener('click', () => {
        const selectedLabels = Array.from(document.querySelectorAll('.filter-label:checked'))
            .map(checkbox => checkbox.value);
        
        window.filters.labels = selectedLabels;
        window.filters.search = searchInput.value.trim();
        
        window.renderBoard();
        filterMenu.classList.add('hidden');
    });

    // Limpar filtros
    clearFiltersBtn.addEventListener('click', () => {
        window.filters.labels = [];
        window.filters.search = '';
        searchInput.value = '';
        
        // Desmarca todos os checkboxes
        document.querySelectorAll('.filter-label').forEach(checkbox => {
            checkbox.checked = false;
        });
        
        window.renderBoard();
    });

    // Pesquisa em tempo real
    searchInput.addEventListener('input', () => {
        window.filters.search = searchInput.value.trim();
        window.renderBoard();
    });

    // Renderizar o quadro inicial
    if (typeof window.renderBoard === 'function') {
        window.renderBoard();
    }

    // Configuração da lixeira
    const trash = document.getElementById('trash');
    if (trash) {
        trash.addEventListener('dragover', (e) => {
            e.preventDefault();
            trash.classList.add('dragging-over');
        });

        trash.addEventListener('dragleave', () => {
            trash.classList.remove('dragging-over');
        });

        trash.addEventListener('drop', (e) => {
            e.preventDefault();
            trash.classList.remove('dragging-over');

            if (window.draggedCard && window.originalList) {
                const sourceListId = window.originalList.id;
                const cardId = window.draggedCard.dataset.cardId;
                const cardIndex = window.boardState.lists[sourceListId].findIndex(card => card.id === cardId);

                if (cardIndex !== -1) {
                    // Remove o cartão da lista
                    window.boardState.lists[sourceListId].splice(cardIndex, 1);
                    window.saveBoardState();
                    window.renderBoard();
                }
            }
        });
    }
});
