# Arquitetura do Projeto Bagunça

Sistema de Gerenciamento de Projetos/Kanban com funcionalidades colaborativas.

## Estrutura de Arquivos

```
📁 Projeto Bagunça (Sistema de Gerenciamento de Projetos/Kanban)
├── 📄 index.html                    # Página principal/landing page
├── 📄 README.md                     # Documentação do projeto
├── 🖼️ image.png                     # Imagens de preview/demonstração
├── 🖼️ preview-feature.png
├── 🖼️ preview-index.png
│
├── 📁 backend/                      # API e servidor Node.js
│   ├── 📄 server.js                 # Arquivo principal do servidor Express
│   ├── 📄 package.json              # Dependências e scripts do Node.js
│   ├── 📄 .env                      # Variáveis de ambiente (DB, JWT, etc.)
│   ├── 📄 conexao.md                # Documentação de conexão
│   ├── 📄 test-notifications.js     # Testes do sistema de notificações
│   │
│   ├── 📁 models/                   # Modelos de dados (Mongoose/MongoDB)
│   │   ├── 📄 User.js               # Modelo de usuário
│   │   ├── 📄 Board.js              # Modelo de quadro/projeto
│   │   ├── 📄 BoardMember.js        # Membros do quadro
│   │   ├── 📄 List.js               # Listas do Kanban
│   │   ├── 📄 Card.js               # Cards/tarefas
│   │   ├── 📄 CardLabel.js          # Labels dos cards
│   │   ├── 📄 Comment.js            # Comentários
│   │   ├── 📄 Notification.js       # Notificações
│   │   └── 📄 ChatMessage.js        # Mensagens do chat
│   │
│   ├── 📁 routes/                   # Rotas da API REST
│   │   ├── 📄 userRoutes.js         # Endpoints de usuários
│   │   ├── 📄 boardRoutes.js        # Endpoints de quadros
│   │   ├── 📄 boardMemberRoutes.js  # Endpoints de membros
│   │   ├── 📄 listRoutes.js         # Endpoints de listas
│   │   ├── 📄 cardRoutes.js         # Endpoints de cards
│   │   ├── 📄 cardLabelRoutes.js    # Endpoints de labels
│   │   ├── 📄 commentRoutes.js      # Endpoints de comentários
│   │   ├── 📄 notificationRoutes.js # Endpoints de notificações
│   │   └── 📄 chatRoutes.js         # Endpoints do chat
│   │
│   ├── 📁 middleware/               # Middlewares do Express
│   │   └── 📄 authMiddleware.js     # Autenticação JWT
│   │
│   ├── 📁 services/                 # Lógica de negócio
│   │   ├── 📄 notificationService.js # Serviço de notificações
│   │   └── 📄 NOTIFICATIONS_README.md # Documentação das notificações
│   │
│   └── 📁 node_modules/             # Dependências instaladas
│
├── 📁 public/                       # Páginas HTML estáticas
│   ├── 📄 board-page.html           # Interface do quadro Kanban
│   ├── 📄 chat-page.html            # Página de chat
│   ├── 📄 calendario.html           # Calendário
│   ├── 📄 notifications.html        # Página de notificações
│   ├── 📄 perfil1.html              # Página de perfil
│   ├── 📄 Quadros.html              # Lista de quadros
│   ├── 📄 sobreNos.html             # Página "Sobre Nós"
│   ├── 📄 politica-privacidade.html # Política de privacidade
│   └── 📄 termos-condicoes.html     # Termos e condições
│
└── 📁 src/                          # Assets do frontend
    ├── 📁 css/                      # Estilos CSS
    │   ├── 📄 index.css             # Estilos da página principal
    │   ├── 📄 principal-home.css    # Estilos do home
    │   ├── 📄 Quadro.css            # Estilos do quadro Kanban
    │   ├── 📄 chat-modern.css       # Estilos do chat
    │   ├── 📄 themes.css            # Sistema de temas
    │   ├── 📄 hero-animation.css    # Animações da hero section
    │   ├── 📄 sobre-nos.css         # Estilos da página sobre
    │   └── 📄 tutorial.css          # Estilos do tutorial
    │
    ├── 📁 img/                      # Imagens e ícones
    │   ├── 📁 icons-sidebar/        # Ícones da barra lateral
    │   ├── 📁 icons-sign/           # Ícones de login/registro
    │   ├── 📁 img-sobreNos/         # Imagens da página sobre
    │   ├── 🖼️ logo-bagunca.svg      # Logo principal
    │   ├── 🖼️ background-index.svg  # Background da página inicial
    │   └── 🖼️ [outros assets visuais]
    │
    └── 📁 js/                       # JavaScript do frontend
        ├── 📁 features/             # Funcionalidades por módulo
        │   ├── 📁 auth/             # Autenticação e login
        │   ├── 📁 board/            # Lógica dos quadros Kanban
        │   ├── 📁 calendar/         # Funcionalidades do calendário
        │   ├── 📁 chat/             # Sistema de chat modular
        │   │   ├── 📄 chatService.js    # Serviço de API do chat
        │   │   ├── 📄 groupChat.js      # Lógica de chat em grupo
        │   │   ├── 📄 chatUI.js         # Interface do chat
        │   │   ├── 📄 chat.js           # Integração e compatibilidade
        │   │   ├── 📄 example.js        # Exemplos de uso
        │   │   └── 📄 README.md         # Documentação técnica
        │   ├── 📁 notifications/    # Notificações frontend
        │   ├── 📁 profile/          # Gerenciamento de perfil
        │   ├── 📁 themes/           # Sistema de temas
        │   ├── 📁 tutorial/         # Tutorial interativo
        │   └── 📁 user/             # Funcionalidades do usuário
        │
        └── 📁 ui/                   # Componentes de interface
            ├── 📄 index.js          # Scripts da página principal
            └── 📄 particles.js      # Efeitos de partículas
```

## Resumo da Arquitetura

### Backend (Node.js + Express + MongoDB)
- **API REST completa** com autenticação JWT
- **Sistema de notificações** em tempo real
- **Modelos bem estruturados** para um sistema Kanban
- **Middleware de autenticação** e serviços organizados

### Frontend (HTML + CSS + JavaScript Vanilla)
- **Interface responsiva** com sistema de temas
- **Organização modular** por funcionalidades
- **Assets bem organizados** (CSS, imagens, scripts)
- **Múltiplas páginas** para diferentes funcionalidades

### Funcionalidades Principais
- **Sistema Kanban** com quadros, listas e cards
- **Chat modular em grupo** vinculado a boards com:
  - Mensagens em tempo real por quadro
  - Upload e compartilhamento de arquivos
  - Sistema de permissões (apenas membros)
  - Carregamento paginado de mensagens
  - Marcação de mensagens como lidas
  - Interface responsiva e temas personalizáveis
- **Calendário** para organização temporal
- **Sistema de notificações** para atualizações
- **Gerenciamento de usuários** e perfis
- **Interface moderna** com animações e efeitos visuais

### Stack Tecnológica
- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Frontend**: HTML5, CSS3, JavaScript ES6+
- **Autenticação**: JWT (JSON Web Tokens)
- **Banco de Dados**: MongoDB
- **Arquitetura**: MVC (Model-View-Controller)

### Padrões de Organização
- **Separação clara** entre frontend e backend
- **Modularização** por funcionalidades
- **Estrutura RESTful** para APIs
- **Organização semântica** de assets
- **Documentação integrada** ao código

O projeto representa uma aplicação completa de gerenciamento de projetos estilo Trello/Kanban com funcionalidades sociais e colaborativas integradas.