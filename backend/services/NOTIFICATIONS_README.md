# Sistema de Notificações - Bagunça

## Visão Geral

O sistema de notificações do Bagunça permite que os usuários recebam notificações em tempo real sobre atividades importantes nos quadros, como:

- Ser adicionado a um quadro
- Cartões próximos do vencimento
- Menções em comentários
- Movimentação de cartões
- Criação de novas listas

## Funcionalidades

### Tipos de Notificações

1. **board_added**: Quando um usuário é adicionado a um quadro
2. **card_due_soon**: Quando um cartão está próximo do vencimento (até 3 dias)
3. **card_mentioned**: Quando um usuário é mencionado em um comentário
4. **card_moved**: Quando um cartão é movido entre listas
5. **list_created**: Quando uma nova lista é criada

### Características

- **Notificações em tempo real**: Atualização automática a cada 30 segundos
- **Filtros**: Por tipo de notificação (Todas, Não lidas, Menções)
- **Paginação**: Carregamento sob demanda
- **Marcação como lida**: Clique para marcar como lida
- **Badge de contagem**: Exibe número de notificações não lidas

## Estrutura do Backend

### Modelos

#### Notification.js
```javascript
{
  userId: ObjectId,        // Usuário que recebe a notificação
  type: String,           // Tipo da notificação
  title: String,          // Título da notificação
  message: String,        // Mensagem da notificação
  read: Boolean,          // Se foi lida
  relatedData: {          // Dados relacionados
    boardId: ObjectId,
    cardId: ObjectId,
    listId: String,
    mentionedBy: ObjectId
  },
  createdAt: Date         // Data de criação
}
```

### Rotas da API

#### GET /api/notifications
Lista notificações do usuário com paginação e filtros.

**Parâmetros:**
- `page`: Número da página (padrão: 1)
- `limit`: Itens por página (padrão: 20)
- `filter`: Tipo de filtro (all, unread, mentions, board_added, card_due_soon)

#### PATCH /api/notifications/:id/read
Marca uma notificação como lida.

#### PATCH /api/notifications/read-all
Marca todas as notificações como lidas.

#### GET /api/notifications/unread-count
Retorna o número de notificações não lidas.

#### DELETE /api/notifications/:id
Remove uma notificação.

### Serviços

#### notificationService.js
Contém funções para criar notificações automaticamente:

- `checkDueDateNotifications()`: Verifica cartões próximos do vencimento
- `createMentionNotification()`: Cria notificação de menção
- `createCardMovedNotification()`: Cria notificação de cartão movido
- `createListCreatedNotification()`: Cria notificação de lista criada

## Estrutura do Frontend

### Arquivos JavaScript

#### notifications.js
Gerencia a página de notificações:
- Carregamento de notificações
- Filtros
- Paginação
- Marcação como lida

#### notificationBadge.js
Gerencia badges de notificações em outras páginas:
- Contador de notificações não lidas
- Atualização automática
- Exibição em menu lateral e header

### Integração em Outras Páginas

Para adicionar o badge de notificações em uma página:

```html
<script src="../src/js/features/notifications/notificationBadge.js"></script>
```

O script será inicializado automaticamente e mostrará o badge quando houver notificações não lidas.

## Configuração

### Agendamento de Tarefas

O servidor verifica automaticamente cartões próximos do vencimento:
- A cada 6 horas
- Execução inicial após 1 minuto do start

### Variáveis de Ambiente

Certifique-se de que o MongoDB está configurado corretamente no arquivo `.env`:

```
MONGODB_URI=sua_uri_do_mongodb
```

## Uso

### Para Desenvolvedores

#### Criar uma nova notificação manualmente:

```javascript
const { createNotification } = require('./routes/notificationRoutes');

await createNotification(
  userId,
  'board_added',
  'Título da notificação',
  'Mensagem da notificação',
  { boardId: boardId }
);
```

#### Integrar em rotas existentes:

```javascript
const { createMentionNotification } = require('./services/notificationService');

// Em uma rota de comentários
await createMentionNotification(
  mentionedUserId,
  userWhoMentioned,
  cardId,
  boardId,
  cardTitle
);
```

### Para Usuários

1. **Visualizar notificações**: Acesse a página de notificações
2. **Filtrar**: Use os botões de filtro para ver tipos específicos
3. **Marcar como lida**: Clique em uma notificação para marcá-la como lida
4. **Carregar mais**: Use o botão "Carregar mais" para ver notificações antigas

## Exemplos de Notificações

### Adicionado a um quadro:
```
"João Silva adicionou você ao quadro 'Projeto Website'"
```

### Cartão próximo do vencimento:
```
"O cartão 'Implementar login' vence em 2 dias no quadro 'Projeto Website'"
```

### Menção em comentário:
```
"Maria Santos mencionou você no cartão 'Criar API'"
```

## Manutenção

### Limpeza de Notificações Antigas

Para manter o banco de dados otimizado, considere implementar uma limpeza automática de notificações antigas (ex: mais de 30 dias).

### Monitoramento

O sistema loga informações sobre:
- Verificação de prazos
- Erros na criação de notificações
- Conexão com o banco de dados

## Troubleshooting

### Problemas Comuns

1. **Notificações não aparecem**: Verifique se o token de autenticação está válido
2. **Badge não atualiza**: Verifique se o script notificationBadge.js está incluído
3. **Erro de conexão**: Verifique se o servidor está rodando na porta 5000

### Logs

Monitore os logs do servidor para identificar problemas:
- Erros de conexão com MongoDB
- Falhas na criação de notificações
- Problemas de autenticação 

### Como usar:
```bash 1. Iniciar o servidor:
   cd backend
   npm start
```

```bash 2. Testar o sistema:
    npm run test:notifications
```
3. Acessar notificações:
Faça login no sistema
Acesse a página de notificações
Use os filtros e funcionalidades