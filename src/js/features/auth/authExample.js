// Exemplo de uso do TokenManager para resolver problemas de JWT expirado

// 1. Verificar se o token está expirado ao carregar a página
document.addEventListener('DOMContentLoaded', function() {
    if (tokenManager.isTokenExpired()) {
        console.log('Token expirado detectado. Redirecionando para login...');
        tokenManager.logout();
        return;
    }

    if (tokenManager.isTokenExpiringSoon()) {
        console.log('Token expirando em breve. Considere renovar...');
        // Aqui você pode implementar renovação automática se necessário
    }
});

// 2. Exemplo de requisição usando TokenManager
async function exemploRequisicao() {
    try {
        const response = await tokenManager.makeAuthenticatedRequest('/api/boards', {
            method: 'GET'
        });
        
        if (response.ok) {
            const data = await response.json();
            console.log('Dados recebidos:', data);
        }
    } catch (error) {
        if (error.message.includes('Sessão expirada')) {
            // O TokenManager já tratou o logout automaticamente
            console.log('Usuário redirecionado para login');
        } else {
            console.error('Erro na requisição:', error);
        }
    }
}

// 3. Exemplo de tratamento manual de erro 401
async function exemploTratamentoManual() {
    const token = tokenManager.getToken();
    
    const response = await fetch('/api/boards', {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    if (response.status === 401) {
        // Verificar se o TokenManager pode tratar o erro
        if (!tokenManager.handleAuthError(response)) {
            // Erro não tratado pelo TokenManager
            console.error('Erro de autenticação não tratado');
        }
        return;
    }

    // Continuar com o processamento normal
    const data = await response.json();
    console.log('Dados:', data);
}

// 4. Função para renovar token (se implementado no backend)
async function renovarToken() {
    try {
        const response = await fetch('/api/auth/refresh', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${tokenManager.getToken()}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const data = await response.json();
            tokenManager.setToken(data.token);
            console.log('Token renovado com sucesso');
        } else {
            // Se não conseguir renovar, fazer logout
            tokenManager.logout();
        }
    } catch (error) {
        console.error('Erro ao renovar token:', error);
        tokenManager.logout();
    }
}

// 5. Exemplo de verificação periódica do token
function iniciarVerificacaoPeriodica() {
    setInterval(() => {
        if (tokenManager.isTokenExpired()) {
            console.log('Token expirado detectado durante verificação periódica');
            tokenManager.logout();
        } else if (tokenManager.isTokenExpiringSoon()) {
            console.log('Token expirando em breve - considerando renovação');
            // Implementar lógica de renovação automática aqui
        }
    }, 5 * 60 * 1000); // Verificar a cada 5 minutos
}

// 6. Função para obter informações do usuário do token
function obterInfoUsuario() {
    const userInfo = tokenManager.getUserInfo();
    if (userInfo) {
        console.log('ID do usuário:', userInfo.id);
        console.log('Token criado em:', new Date(userInfo.iat * 1000));
        console.log('Token expira em:', new Date(userInfo.exp * 1000));
    } else {
        console.log('Não foi possível obter informações do usuário');
    }
}

// Exportar funções para uso em outros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        exemploRequisicao,
        exemploTratamentoManual,
        renovarToken,
        iniciarVerificacaoPeriodica,
        obterInfoUsuario
    };
} 