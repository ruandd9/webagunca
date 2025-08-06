// Configurações centralizadas para JWT
const jwtConfig = {
    // Tempo de expiração do token (20 dias)
    expiresIn: '20d',
    
    // Tempo em segundos (para cálculos)
    expiresInSeconds: 20 * 24 * 60 * 60, // 20 dias em segundos
    
    // Tempo de expiração em milissegundos
    expiresInMs: 20 * 24 * 60 * 60 * 1000, // 20 dias em milissegundos
    
    // Threshold para renovação (3 dias antes de expirar)
    refreshThreshold: 3 * 24 * 60 * 60 * 1000, // 3 dias em ms
    
    // Configurações de segurança
    algorithm: 'HS256',
    
    // Tempo de expiração para refresh tokens (se implementado)
    refreshTokenExpiresIn: '30d',
    
    // Configurações para diferentes ambientes
    development: {
        expiresIn: '30d', // Mais tempo para desenvolvimento
        refreshThreshold: 5 * 24 * 60 * 60 * 1000 // 5 dias
    },
    
    production: {
        expiresIn: '20d', // Tempo padrão para produção
        refreshThreshold: 3 * 24 * 60 * 60 * 1000 // 3 dias
    }
};

// Função para obter configuração baseada no ambiente
function getJwtConfig(environment = 'production') {
    const baseConfig = {
        expiresIn: jwtConfig.expiresIn,
        refreshThreshold: jwtConfig.refreshThreshold
    };
    
    if (environment === 'development') {
        return {
            ...baseConfig,
            expiresIn: jwtConfig.development.expiresIn,
            refreshThreshold: jwtConfig.development.refreshThreshold
        };
    }
    
    return baseConfig;
}

// Função para calcular tempo restante do token
function calculateTimeRemaining(token) {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const expirationTime = payload.exp * 1000;
        const currentTime = Date.now();
        return expirationTime - currentTime;
    } catch (error) {
        console.error('Erro ao calcular tempo restante:', error);
        return 0;
    }
}

// Função para verificar se o token está próximo de expirar
function isTokenExpiringSoon(token, threshold = jwtConfig.refreshThreshold) {
    const timeRemaining = calculateTimeRemaining(token);
    return timeRemaining < threshold;
}

// Função para obter informações do token
function getTokenInfo(token) {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return {
            id: payload.id,
            iat: payload.iat,
            exp: payload.exp,
            issuedAt: new Date(payload.iat * 1000),
            expiresAt: new Date(payload.exp * 1000),
            timeRemaining: calculateTimeRemaining(token)
        };
    } catch (error) {
        console.error('Erro ao obter informações do token:', error);
        return null;
    }
}

module.exports = {
    jwtConfig,
    getJwtConfig,
    calculateTimeRemaining,
    isTokenExpiringSoon,
    getTokenInfo
}; 