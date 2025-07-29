# Como conectar e rodar o back-end do projeto

## Pré-requisitos
- Node.js instalado (versão 14 ou superior)
- Conta no MongoDB Atlas (já configurada)
- Postman (opcional, para testes)

## Passos para rodar o back-end

1. **Acesse a pasta do projeto:**
   ```bash
   cd backend
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Crie o arquivo `.env` na pasta `backend` com o seguinte conteúdo:**
   ```env
   MONGODB_URI=mongodb+srv://baguncasuporte:33QmPk0B2IoRDZKR@webagunca.1dwrpea.mongodb.net/webagunca?retryWrites=true&w=majority&appName=webagunca
   PORT=5000
   ```
   > Altere a string de conexão se necessário, conforme seu cluster e banco.

4. **Inicie o servidor:**
   ```bash
   node server.js
   ```
   Você verá:
   - `Servidor rodando na porta 5000`
   - `Conectado ao MongoDB Atlas`

## Rotas da API disponíveis

| Método | Endpoint                | Descrição                                      |
|--------|-------------------------|------------------------------------------------|
| POST   | /api/cadastrar          | Cadastra um novo usuário                       |
| POST   | /api/login              | Realiza o login/autenticação do usuário        |
| GET    | /api/usuarios           | Lista todos os usuários cadastrados (sem senha)|
| GET    | /api/usuario/:email     | Busca um usuário pelo email (sem senha)        |
| POST   | /api/boards             | Cria um novo quadro (board)                    |
| GET    | /api/boards             | Lista todos os quadros                         |
| POST   | /api/lists              | Cria uma nova lista                            |
| GET    | /api/lists              | Lista todas as listas                          |
| POST   | /api/cards              | Cria um novo card                              |
| GET    | /api/cards              | Lista todos os cards                           |
| POST   | /api/board-members      | Adiciona um membro a um board                  |
| GET    | /api/board-members      | Lista todos os membros de boards               |
| POST   | /api/comments           | Cria um novo comentário                        |
| GET    | /api/comments           | Lista todos os comentários                     |
| POST   | /api/card-labels        | Cria uma nova etiqueta (label) em um card      |
| GET    | /api/card-labels        | Lista todas as etiquetas                       |

---

## Exemplos de uso das rotas

### Cadastro de usuário
- **POST** `http://localhost:5000/api/cadastrar`
- Body (JSON):
```json
{
  "nomeCompleto": "Maria Silva",
  "email": "maria@exemplo.com",
  "senha": "123456"
}
```

### Login
- **POST** `http://localhost:5000/api/login`
- Body (JSON):
```json
{
  "email": "maria@exemplo.com",
  "senha": "123456"
}
```

### Criar board
- **POST** `http://localhost:5000/api/boards`
- Body (JSON):
```json
{
  "title": "Meu Quadro",
  "description": "Descrição do quadro",
  "visibility": "public",
  "cover_type": "image",
  "cover_value": "url_da_imagem",
  "owner": "<ID_DO_USUARIO>"
}
```

### Criar lista
- **POST** `http://localhost:5000/api/lists`
- Body (JSON):
```json
{
  "boardId": "<ID_DO_BOARD>",
  "name": "A Fazer",
  "position": 1
}
```

### Criar card
- **POST** `http://localhost:5000/api/cards`
- Body (JSON):
```json
{
  "boardId": "<ID_DO_BOARD>",
  "listId": "<ID_DA_LISTA>",
  "title": "Título do card",
  "description": "Descrição do card",
  "dueDate": "2024-06-01T00:00:00.000Z",
  "createdBy": "<ID_DO_USUARIO>"
}
```

### Adicionar membro a um board
- **POST** `http://localhost:5000/api/board-members`
- Body (JSON):
```json
{
  "boardId": "<ID_DO_BOARD>",
  "userId": "<ID_DO_USUARIO>",
  "role": "admin"
}
```

### Criar comentário em um card
- **POST** `http://localhost:5000/api/comments`
- Body (JSON):
```json
{
  "cardId": "<ID_DO_CARD>",
  "userId": "<ID_DO_USUARIO>",
  "text": "Esse é um comentário de teste!"
}
```

### Criar etiqueta (label) em um card
- **POST** `http://localhost:5000/api/card-labels`
- Body (JSON):
```json
{
  "cardId": "<ID_DO_CARD>",
  "name": "Urgente",
  "color": "#FF0000"
}
```

---

## Observações
- Sempre substitua `<ID_DO_USUARIO>`, `<ID_DO_BOARD>`, `<ID_DA_LISTA>`, `<ID_DO_CARD>` pelos valores reais do seu banco de dados.
- Para obter esses IDs, utilize as rotas de listagem correspondentes (ex: `/api/boards`, `/api/lists`, `/api/cards`, `/api/usuarios`).
- Para listar, basta fazer uma requisição GET para o endpoint desejado.

Se precisar mudar o banco, altere o nome após `.net/` na string do `MONGODB_URI`.

##.env
MONGODB_URI=mongodb+srv://baguncasuporte:baguncadb@webagunca.1dwrpea.mongodb.net/?retryWrites=true&w=majority&appName=webagunca
PORT=5000

Dúvidas? Consulte o README ou peça ajuda ao suporte do projeto! 
