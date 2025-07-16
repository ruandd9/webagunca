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

| Método | Endpoint                        | Descrição                                      |
|--------|----------------------------------|------------------------------------------------|
| POST   | /api/cadastrar                  | Cadastra um novo usuário                       |
| POST   | /api/login                      | Realiza o login/autenticação do usuário        |
| GET    | /api/usuarios                   | Lista todos os usuários cadastrados (sem senha)|
| GET    | /api/usuario/:email             | Busca um usuário pelo email (sem senha)        |
| POST   | /api/boards/criar               | Cria um novo quadro (board)                    |
| GET    | /api/boards/quadros             | Lista todos os quadros                         |
| GET    | /api/boards/quadros/:id         | Busca um quadro pelo ID                        |

**Exemplo de uso das rotas:**

- **Cadastro de usuário:**
  - POST `http://localhost:5000/api/cadastrar`
  - Body (JSON):
    ```json
    {
      "nomeCompleto": "Maria Silva",
      "email": "maria@exemplo.com",
      "senha": "123456"
    }
    ```
- **Login:**
  - POST `http://localhost:5000/api/login`
  - Body (JSON):
    ```json
    {
      "email": "maria@exemplo.com",
      "senha": "123456"
    }
    ```
- **Listar usuários:**
  - GET `http://localhost:5000/api/usuarios`
- **Buscar usuário por email:**
  - GET `http://localhost:5000/api/usuario/maria@exemplo.com`

---

### **Rotas de Board (Quadros)**

- **Criar board:**
  - POST `http://localhost:5000/api/boards/criar`
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
    > O campo `owner` deve ser o `_id` de um usuário cadastrado (veja a rota de listar usuários acima).

- **Listar todos os boards:**
  - GET `http://localhost:5000/api/boards/quadros`

- **Buscar board por ID:**
  - GET `http://localhost:5000/api/boards/quadros/<ID_DO_BOARD>`

---

Se precisar mudar o banco, altere o nome após `.net/` na string do `MONGODB_URI`.

Dúvidas? Consulte o README ou peça ajuda ao suporte do projeto! 
