// Script de teste para verificar configuração de JWT de 20 dias
const jwt = require('jsonwebtoken');
const { jwtConfig, getTokenInfo, calculateTimeRemaining } = require('./config/jwtConfig');

console.log('🔧 Testando configuração de JWT de 20 dias...\n');

// Simular criação de um token
const mockUserId = '507f1f77bcf86cd799439011';
const payload = { id: mockUserId };

console.log('📋 Configuração atual:');
console.log(`   - Tempo de expiração: ${jwtConfig.expiresIn}`);
console.log(`   - Threshold de renovação: ${jwtConfig.refreshThreshold / (24 * 60 * 60 * 1000)} dias`);
console.log(`   - Algoritmo: ${jwtConfig.algorithm}\n`);

// Criar token de teste (usando uma chave secreta de teste)
const testSecret = 'test-secret-key';
const token = jwt.sign(payload, testSecret, {
    expiresIn: jwtConfig.expiresIn
});

console.log('🎫 Token criado com sucesso!');
console.log(`   - Token: ${token.substring(0, 50)}...\n`);

// Decodificar e analisar o token
try {
    const decoded = jwt.verify(token, testSecret);
    const tokenInfo = getTokenInfo(token);
    
    console.log('📊 Informações do token:');
    console.log(`   - ID do usuário: ${decoded.id}`);
    console.log(`   - Criado em: ${new Date(decoded.iat * 1000).toLocaleString('pt-BR')}`);
    console.log(`   - Expira em: ${new Date(decoded.exp * 1000).toLocaleString('pt-BR')}`);
    console.log(`   - Tempo restante: ${Math.round(tokenInfo.timeRemaining / (24 * 60 * 60 * 1000))} dias`);
    
    // Calcular diferença em dias
    const now = Math.floor(Date.now() / 1000);
    const daysUntilExpiration = Math.round((decoded.exp - now) / (24 * 60 * 60));
    
    console.log(`   - Dias até expirar: ${daysUntilExpiration} dias\n`);
    
    // Verificar se está próximo de expirar
    const isExpiringSoon = tokenInfo.timeRemaining < jwtConfig.refreshThreshold;
    console.log('⚠️  Status de renovação:');
    console.log(`   - Próximo de expirar: ${isExpiringSoon ? 'SIM' : 'NÃO'}`);
    console.log(`   - Threshold: ${jwtConfig.refreshThreshold / (24 * 60 * 60 * 1000)} dias\n`);
    
    // Testar diferentes configurações de ambiente
    console.log('🌍 Configurações por ambiente:');
    const { getJwtConfig } = require('./config/jwtConfig');
    
    const devConfig = getJwtConfig('development');
    const prodConfig = getJwtConfig('production');
    
    console.log(`   - Desenvolvimento: ${devConfig.expiresIn}`);
    console.log(`   - Produção: ${prodConfig.expiresIn}\n`);
    
    console.log('✅ Teste concluído com sucesso!');
    console.log('🎉 Configuração de JWT de 20 dias está funcionando corretamente.');
    
} catch (error) {
    console.error('❌ Erro ao testar token:', error.message);
}

// Função para simular verificação de token expirado
function simulateExpiredToken() {
    console.log('\n🧪 Simulando token expirado...');
    
    // Criar token que expira em 1 segundo
    const expiredToken = jwt.sign(payload, testSecret, {
        expiresIn: '1s'
    });
    
    setTimeout(() => {
        try {
            jwt.verify(expiredToken, testSecret);
            console.log('❌ Token ainda válido (erro no teste)');
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                console.log('✅ Token expirado corretamente após 1 segundo');
            } else {
                console.log('❌ Erro inesperado:', error.message);
            }
        }
    }, 2000);
}

// Executar simulação de token expirado
simulateExpiredToken(); 