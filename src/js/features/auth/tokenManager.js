class TokenManager {
    constructor() {
        this.tokenKey = 'token';
        // Configuração para tokens de 20 dias - threshold de 3 dias
        this.refreshThreshold = 3 * 24 * 60 * 60 * 1000; // 3 dias em ms
        this.tokenExpirationDays = 20; // Para referência
    }

    // Obter token do localStorage
    getToken() {
        return localStorage.getItem(this.tokenKey);
    }

    // Salvar token no localStorage
    setToken(token) {
        localStorage.setItem(this.tokenKey, token);
    }

    // Remover token
    removeToken() {
        localStorage.removeItem(this.tokenKey);
    }

    // Verificar se o token está próximo de expirar
    isTokenExpiringSoon() {
        const token = this.getToken();
        if (!token) return true;

        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const expirationTime = payload.exp * 1000; // Converter para ms
            const currentTime = Date.now();
            const timeUntilExpiration = expirationTime - currentTime;

            // Se faltar menos de 24 horas para expirar, considerar como "expirando em breve"
            return timeUntilExpiration < this.refreshThreshold;
        } catch (error) {
            console.error('Erro ao decodificar token:', error);
            return true;
        }
    }

    // Verificar se o token expirou
    isTokenExpired() {
        const token = this.getToken();
        if (!token) return true;

        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const expirationTime = payload.exp * 1000;
            const currentTime = Date.now();

            return currentTime >= expirationTime;
        } catch (error) {
            console.error('Erro ao decodificar token:', error);
            return true;
        }
    }

    // Decodificar token (sem verificação de assinatura)
    decodeToken() {
        const token = this.getToken();
        if (!token) return null;

        try {
            return JSON.parse(atob(token.split('.')[1]));
        } catch (error) {
            console.error('Erro ao decodificar token:', error);
            return null;
        }
    }

    // Obter informações do usuário do token
    getUserInfo() {
        const payload = this.decodeToken();
        return payload ? {
            id: payload.id,
            iat: payload.iat,
            exp: payload.exp
        } : null;
    }

    // Forçar logout
    logout() {
        this.removeToken();
        window.location.href = '../index.html';
    }

    // Tratar resposta de erro 401 (token expirado)
    handleAuthError(response) {
        if (response.status === 401) {
            const errorData = response.json ? response.json() : {};
            
            if (errorData.expired || this.isTokenExpired()) {
                console.log('Token expirado. Redirecionando para login...');
                this.logout();
                return true; // Indica que o erro foi tratado
            }
        }
        return false; // Erro não tratado
    }

    // Função auxiliar para fazer requisições com tratamento de token
    async makeAuthenticatedRequest(url, options = {}) {
        const token = this.getToken();
        
        if (!token) {
            this.logout();
            throw new Error('Token não encontrado');
        }

        // Adicionar headers de autenticação
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            ...options.headers
        };

        try {
            const response = await fetch(url, {
                ...options,
                headers
            });

            // Verificar se é erro de autenticação
            if (this.handleAuthError(response)) {
                throw new Error('Sessão expirada. Redirecionando...');
            }

            return response;
        } catch (error) {
            if (error.message.includes('Sessão expirada')) {
                throw error;
            }
            
            // Outros erros de rede
            console.error('Erro na requisição:', error);
            throw error;
        }
    }
}

// Instância global do TokenManager
const tokenManager = new TokenManager();

// Exportar para uso em outros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TokenManager;
} else {
    window.TokenManager = TokenManager;
    window.tokenManager = tokenManager;
} 