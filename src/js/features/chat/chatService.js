// Serviço para integração com a API de chat
class ChatService {
    constructor() {
        this.baseURL = 'http://localhost:5000/api';
    }

    // Obter token de autenticação
    getAuthToken() {
        return localStorage.getItem('token');
    }

    // Headers padrão para requisições
    getHeaders() {
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.getAuthToken()}`
        };
    }

    // Buscar ou criar chat do board
    async getBoardChat(boardId) {
        try {
            const response = await fetch(`${this.baseURL}/chat/group/${boardId}`, {
                method: 'GET',
                headers: this.getHeaders()
            });

            if (!response.ok) {
                throw new Error(`Erro ${response.status}: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Erro ao buscar chat do board:', error);
            throw error;
        }
    }

    // Buscar mensagens do chat
    async getChatMessages(boardId, page = 1, limit = 50) {
        try {
            const response = await fetch(`${this.baseURL}/chat/group/${boardId}/messages?page=${page}&limit=${limit}`, {
                method: 'GET',
                headers: this.getHeaders()
            });

            if (!response.ok) {
                throw new Error(`Erro ${response.status}: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Erro ao buscar mensagens:', error);
            throw error;
        }
    }

    // Enviar mensagem
    async sendMessage(boardId, content, messageType = 'text') {
        try {
            const response = await fetch(`${this.baseURL}/chat/group/${boardId}`, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify({
                    content,
                    messageType
                })
            });

            if (!response.ok) {
                throw new Error(`Erro ${response.status}: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Erro ao enviar mensagem:', error);
            throw error;
        }
    }

    // Editar mensagem
    async editMessage(boardId, messageId, content) {
        try {
            const response = await fetch(`${this.baseURL}/chat/group/${boardId}/message/${messageId}`, {
                method: 'PUT',
                headers: this.getHeaders(),
                body: JSON.stringify({ content })
            });

            if (!response.ok) {
                throw new Error(`Erro ${response.status}: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Erro ao editar mensagem:', error);
            throw error;
        }
    }

    // Deletar mensagem
    async deleteMessage(boardId, messageId) {
        try {
            const response = await fetch(`${this.baseURL}/chat/group/${boardId}/message/${messageId}`, {
                method: 'DELETE',
                headers: this.getHeaders()
            });

            if (!response.ok) {
                throw new Error(`Erro ${response.status}: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Erro ao deletar mensagem:', error);
            throw error;
        }
    }

    // Buscar boards do usuário
    async getUserBoards() {
        try {
            const response = await fetch(`${this.baseURL}/boards`, {
                method: 'GET',
                headers: this.getHeaders()
            });

            if (!response.ok) {
                throw new Error(`Erro ${response.status}: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Erro ao buscar boards:', error);
            throw error;
        }
    }

    // Buscar boards onde o usuário é membro
    async getUserMemberBoards() {
        try {
            const response = await fetch(`${this.baseURL}/board-members/user/boards`, {
                method: 'GET',
                headers: this.getHeaders()
            });

            if (!response.ok) {
                throw new Error(`Erro ${response.status}: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Erro ao buscar boards como membro:', error);
            throw error;
        }
    }
}

// Exportar instância única do serviço
const chatService = new ChatService();
window.chatService = chatService;