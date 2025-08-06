// Gerenciamento de chat em grupo por board
class GroupChatManager {
    constructor() {
        this.currentBoardId = null;
        this.currentChat = null;
        this.messages = [];
        this.currentPage = 1;
        this.isLoading = false;
        this.hasMoreMessages = true;
        this.userBoards = [];

        this.initializeElements();
        this.initializeEventListeners();
        this.loadUserBoards();
    }

    initializeElements() {
        this.contactsList = document.querySelector('.contacts-list');
        this.messagesContainer = document.querySelector('.messages-container');
        this.chatInput = document.querySelector('.chat-input');
        this.sendButton = document.querySelector('.send-button');
        this.chatHeader = document.querySelector('.chat-header');
        this.conversationArea = document.getElementById('chatConversationArea');
        this.addContactButton = document.querySelector('.add-contact-button button');

        // Esconder botão de adicionar contato (não aplicável para chat de boards)
        if (this.addContactButton) {
            this.addContactButton.style.display = 'none';
        }
    }

    initializeEventListeners() {
        // Enviar mensagem
        if (this.sendButton) {
            this.sendButton.addEventListener('click', () => this.sendMessage());
        }

        if (this.chatInput) {
            this.chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.sendMessage();
                }
            });
        }

        // Scroll para carregar mensagens antigas
        if (this.messagesContainer) {
            this.messagesContainer.addEventListener('scroll', () => {
                if (this.messagesContainer.scrollTop === 0 && !this.isLoading && this.hasMoreMessages) {
                    this.loadOlderMessages();
                }
            });
        }

        // Botão voltar em mobile
        const backButton = document.getElementById('backToContactsBtn');
        if (backButton) {
            backButton.addEventListener('click', () => this.showBoardsList());
        }
    }

    // Carregar boards do usuário
    async loadUserBoards() {
        try {
            // Verificar se há token válido
            const token = chatService.getAuthToken();
            if (!token) {
                this.showError('Usuário não autenticado. Faça login novamente.');
                return;
            }

            // Carregar boards próprios e boards onde é membro
            const [ownBoards, memberBoards] = await Promise.all([
                chatService.getUserBoards(),
                chatService.getUserMemberBoards()
            ]);

            // Combinar e remover duplicatas
            const allBoards = [...ownBoards];
            memberBoards.forEach(memberBoard => {
                // Verificar se boardId existe e não é null
                if (memberBoard.boardId && memberBoard.boardId._id) {
                    if (!allBoards.find(board => board._id === memberBoard.boardId._id)) {
                        allBoards.push(memberBoard.boardId);
                    }
                }
            });

            this.userBoards = allBoards;
            this.renderBoardsList();

            // Selecionar primeiro board se existir
            if (this.userBoards.length > 0) {
                this.selectBoard(this.userBoards[0]);
            }
        } catch (error) {
            console.error('Erro ao carregar boards:', error);
            this.showError('Erro ao carregar seus boards');
        }
    }

    // Renderizar lista de boards
    renderBoardsList() {
        if (!this.contactsList) return;

        this.contactsList.innerHTML = '';

        if (this.userBoards.length === 0) {
            this.contactsList.innerHTML = `
                <div class="no-boards-message">
                    <p class="text-gray-400 text-center py-4">
                        Você não participa de nenhum board ainda.
                    </p>
                </div>
            `;
            return;
        }

        this.userBoards.forEach(board => {
            const boardElement = this.createBoardElement(board);
            this.contactsList.appendChild(boardElement);
        });
    }

    // Criar elemento de board
    createBoardElement(board) {
        const boardDiv = document.createElement('div');
        boardDiv.className = 'contact-item board-item';
        boardDiv.dataset.boardId = board._id;

        // Gerar iniciais do título do board
        const initials = this.getBoardInitials(board.title);

        // Cor baseada no cover_value ou padrão
        const bgColor = board.cover_value || 'bg-blue-500';

        boardDiv.innerHTML = `
            <div class="contact-avatar ${bgColor}">
                <span>${initials}</span>
                <div class="online-indicator"></div>
            </div>
            <div class="contact-info">
                <div class="contact-name">
                    <span>${board.title}</span>
                    <span class="text-xs text-gray-400">Board</span>
                </div>
                <div class="contact-last-message">
                    ${board.description || 'Chat do board'}
                </div>
            </div>
        `;

        // Adicionar evento de clique
        boardDiv.addEventListener('click', () => {
            this.selectBoard(board);
            this.showConversationArea();
        });

        return boardDiv;
    }

    // Gerar iniciais do board
    getBoardInitials(title) {
        return title
            .split(' ')
            .map(word => word.charAt(0))
            .join('')
            .substring(0, 2)
            .toUpperCase();
    }

    // Selecionar board
    async selectBoard(board) {
        try {
            // Remover seleção anterior
            document.querySelectorAll('.board-item').forEach(item => {
                item.classList.remove('active');
            });

            // Selecionar novo board
            const boardElement = document.querySelector(`[data-board-id="${board._id}"]`);
            if (boardElement) {
                boardElement.classList.add('active');
            }

            this.currentBoardId = board._id;
            this.currentPage = 1;
            this.hasMoreMessages = true;
            this.messages = [];

            // Atualizar header do chat
            this.updateChatHeader(board);

            // Carregar chat e mensagens
            await this.loadBoardChat();
            await this.loadMessages();

        } catch (error) {
            console.error('Erro ao selecionar board:', error);
            this.showError('Erro ao carregar chat do board');
        }
    }

    // Atualizar header do chat
    updateChatHeader(board) {
        if (!this.chatHeader) return;

        const headerName = this.chatHeader.querySelector('h2');
        const headerAvatar = this.chatHeader.querySelector('.contact-avatar');
        const headerStatus = this.chatHeader.querySelector('p');

        if (headerName) {
            headerName.textContent = board.title;
        }

        if (headerAvatar) {
            const initials = this.getBoardInitials(board.title);
            const bgColor = board.cover_value || 'bg-blue-500';

            headerAvatar.className = `contact-avatar ${bgColor}`;
            const avatarSpan = headerAvatar.querySelector('span');
            if (avatarSpan) {
                avatarSpan.textContent = initials;
            }
        }

        if (headerStatus) {
            headerStatus.textContent = 'Chat do board';
        }
    }

    // Carregar chat do board
    async loadBoardChat() {
        try {
            this.currentChat = await chatService.getBoardChat(this.currentBoardId);
        } catch (error) {
            console.error('Erro ao carregar chat:', error);
            throw error;
        }
    }

    // Carregar mensagens
    async loadMessages(page = 1) {
        if (this.isLoading) return;

        this.isLoading = true;
        this.showLoadingIndicator();

        try {
            const response = await chatService.getChatMessages(this.currentBoardId, page);

            if (page === 1) {
                this.messages = response.messages;
                this.renderMessages();
                this.scrollToBottom();
            } else {
                // Adicionar mensagens antigas no início
                this.messages = [...response.messages, ...this.messages];
                this.renderMessages(true);
            }

            this.currentPage = response.currentPage;
            this.hasMoreMessages = response.currentPage < response.totalPages;

        } catch (error) {
            console.error('Erro ao carregar mensagens:', error);
            this.showError('Erro ao carregar mensagens');
        } finally {
            this.isLoading = false;
            this.hideLoadingIndicator();
        }
    }

    // Carregar mensagens mais antigas
    async loadOlderMessages() {
        if (!this.hasMoreMessages) return;
        await this.loadMessages(this.currentPage + 1);
    }

    // Renderizar mensagens
    renderMessages(preserveScroll = false) {
        if (!this.messagesContainer) return;

        const scrollHeight = this.messagesContainer.scrollHeight;
        const scrollTop = this.messagesContainer.scrollTop;

        this.messagesContainer.innerHTML = '';

        this.messages.forEach(message => {
            const messageElement = this.createMessageElement(message);
            this.messagesContainer.appendChild(messageElement);
        });

        if (preserveScroll) {
            // Manter posição do scroll ao carregar mensagens antigas
            this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight - scrollHeight + scrollTop;
        }
    }

    // Criar elemento de mensagem
    createMessageElement(message) {
        const currentUserId = this.getCurrentUserId();
        const isOutgoing = message.senderId._id === currentUserId;
        const initials = this.getUserInitials(message.senderId.nomeCompleto);

        const messageDiv = document.createElement('div');
        messageDiv.className = `message-wrapper ${isOutgoing ? 'outgoing' : 'incoming'}`;
        messageDiv.dataset.messageId = message._id;

        const time = new Date(message.createdAt).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
        });

        messageDiv.innerHTML = `
            <div class="message-avatar">${initials}</div>
            <div class="message ${isOutgoing ? 'outgoing' : 'incoming'}">
                <div class="message-content">
                    ${message.content}
                    ${message.editedAt ? '<span class="edited-indicator">(editado)</span>' : ''}
                </div>
                <span class="message-time">${time}</span>
            </div>
        `;

        return messageDiv;
    }

    // Obter ID do usuário atual
    getCurrentUserId() {
        try {
            const userData = localStorage.getItem('userData');
            if (userData) {
                const parsedData = JSON.parse(userData);
                return parsedData.id || parsedData._id;
            }
        } catch (error) {
            console.error('Erro ao obter ID do usuário:', error);
        }
        return null;
    }

    // Obter iniciais do usuário
    getUserInitials(nomeCompleto) {
        return nomeCompleto
            .split(' ')
            .map(name => name.charAt(0))
            .join('')
            .substring(0, 2)
            .toUpperCase();
    }

    // Enviar mensagem
    async sendMessage() {
        if (!this.currentBoardId || !this.chatInput) return;

        const content = this.chatInput.value.trim();
        if (!content) return;

        try {
            this.chatInput.disabled = true;
            this.sendButton.disabled = true;

            const response = await chatService.sendMessage(this.currentBoardId, content);

            // Adicionar mensagem à lista e renderizar
            this.messages.push(response.message);
            this.renderMessages();
            this.scrollToBottom();

            // Limpar input
            this.chatInput.value = '';

        } catch (error) {
            console.error('Erro ao enviar mensagem:', error);
            this.showError('Erro ao enviar mensagem');
        } finally {
            this.chatInput.disabled = false;
            this.sendButton.disabled = false;
            this.chatInput.focus();
        }
    }

    // Mostrar indicador de carregamento
    showLoadingIndicator() {
        if (!this.messagesContainer) return;

        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'loading-messages';
        loadingDiv.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Carregando mensagens...';
        this.messagesContainer.insertBefore(loadingDiv, this.messagesContainer.firstChild);
    }

    // Esconder indicador de carregamento
    hideLoadingIndicator() {
        const loadingElement = document.querySelector('.loading-messages');
        if (loadingElement) {
            loadingElement.remove();
        }
    }

    // Rolar para o final
    scrollToBottom() {
        if (this.messagesContainer) {
            this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
        }
    }

    // Mostrar lista de boards (mobile)
    showBoardsList() {
        if (window.innerWidth <= 768) {
            document.body.classList.remove('show-chat-conversation');
        }
    }

    // Mostrar área de conversa (mobile)
    showConversationArea() {
        if (window.innerWidth <= 768) {
            document.body.classList.add('show-chat-conversation');
        }
    }

    // Mostrar erro
    showError(message) {
        console.error(message);
        // Usar sistema de notificações toast se disponível
        if (window.toastManager) {
            window.toastManager.error(message);
        } else {
            alert(message);
        }
    }

    // Limpar dados do chat (útil para logout)
    clearChatData() {
        this.currentBoardId = null;
        this.currentChat = null;
        this.messages = [];
        this.currentPage = 1;
        this.isLoading = false;
        this.hasMoreMessages = true;
        this.userBoards = [];

        // Limpar interface
        if (this.contactsList) {
            this.contactsList.innerHTML = '';
        }
        if (this.messagesContainer) {
            this.messagesContainer.innerHTML = '';
        }
        if (this.chatInput) {
            this.chatInput.value = '';
        }
    }

    // Recarregar dados do chat (útil após login)
    async reloadChatData() {
        this.clearChatData();
        await this.loadUserBoards();
    }
}

// Inicializar gerenciador de chat em grupo
window.groupChatManager = new GroupChatManager();