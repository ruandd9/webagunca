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

5. **Testando as rotas (exemplo com Postman):**

   - **Cadastro:**
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

## Dependências utilizadas
- express
- mongoose
- dotenv
- cors
- bcryptjs

---

Se precisar mudar o banco, altere o nome após `.net/` na string do `MONGODB_URI`.

Dúvidas? Consulte o README ou peça ajuda ao suporte do projeto! 