// Inicializa a página quando carregada
document.addEventListener('DOMContentLoaded', () => {
    initializeSearch();
    initializeBoardLinks();
    initializeCreateBoardButton();
    loadBoards();
});

// Função para carregar os quadros do localStorage
function loadBoards() {
    const boardsContainer = document.querySelector('.grid');
    const savedBoards = JSON.parse(localStorage.getItem('boards')) || [];
    
    // Limpa o container
    boardsContainer.innerHTML = '';
    
    // Adiciona os quadros salvos
    savedBoards.forEach(board => {
        const boardElement = createBoardElement(board);
        boardsContainer.appendChild(boardElement);
    });
}

// Função para criar elemento de quadro
function createBoardElement(board) {
    const div = document.createElement('div');
    div.className = 'board bg-gray-800 p-4 md:p-6 rounded-lg border border-gray-700 hover:border-white cursor-pointer transition-all relative group';
    
    let coverHtml = '';
    if (board.coverImage) {
        coverHtml = `<div class="h-24 md:h-32 rounded-lg mb-4 bg-cover bg-center" style="background-image: url('${board.coverImage}')"></div>`;
    } else {
        const bgColor = board.backgroundColor || '#3B82F6'; // Azul padrão
        coverHtml = `<div class="h-24 md:h-32 rounded-lg mb-4" style="background-color: ${bgColor}"></div>`;
    }
    
    div.innerHTML = `
        ${coverHtml}
        <div class="mb-2">
            <h3 class="text-lg md:text-xl board-title" data-board-id="${board.id}">${board.title}</h3>
        </div>
        <div class="flex flex-col space-y-2">
            <div class="flex items-center space-x-2">
                <i class="fas ${board.isPrivate ? 'fa-user' : 'fa-user-friends'} text-gray-400"></i>
                <span class="text-gray-400">${board.isPrivate ? 'Privado' : 'Compartilhado'}</span>
            </div>
            <p class="text-sm text-gray-400">${board.description}</p>
        </div>
        <div class="absolute top-3 right-3 flex space-x-1 opacity-0 group-hover:opacity-100 transition-all duration-200">
            <button class="edit-board w-8 h-8 bg-blue-500/90 backdrop-blur-sm text-white rounded-lg hover:bg-blue-600 hover:scale-105 transition-all duration-200 shadow-lg z-10" title="Editar quadro" style="display: flex; align-items: center; justify-content: center;">
                <i class="fas fa-edit" style="font-size: 11px; line-height: 1;"></i>
            </button>
            <button class="delete-board w-8 h-8 bg-red-500/90 backdrop-blur-sm text-white rounded-lg hover:bg-red-600 hover:scale-105 transition-all duration-200 shadow-lg z-10" title="Excluir quadro" style="display: flex; align-items: center; justify-content: center;">
                <i class="fas fa-trash" style="font-size: 11px; line-height: 1;"></i>
            </button>
        </div>
    `;
    
    // Adiciona o link para o quadro
    const link = document.createElement('a');
    link.href = `./Quadros.html?board=${encodeURIComponent(board.id)}`;
    link.className = 'absolute inset-0 z-0';
    div.appendChild(link);
    
    // Adiciona eventos para os botões de ação
    const deleteBtn = div.querySelector('.delete-board');
    const editBtn = div.querySelector('.edit-board');
    
    deleteBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        showDeleteBoardConfirmation(board);
    });
    
    editBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        showEditBoardModal(board);
    });
    
    // Previne a navegação quando clicar nos botões de ação
    link.addEventListener('click', (e) => {
        if (e.target.closest('.delete-board') || e.target.closest('.edit-board')) {
            e.preventDefault();
        }
    });
    
    return div;
}

// Função para mostrar confirmação de exclusão
function showDeleteBoardConfirmation(board) {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    modal.innerHTML = `
        <div class="bg-gray-800 rounded-lg p-6 w-[400px] shadow-xl">
            <div class="text-center mb-6">
                <div class="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-red-100">
                    <i class="fas fa-exclamation-triangle text-3xl text-red-600"></i>
                </div>
                <h3 class="text-lg font-semibold mb-2">Confirmar exclusão</h3>
                <p class="text-gray-400">Tem certeza que deseja excluir o quadro "${board.title}"? Esta ação não pode ser desfeita.</p>
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
        // Remove o quadro do localStorage
        const savedBoards = JSON.parse(localStorage.getItem('boards')) || [];
        const updatedBoards = savedBoards.filter(b => b.id !== board.id);
        localStorage.setItem('boards', JSON.stringify(updatedBoards));

        // Remove o estado do quadro
        localStorage.removeItem(`board_${board.id}`);

        // Recarrega os quadros
        loadBoards();
        closeModal();
    });

    cancelBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
}

// Inicializa o botão de criar novo quadro
function initializeCreateBoardButton() {
    const createBoardBtn = document.querySelector('button:has(i.fa-plus-square)');
    if (createBoardBtn) {
        createBoardBtn.disabled = false;
        createBoardBtn.classList.remove('opacity-50', 'cursor-not-allowed');
        
        createBoardBtn.addEventListener('click', () => {
            showCreateBoardModal();
        });
    }
}

// Modal de criar novo quadro
function showCreateBoardModal() {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    modal.innerHTML = `
        <div class="bg-gray-800 rounded-lg p-6 w-[500px]">
            <div class="flex justify-between items-start mb-4">
                <h2 class="text-lg font-semibold">Criar novo quadro</h2>
                <button class="text-gray-400 hover:text-white close-modal">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="space-y-4">
                <div>
                    <label class="block text-sm font-medium mb-1">Título do quadro</label>
                    <input type="text" class="w-full bg-gray-700 text-white rounded px-3 py-2" placeholder="Digite o título do quadro...">
                </div>
                <div>
                    <label class="block text-sm font-medium mb-1">Descrição</label>
                    <textarea class="w-full bg-gray-700 text-white rounded px-3 py-2 min-h-[96px] max-h-[200px] resize-none" placeholder="Digite uma descrição..." style="resize: none; overflow-y: auto;"></textarea>
                </div>
                <div>
                    <label class="block text-sm font-medium mb-1">Tipo de quadro</label>
                    <select class="w-full bg-gray-700 text-white rounded px-3 py-2">
                        <option value="private">Privado</option>
                        <option value="shared">Compartilhado</option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium mb-1">Capa do quadro</label>
                    <div class="space-y-2">
                        <div class="flex items-center space-x-2">
                            <input type="radio" name="coverType" value="color" checked class="cover-type">
                            <span>Cor sólida</span>
                        </div>
                        <div class="color-options grid grid-cols-6 gap-2">
                            <button class="color-option w-8 h-8 rounded-full bg-blue-500 hover:scale-110 transition-transform" data-color="#3B82F6"></button>
                            <button class="color-option w-8 h-8 rounded-full bg-purple-500 hover:scale-110 transition-transform" data-color="#8B5CF6"></button>
                            <button class="color-option w-8 h-8 rounded-full bg-green-500 hover:scale-110 transition-transform" data-color="#10B981"></button>
                            <button class="color-option w-8 h-8 rounded-full bg-red-500 hover:scale-110 transition-transform" data-color="#EF4444"></button>
                            <button class="color-option w-8 h-8 rounded-full bg-yellow-500 hover:scale-110 transition-transform" data-color="#F59E0B"></button>
                            <button class="color-option w-8 h-8 rounded-full bg-pink-500 hover:scale-110 transition-transform" data-color="#EC4899"></button>
                        </div>
                        <div class="flex items-center space-x-2 mt-2">
                            <input type="radio" name="coverType" value="image" class="cover-type">
                            <span>Imagem de capa</span>
                        </div>
                        <div class="image-option hidden space-y-2">
                            <input type="text" class="w-full bg-gray-700 text-white rounded px-3 py-2" placeholder="URL da imagem...">
                            <p class="text-sm text-gray-400 mt-1">Cole aqui a URL de uma imagem para usar como capa</p>
                            <div class="flex items-center space-x-2 mt-2">
                                <input type="file" accept="image/*" class="file-input bg-gray-700 text-white rounded px-3 py-2">
                                <span class="text-sm text-gray-400">ou escolha um arquivo</span>
                            </div>
                            <div class="preview-area mt-2 hidden">
                                <img src="" alt="Preview" class="w-full h-20 object-cover rounded">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="flex justify-end space-x-2">
                    <button class="px-4 py-2 text-gray-400 hover:text-white cancel">Cancelar</button>
                    <button class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 create">Criar quadro</button>
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
    const typeSelect = modal.querySelector('select');
    const coverTypeInputs = modal.querySelectorAll('.cover-type');
    const colorOptions = modal.querySelectorAll('.color-option');
    const imageOption = modal.querySelector('.image-option');
    const imageUrlInput = modal.querySelector('.image-option input[type="text"]');
    const fileInput = modal.querySelector('.file-input');
    const previewArea = modal.querySelector('.preview-area');
    const previewImg = previewArea.querySelector('img');

    // Função para auto-ajustar altura do textarea
    const autoResizeTextarea = (textarea) => {
        textarea.style.height = 'auto';
        textarea.style.height = Math.min(textarea.scrollHeight, 200) + 'px';
    };

    // Aplica auto-resize no textarea de descrição
    descriptionInput.addEventListener('input', () => autoResizeTextarea(descriptionInput));
    // Ajusta altura inicial
    setTimeout(() => autoResizeTextarea(descriptionInput), 0);

    let selectedColor = '#3B82F6'; // Cor padrão
    let selectedFileBase64 = '';

    const closeModal = () => modal.remove();

    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    // Event listeners para opções de capa
    coverTypeInputs.forEach(input => {
        input.addEventListener('change', (e) => {
            if (e.target.value === 'image') {
                imageOption.classList.remove('hidden');
            } else {
                imageOption.classList.add('hidden');
            }
        });
    });

    // Event listeners para seleção de cor
    colorOptions.forEach(option => {
        option.addEventListener('click', () => {
            colorOptions.forEach(opt => opt.classList.remove('ring-2', 'ring-white'));
            option.classList.add('ring-2', 'ring-white');
            selectedColor = option.dataset.color;
        });
    });

    // Preview e conversão do arquivo para base64
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => {
                selectedFileBase64 = ev.target.result;
                previewImg.src = selectedFileBase64;
                previewArea.classList.remove('hidden');
            };
            reader.readAsDataURL(file);
        } else {
            selectedFileBase64 = '';
            previewArea.classList.add('hidden');
        }
    });

    createBtn.addEventListener('click', () => {
        const title = titleInput.value.trim();
        if (!title) {
            titleInput.classList.add('border', 'border-red-500');
            return;
        }

        const coverType = modal.querySelector('input[name="coverType"]:checked').value;
        const board = {
            id: Date.now().toString(),
            title,
            description: descriptionInput.value.trim(),
            isPrivate: typeSelect.value === 'private',
            createdAt: new Date().toISOString()
        };

        // Adiciona informações de capa
        if (coverType === 'image') {
            if (selectedFileBase64) {
                board.coverImage = selectedFileBase64;
            } else if (imageUrlInput.value.trim()) {
                board.coverImage = imageUrlInput.value.trim();
            }
        } else {
            board.backgroundColor = selectedColor;
        }

        // Salva o novo quadro
        const savedBoards = JSON.parse(localStorage.getItem('boards')) || [];
        savedBoards.push(board);
        localStorage.setItem('boards', JSON.stringify(savedBoards));

        // Inicializa o estado do quadro
        const boardState = {
            lists: {
                'para-fazer': [],
                'fazendo': [],
                'concluido': []
            }
        };
        localStorage.setItem(`board_${board.id}`, JSON.stringify(boardState));

        // Recarrega os quadros
        loadBoards();
        closeModal();
    });
}

// Inicializa a busca de quadros
function initializeSearch() {
    const searchInput = document.querySelector('input[placeholder="Pesquisar quadros..."]');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            const boards = document.querySelectorAll('.board');
            
            boards.forEach(board => {
                const title = board.querySelector('h3').textContent.toLowerCase();
                const description = board.querySelector('.text-gray-400').textContent.toLowerCase();
                
                if (title.includes(query) || description.includes(query)) {
                    board.style.display = '';
                } else {
                    board.style.display = 'none';
                }
            });
        });
    }
}

// Inicializa os links dos quadros
function initializeBoardLinks() {
    const boards = document.querySelectorAll('.board');
    boards.forEach(board => {
        board.addEventListener('click', (e) => {
            e.preventDefault();
            const boardId = board.getAttribute('href').split('=')[1];
            window.location.href = `./Quadros.html?board=${boardId}`;
        });
    });
}
// Função para mostrar modal de edição completa do quadro
function showEditBoardModal(board) {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    modal.innerHTML = `
        <div class="bg-gray-800 rounded-lg p-6 w-[500px] max-h-[90vh] overflow-y-auto">
            <div class="flex justify-between items-start mb-4">
                <h2 class="text-lg font-semibold">Editar quadro</h2>
                <button class="text-gray-400 hover:text-white close-modal">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="space-y-4">
                <div>
                    <label class="block text-sm font-medium mb-1">Título do quadro</label>
                    <input type="text" class="w-full bg-gray-700 text-white rounded px-3 py-2" placeholder="Digite o título do quadro..." value="${board.title}">
                </div>
                <div>
                    <label class="block text-sm font-medium mb-1">Descrição</label>
                    <textarea class="w-full bg-gray-700 text-white rounded px-3 py-2 min-h-[96px] max-h-[200px] resize-none" placeholder="Digite uma descrição..." style="resize: none; overflow-y: auto;">${board.description || ''}</textarea>
                </div>
                <div>
                    <label class="block text-sm font-medium mb-1">Tipo de quadro</label>
                    <select class="w-full bg-gray-700 text-white rounded px-3 py-2">
                        <option value="private" ${board.isPrivate ? 'selected' : ''}>Privado</option>
                        <option value="shared" ${!board.isPrivate ? 'selected' : ''}>Compartilhado</option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium mb-1">Capa do quadro</label>
                    <div class="space-y-2">
                        <div class="flex items-center space-x-2">
                            <input type="radio" name="coverType" value="color" ${!board.coverImage ? 'checked' : ''} class="cover-type">
                            <span>Cor sólida</span>
                        </div>
                        <div class="color-options grid grid-cols-6 gap-2">
                            <button class="color-option w-8 h-8 rounded-full bg-blue-500 hover:scale-110 transition-transform ${board.backgroundColor === '#3B82F6' ? 'ring-2 ring-white' : ''}" data-color="#3B82F6"></button>
                            <button class="color-option w-8 h-8 rounded-full bg-purple-500 hover:scale-110 transition-transform ${board.backgroundColor === '#8B5CF6' ? 'ring-2 ring-white' : ''}" data-color="#8B5CF6"></button>
                            <button class="color-option w-8 h-8 rounded-full bg-green-500 hover:scale-110 transition-transform ${board.backgroundColor === '#10B981' ? 'ring-2 ring-white' : ''}" data-color="#10B981"></button>
                            <button class="color-option w-8 h-8 rounded-full bg-red-500 hover:scale-110 transition-transform ${board.backgroundColor === '#EF4444' ? 'ring-2 ring-white' : ''}" data-color="#EF4444"></button>
                            <button class="color-option w-8 h-8 rounded-full bg-yellow-500 hover:scale-110 transition-transform ${board.backgroundColor === '#F59E0B' ? 'ring-2 ring-white' : ''}" data-color="#F59E0B"></button>
                            <button class="color-option w-8 h-8 rounded-full bg-pink-500 hover:scale-110 transition-transform ${board.backgroundColor === '#EC4899' ? 'ring-2 ring-white' : ''}" data-color="#EC4899"></button>
                        </div>
                        <div class="flex items-center space-x-2 mt-2">
                            <input type="radio" name="coverType" value="image" ${board.coverImage ? 'checked' : ''} class="cover-type">
                            <span>Imagem de capa</span>
                        </div>
                        <div class="image-option ${!board.coverImage ? 'hidden' : ''} space-y-2">
                            <input type="text" class="w-full bg-gray-700 text-white rounded px-3 py-2" placeholder="URL da imagem..." value="${board.coverImage && !board.coverImage.startsWith('data:') ? board.coverImage : ''}">
                            <p class="text-sm text-gray-400 mt-1">Cole aqui a URL de uma imagem para usar como capa</p>
                            <div class="flex items-center space-x-2 mt-2">
                                <input type="file" accept="image/*" class="file-input bg-gray-700 text-white rounded px-3 py-2">
                                <span class="text-sm text-gray-400">ou escolha um arquivo</span>
                            </div>
                            <div class="preview-area mt-2 ${!board.coverImage ? 'hidden' : ''}">
                                <img src="${board.coverImage || ''}" alt="Preview" class="w-full h-20 object-cover rounded">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="flex justify-end space-x-2">
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
    const descriptionInput = modal.querySelector('textarea');
    const typeSelect = modal.querySelector('select');
    const coverTypeInputs = modal.querySelectorAll('.cover-type');
    const colorOptions = modal.querySelectorAll('.color-option');
    const imageOption = modal.querySelector('.image-option');
    const imageUrlInput = modal.querySelector('.image-option input[type="text"]');
    const fileInput = modal.querySelector('.file-input');
    const previewArea = modal.querySelector('.preview-area');
    const previewImg = previewArea.querySelector('img');

    // Função para auto-ajustar altura do textarea
    const autoResizeTextarea = (textarea) => {
        textarea.style.height = 'auto';
        textarea.style.height = Math.min(textarea.scrollHeight, 200) + 'px';
    };

    // Aplica auto-resize no textarea de descrição
    descriptionInput.addEventListener('input', () => autoResizeTextarea(descriptionInput));
    // Ajusta altura inicial baseada no conteúdo existente
    setTimeout(() => autoResizeTextarea(descriptionInput), 0);

    let selectedColor = board.backgroundColor || '#3B82F6';
    let selectedFileBase64 = '';

    const closeModal = () => modal.remove();

    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    // Event listeners para opções de capa
    coverTypeInputs.forEach(input => {
        input.addEventListener('change', (e) => {
            if (e.target.value === 'image') {
                imageOption.classList.remove('hidden');
            } else {
                imageOption.classList.add('hidden');
            }
        });
    });

    // Event listeners para seleção de cor
    colorOptions.forEach(option => {
        option.addEventListener('click', () => {
            colorOptions.forEach(opt => opt.classList.remove('ring-2', 'ring-white'));
            option.classList.add('ring-2', 'ring-white');
            selectedColor = option.dataset.color;
        });
    });

    // Preview e conversão do arquivo para base64
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => {
                selectedFileBase64 = ev.target.result;
                previewImg.src = selectedFileBase64;
                previewArea.classList.remove('hidden');
            };
            reader.readAsDataURL(file);
        } else {
            selectedFileBase64 = '';
            if (!imageUrlInput.value.trim()) {
                previewArea.classList.add('hidden');
            }
        }
    });

    // Preview da URL da imagem
    imageUrlInput.addEventListener('input', (e) => {
        const url = e.target.value.trim();
        if (url) {
            previewImg.src = url;
            previewArea.classList.remove('hidden');
        } else if (!selectedFileBase64) {
            previewArea.classList.add('hidden');
        }
    });

    saveBtn.addEventListener('click', () => {
        const title = titleInput.value.trim();
        if (!title) {
            titleInput.classList.add('border', 'border-red-500');
            return;
        }

        const coverType = modal.querySelector('input[name="coverType"]:checked').value;
        const updatedBoard = {
            ...board,
            title,
            description: descriptionInput.value.trim(),
            isPrivate: typeSelect.value === 'private',
            updatedAt: new Date().toISOString()
        };

        // Remove propriedades de capa antigas
        delete updatedBoard.coverImage;
        delete updatedBoard.backgroundColor;

        // Adiciona informações de capa
        if (coverType === 'image') {
            if (selectedFileBase64) {
                updatedBoard.coverImage = selectedFileBase64;
            } else if (imageUrlInput.value.trim()) {
                updatedBoard.coverImage = imageUrlInput.value.trim();
            }
        } else {
            updatedBoard.backgroundColor = selectedColor;
        }

        // Salva as alterações no localStorage
        const savedBoards = JSON.parse(localStorage.getItem('boards')) || [];
        const boardIndex = savedBoards.findIndex(b => b.id === board.id);
        if (boardIndex !== -1) {
            savedBoards[boardIndex] = updatedBoard;
            localStorage.setItem('boards', JSON.stringify(savedBoards));
        }

        // Recarrega os quadros
        loadBoards();
        closeModal();
        
        // Mostra mensagem de sucesso
        showSuccessMessage('Quadro atualizado com sucesso!');
    });
}

// Função para mostrar mensagem de sucesso
function showSuccessMessage(message) {
    const toast = document.createElement('div');
    toast.className = 'fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 transform translate-x-full transition-transform duration-300';
    toast.innerHTML = `
        <div class="flex items-center space-x-2">
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(toast);
    
    // Anima a entrada
    setTimeout(() => {
        toast.classList.remove('translate-x-full');
    }, 100);
    
    // Remove após 3 segundos
    setTimeout(() => {
        toast.classList.add('translate-x-full');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}