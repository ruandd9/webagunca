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
│   ├── 📄 package-lock.json         # Lock file das dependências
│   ├── 📄 .gitignore                # Arquivos ignorados pelo Git
│   ├── 📄 conexao.md                # Documentação de conexão
│   ├── 📄 test-notifications.js     # Testes do sistema de notificações
│   ├── 📄 test-jwt-config.js        # Testes da configuração de JWT
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
│   │   ├── 📄 ChatMessage.js        # Mensagens do chat
│   │   └── 📄 Chat.js               # Modelo de chat
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
│   ├── 📁 controllers/              # Controladores da aplicação
│   │   └── 📄 chatController.js     # Controlador do chat
│   │
│   ├── 📁 config/                   # Configurações da aplicação
│   │   └── 📄 jwtConfig.js          # Configurações centralizadas de JWT
│   │
│   ├── 📁 middleware/               # Middlewares do Express
│   │   ├── 📄 authMiddleware.js     # Autenticação JWT
│   │   └── 📄 boardMemberMiddleware.js # Middleware de membros do quadro
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
    │   ├── 📁 icons sidebar/        # Ícones da barra lateral
    │   │   ├── 📁 icons header/     # Ícones do cabeçalho
    │   │   ├── 📄 icons-settings.svg
    │   │   ├── 📄 icons-help.svg
    │   │   ├── 📄 icons-notifications.png
    │   │   ├── 📄 icons-calendar.svg
    │   │   └── 📄 icon-boards.svg
    │   ├── 📁 icons-sign/           # Ícones de login/registro
    │   │   ├── 📄 icon-goooooogle.svg
    │   │   ├── 📄 icon-pornHub.svg
    │   │   └── 📄 icon-facebaks.svg
    │   ├── 📁 img-sobreNos/         # Imagens da página sobre
    │   │   ├── 📄 dreamstime_xl_2589197.jpg
    │   │   └── 📄 Group 1.svg
    │   ├── 🖼️ logo-bagunca.svg      # Logo principal
    │   ├── 🖼️ logo-bagunca-preto.svg # Logo em preto
    │   ├── 🖼️ logoBag.png          # Logo em PNG
    │   ├── 🖼️ bagunca-logo-colorida.png # Logo colorida
    │   ├── 🖼️ background-index.svg  # Background da página inicial
    │   ├── 🖼️ star.svg             # Ícone de estrela
    │   ├── 🖼️ golden-star.svg      # Ícone de estrela dourada
    │   ├── 🖼️ share-archive-icon.svg # Ícone de compartilhar arquivo
    │   ├── 🖼️ share-img-icon.svg   # Ícone de compartilhar imagem
    │   ├── 🖼️ pesquisa.svg         # Ícone de pesquisa
    │   ├── 🖼️ paper-airplane.svg   # Ícone de avião de papel
    │   ├── 🖼️ logo.svg             # Logo genérico
    │   ├── 🖼️ btn-return.svg       # Botão de retorno
    │   ├── 🖼️ Vector-details.svg   # Vetor de detalhes
    │   ├── 🖼️ Vector-btn-return.svg # Vetor do botão de retorno
    │   ├── 🖼️ Group 18.svg         # Grupo de elementos
    │   ├── 🖼️ Cute-Cat.jpg         # Imagem de gato fofo
    │   └── 🖼️ [outros assets visuais]
    │
    └── 📁 js/                       # JavaScript do frontend
        ├── 📁 features/             # Funcionalidades por módulo
        │   ├── 📁 auth/             # Autenticação e login
        │   │   └── 📄 tokenManager.js   # Gerenciamento de tokens JWT
        │   ├── 📁 board/            # Lógica dos quadros Kanban
        │   ├── 📁 calendar/         # Funcionalidades do calendário
        │   ├── 📁 chat/             # Sistema de chat modular
        │   │   ├── 📄 chatService.js    # Serviço de API do chat
        │   │   ├── 📄 groupChat.js      # Lógica de chat em grupo
        │   │   ├── 📄 chatUI.js         # Interface do chat
        │   │   └── 📄 chat.js           # Integração e compatibilidade
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
- **Arquitetura MVC** com controllers separados
- **Middleware de autenticação** e serviços organizados
- **Novo modelo Chat.js** para gerenciamento de chats
- **Middleware de membros do quadro** para controle de permissões

### Frontend (HTML + CSS + JavaScript Vanilla)
- **Interface responsiva** com sistema de temas
- **Organização modular** por funcionalidades
- **Assets bem organizados** (CSS, imagens, scripts)
- **Múltiplas páginas** para diferentes funcionalidades
- **Sistema de ícones SVG** organizado por categoria

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
- **Sistema de temas** personalizável
- **Tutorial interativo** para novos usuários

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
- **Controle de versão** com Git
- **Organização de ícones** por contexto de uso

### Novidades na Estrutura
- **Pasta controllers** adicionada para melhor separação de responsabilidades
- **Novo middleware** para controle de membros do quadro
- **Modelo Chat.js** para gerenciamento de chats
- **Organização melhorada** dos ícones SVG
- **Arquivos de configuração** (.gitignore, package-lock.json)
- **Configuração centralizada de JWT** com tempo de expiração de 20 dias
- **TokenManager** para gerenciamento automático de tokens
- **Sistema de configuração por ambiente** (desenvolvimento/produção)

O projeto representa uma aplicação completa de gerenciamento de projetos estilo Trello/Kanban com funcionalidades sociais e colaborativas integradas, seguindo boas práticas de arquitetura e organização de código.