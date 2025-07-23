// Estado dos filtros e drag & drop
window.filters = {
    labels: [],
    search: ''
};

window.draggedCard = null;
window.originalList = null;

// Verificar se há um cartão para editar quando a página carrega
document.addEventListener('DOMContentLoaded', () => {
    // Carregar tema
    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        if (settings.theme) {
            document.documentElement.setAttribute('data-theme', settings.theme);
        }
    }

    // Obter o ID do quadro da URL
    const urlParams = new URLSearchParams(window.location.search);
    const boardId = urlParams.get('board');

    if (!boardId) {
        window.showErrorModal('ID do quadro não encontrado');
        return;
    }

    // Carregar informações do quadro
    const savedBoards = JSON.parse(localStorage.getItem('boards')) || [];
    const board = savedBoards.find(b => b.id === boardId);

    if (!board) {
        window.showErrorModal('Quadro não encontrado');
        return;
    }

    // Atualizar o título da página
    document.title = `${board.title} - Bagunça`;
    
    // Atualizar o título no header
    const boardTitle = document.querySelector('.nav-dropdown a span');
    if (boardTitle) {
        boardTitle.textContent = board.title;
    }

    // Carregar estado do quadro
    const savedState = localStorage.getItem(`board_${boardId}`);
    if (savedState) {
        window.boardState = JSON.parse(savedState);
    } else {
        // Estado inicial do quadro
        window.boardState = {
            lists: {
                'para-fazer': [],
                'fazendo': [],
                'concluido': []
            }
        };
        localStorage.setItem(`board_${boardId}`, JSON.stringify(window.boardState));
    }

    // Inicializar filtros
    const filterDropdown = document.getElementById('filter-dropdown');
    const filterMenu = filterDropdown.querySelector('div');
    const filterButton = filterDropdown.querySelector('button');
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

    // Aplicar filtros em tempo real quando uma etiqueta é selecionada
    document.addEventListener('change', (e) => {
        if (e.target.classList.contains('filter-label')) {
            const selectedLabels = Array.from(document.querySelectorAll('.filter-label:checked'))
                .map(checkbox => checkbox.value);
            
            window.filters.labels = selectedLabels;
            window.filters.search = searchInput.value.trim();
            
            window.renderBoard();
        }
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

    // Inicializar eventos de drag and drop para todas as listas
    document.querySelectorAll('.list-content').forEach(listContent => {
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
    });

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

// Função para salvar o estado do quadro
window.saveBoardState = function() {
    const urlParams = new URLSearchParams(window.location.search);
    const boardId = urlParams.get('board');
    if (boardId) {
        localStorage.setItem(`board_${boardId}`, JSON.stringify(window.boardState));
    }
};

// Variáveis globais para suporte touch
let touchStartY = 0;
let touchStartX = 0;
let initialTouchY = 0;
let initialTouchX = 0;
let touchTimeout;
let touchClone = null;

// Funções principais
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
                            const cardElement = createCardElement(card, listId);
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
function createCardElement(card, listId) {
    if (!card || !card.id || !card.title) return null;

    const div = document.createElement('div');
    div.className = 'card bg-gray-700 rounded p-3 cursor-pointer hover:bg-gray-600 transition-colors';
    div.draggable = true;
    div.dataset.cardId = card.id;
    
    // Eventos de drag & drop para desktop
    div.addEventListener('dragstart', handleDragStart);
    div.addEventListener('dragend', handleDragEnd);
    
    // Eventos touch para dispositivos móveis
    div.addEventListener('touchstart', handleTouchStart, { passive: false });
    div.addEventListener('touchmove', handleTouchMove, { passive: false });
    div.addEventListener('touchend', handleTouchEnd);

    // Verifica se o prazo está próximo ou expirado
    let deadlineClass = '';
    let deadlineIcon = '';
    if (card.deadline) {
        const deadline = new Date(card.deadline);
        const now = new Date();
        const diffDays = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24));
        
        if (diffDays < 0) {
            deadlineClass = 'text-red-500';
            deadlineIcon = 'fa-exclamation-circle';
        } else if (diffDays <= 3) {
            deadlineClass = 'text-yellow-500';
            deadlineIcon = 'fa-clock';
        } else {
            deadlineClass = 'text-green-500';
            deadlineIcon = 'fa-calendar-check';
        }
    }

    div.innerHTML = `
        <div class="flex justify-between items-start mb-3">
            <div class="flex space-x-2">
                ${card.labels && Array.isArray(card.labels) ? card.labels.map(label => `
                    <span class="px-2 py-1 text-xs rounded ${window.labels[label].color} text-white">
                        ${window.labels[label].text}
                    </span>
                `).join('') : ''}
            </div>
            <button class="text-gray-400 hover:text-white card-menu-btn rounded-sm p-0.5">
                <i class="fas fa-ellipsis-h"></i>
            </button>
        </div>
        <h3 class="font-medium mb-2">${card.title}</h3>
        <p class="text-sm text-gray-400 mb-3">${card.description || ''}</p>
        ${card.deadline ? `
            <div class="flex items-center ${deadlineClass} text-sm mb-3">
                <i class="fas ${deadlineIcon} mr-2"></i>
                <span>${new Date(card.deadline).toLocaleString('pt-BR')}</span>
            </div>
        ` : ''}
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
            <div class="flex items-center space-x-2">
                ${listId === 'concluido' ? `
                    <span class="text-green-500">
                        <i class="fas fa-check-circle text-xl"></i>
                    </span>
                ` : ''}
                <div class="flex -space-x-2">
                    ${card.assignees && Array.isArray(card.assignees) ? card.assignees.map(assignee => `
                        <img src="https://ui-avatars.com/api/?name=${assignee}" 
                             alt="${assignee}" 
                             class="w-6 h-6 rounded-full border-2 border-gray-700">
                    `).join('') : ''}
                </div>
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

// Funções auxiliares para drag & drop
function handleDragStart(e) {
    window.draggedCard = e.target;
    window.originalList = e.target.closest('.list');
    e.target.classList.add('opacity-50');
    e.dataTransfer.setData('text/plain', '');
}

function handleDragEnd(e) {
    e.target.classList.remove('opacity-50');
    window.draggedCard = null;
    window.originalList = null;
    
    document.querySelectorAll('.list-content').forEach(list => {
        list.classList.remove('dragging-over');
    });
}

// Funções para suporte touch
function handleTouchStart(e) {
    // Encontra o card pai mais próximo
    const card = e.target.closest('.card');
    if (!card) return;

    const touch = e.touches[0];
    touchStartY = touch.clientY;
    touchStartX = touch.clientX;
    initialTouchY = touch.clientY;
    initialTouchX = touch.clientX;
    
    // Inicia um timer para diferenciar entre toque para scroll e toque para drag
    touchTimeout = setTimeout(() => {
        window.draggedCard = card;
        window.originalList = card.closest('.list');
        card.classList.add('opacity-50');
        
        // Cria uma cópia visual do cartão para feedback
        touchClone = card.cloneNode(true);
        touchClone.id = 'dragging-clone';
        touchClone.style.position = 'fixed';
        touchClone.style.top = `${touch.clientY - 20}px`;
        touchClone.style.left = `${touch.clientX - 20}px`;
        touchClone.style.width = `${card.offsetWidth}px`;
        touchClone.style.pointerEvents = 'none';
        touchClone.style.opacity = '0.8';
        touchClone.style.zIndex = '1000';
        touchClone.style.transform = 'scale(1.05)';
        touchClone.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        document.body.appendChild(touchClone);
    }, 200);
}

function handleTouchMove(e) {
    if (!window.draggedCard) return;
    
    // Previne o scroll apenas quando estamos em modo de drag
    if (touchClone) {
        e.preventDefault();
    }
    
    const touch = e.touches[0];
    
    if (touchClone) {
        touchClone.style.top = `${touch.clientY - 20}px`;
        touchClone.style.left = `${touch.clientX - 20}px`;
        
        // Detecta lista sob o toque
        const elemBelow = document.elementFromPoint(touch.clientX, touch.clientY);
        const listContent = elemBelow?.closest('.list-content');
        
        document.querySelectorAll('.list-content').forEach(list => {
            list.classList.remove('dragging-over');
        });
        
        if (listContent) {
            listContent.classList.add('dragging-over');
            
            // Adiciona uma prévia visual do card na lista de destino
            const previewCard = document.createElement('div');
            previewCard.className = 'card-preview';
            previewCard.style.height = `${window.draggedCard.offsetHeight}px`;
            previewCard.style.margin = '0.5rem 0';
            previewCard.style.border = '2px dashed rgba(255, 255, 255, 0.3)';
            previewCard.style.borderRadius = '0.375rem';
            
            // Remove a prévia anterior se existir
            const existingPreview = listContent.querySelector('.card-preview');
            if (existingPreview) {
                existingPreview.remove();
            }
            
            // Insere a prévia na posição correta
            const cards = Array.from(listContent.children);
            const cardBelow = cards.find(card => {
                const rect = card.getBoundingClientRect();
                return touch.clientY < rect.bottom;
            });
            
            if (cardBelow) {
                listContent.insertBefore(previewCard, cardBelow);
            } else {
                listContent.appendChild(previewCard);
            }
        }
    }
}

function handleTouchEnd(e) {
    clearTimeout(touchTimeout);
    
    if (!window.draggedCard) return;
    
    if (touchClone) {
        touchClone.remove();
        touchClone = null;
    }
    
    // Remove todas as prévias
    document.querySelectorAll('.card-preview').forEach(preview => {
        preview.remove();
    });
    
    const touch = e.changedTouches[0];
    const elemBelow = document.elementFromPoint(touch.clientX, touch.clientY);
    const listContent = elemBelow?.closest('.list-content');
    
    if (listContent) {
        const targetList = listContent.closest('.list');
        const targetListId = targetList.id;
        const sourceListId = window.originalList.id;
        const cardId = window.draggedCard.dataset.cardId;
        
        // Move o cartão para a nova lista
        const cardIndex = window.boardState.lists[sourceListId].findIndex(card => card.id === cardId);
        
        if (cardIndex !== -1) {
            const [movedCard] = window.boardState.lists[sourceListId].splice(cardIndex, 1);
            window.boardState.lists[targetListId].push(movedCard);
            window.saveBoardState();
            window.renderBoard();
        }
    }
    
    window.draggedCard.classList.remove('opacity-50');
    window.draggedCard = null;
    window.originalList = null;
    
    document.querySelectorAll('.list-content').forEach(list => {
        list.classList.remove('dragging-over');
    });
}
