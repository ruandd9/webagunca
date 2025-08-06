# Sistema de Notificações Toast Temáticas

Este sistema substitui os `window.alert` por notificações toast modernas e temáticas que se adaptam ao tema atual da aplicação.

## Características

- ✅ **Temático**: Adapta-se automaticamente ao tema atual (dark, light, colorful, high-contrast)
- ✅ **Responsivo**: Funciona bem em dispositivos móveis e desktop
- ✅ **Acessível**: Suporte para temas de alto contraste
- ✅ **Animado**: Animações suaves de entrada e saída
- ✅ **Auto-dismiss**: Remove automaticamente após um tempo configurável
- ✅ **Interativo**: Botão para fechar manualmente
- ✅ **Barra de progresso**: Mostra visualmente quanto tempo resta
- ✅ **Fallback**: Mantém compatibilidade com `window.alert` se o sistema não estiver disponível

## Tipos de Notificação

### 1. Sucesso (Success)
```javascript
window.toastManager.success('Operação realizada com sucesso!');
```

### 2. Erro (Error)
```javascript
window.toastManager.error('Ocorreu um erro na operação');
```

### 3. Aviso (Warning)
```javascript
window.toastManager.warning('Atenção: Esta ação não pode ser desfeita');
```

### 4. Informação (Info)
```javascript
window.toastManager.info('Sistema atualizado com sucesso');
```

## Uso Básico

### Método Principal
```javascript
window.toastManager.show(message, type, duration);
```

**Parâmetros:**
- `message` (string): Mensagem a ser exibida
- `type` (string): Tipo da notificação ('success', 'error', 'warning', 'info')
- `duration` (number): Duração em milissegundos (0 = não remove automaticamente)

### Métodos de Conveniência
```javascript
// Sucesso (5 segundos)
window.toastManager.success('Mensagem de sucesso');

// Erro (7 segundos)
window.toastManager.error('Mensagem de erro');

// Aviso (6 segundos)
window.toastManager.warning('Mensagem de aviso');

// Informação (5 segundos)
window.toastManager.info('Mensagem informativa');
```

## Exemplos de Uso

### Substituindo window.alert
```javascript
// Antes
alert('Erro ao salvar dados');

// Depois
if (window.toastManager) {
    window.toastManager.error('Erro ao salvar dados');
} else {
    alert('Erro ao salvar dados');
}
```

### Notificação com duração personalizada
```javascript
// Notificação que permanece por 10 segundos
window.toastManager.show('Processando...', 'info', 10000);

// Notificação que não desaparece automaticamente
window.toastManager.show('Ação importante', 'warning', 0);
```

### Limpar todas as notificações
```javascript
window.toastManager.clearAll();
```

## Integração com Temas

O sistema automaticamente detecta mudanças de tema e se adapta:

```javascript
// Atualizar tema manualmente (se necessário)
window.toastManager.updateTheme();
```

## Estrutura dos Arquivos

```
src/js/features/notifications/
├── toastNotifications.js    # Sistema principal
├── toast-example.js         # Exemplos de uso
└── TOAST_README.md          # Esta documentação

src/css/
└── toast-notifications.css  # Estilos CSS
```

## Inclusão nos Arquivos HTML

Para usar o sistema, inclua os seguintes arquivos:

```html
<!-- CSS -->
<link rel="stylesheet" href="../src/css/toast-notifications.css">

<!-- JavaScript -->
<script src="../src/js/features/notifications/toastNotifications.js"></script>
```

## Migração de window.alert

### Padrão de Substituição
```javascript
// Padrão para substituir alerts
if (window.toastManager) {
    window.toastManager.error('Mensagem de erro');
} else {
    alert('Mensagem de erro');
}
```

### Mapeamento de Tipos
- **Erros**: `window.toastManager.error()`
- **Sucessos**: `window.toastManager.success()`
- **Avisos**: `window.toastManager.warning()`
- **Informações**: `window.toastManager.info()`

## Personalização

### Cores por Tema
O sistema usa as variáveis CSS do tema atual:
- `--bg-secondary`: Fundo da notificação
- `--text-primary`: Cor do texto principal
- `--text-secondary`: Cor do texto secundário
- `--border`: Cor da borda

### Cores Específicas por Tipo
- **Sucesso**: Verde (#22c55e)
- **Erro**: Vermelho (#ef4444)
- **Aviso**: Amarelo (#f59e0b)
- **Informação**: Azul (#3b82f6)

## Compatibilidade

- ✅ Chrome/Chromium
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Dispositivos móveis

## Troubleshooting

### Sistema não carrega
1. Verifique se o arquivo `toastNotifications.js` está incluído
2. Verifique se o arquivo `toast-notifications.css` está incluído
3. Verifique o console do navegador para erros

### Notificações não aparecem
1. Verifique se `window.toastManager` existe
2. Verifique se há conflitos de z-index
3. Verifique se o CSS está carregado corretamente

### Tema não se aplica
1. Verifique se o tema está definido no `localStorage`
2. Chame `window.toastManager.updateTheme()` manualmente
3. Verifique se as variáveis CSS do tema estão definidas 