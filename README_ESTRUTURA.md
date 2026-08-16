# Sistema de Controle de Estoque

Um sistema web completo de controle de estoque com três camadas (banco de dados, back-end e front-end).

## 📋 Estrutura do Projeto

```
controle-estoque/
├── database/              # Scripts do banco de dados
│   ├── schema.sql        # Estrutura das tabelas
│   └── seed.sql          # Dados de exemplo
├── backend/              # API Node.js + Express
│   ├── src/
│   │   ├── config/       # Configurações (DB, JWT)
│   │   ├── models/       # Acesso ao banco de dados
│   │   ├── services/     # Regras de negócio
│   │   ├── controllers/  # Recebe requisições e responde
│   │   ├── routes/       # Definição de endpoints
│   │   ├── middlewares/  # Autenticação e tratamento de erros
│   │   ├── app.js        # Configuração do Express
│   │   └── server.js     # Inicia o servidor
│   ├── package.json
│   ├── .env.example      # Variáveis de ambiente
│   └── .gitignore
├── frontend/             # Interface web (HTML/CSS/JS)
│   ├── index.html        # Página de login
│   ├── app.html          # Dashboard
│   ├── css/
│   │   └── style.css
│   └── js/
│       ├── config.js     # Configurações do cliente
│       ├── api.js        # Comunicação com API
│       ├── login.js      # Lógica de login
│       └── app.js        # Lógica da dashboard
└── tests/                # Testes automatizados
    └── stock.test.js
```

## 🚀 Como Usar

### 1. Preparar o Ambiente

**Instalar Node.js e MySQL**
- Baixe e instale [Node.js](https://nodejs.org/) (versão 14+)
- Baixe e instale [MySQL Server](https://dev.mysql.com/downloads/mysql/)

### 2. Criar o Banco de Dados

```bash
# Conectar ao MySQL
mysql -u root -p

# Executar o schema
mysql -u root -p < database/schema.sql

# (Opcional) Inserir dados de exemplo
mysql -u root -p < database/seed.sql
```

### 3. Configurar e Rodar o Back-end

```bash
# Entrar na pasta backend
cd backend

# Instalar dependências
npm install

# Criar arquivo .env baseado em .env.example
cp .env.example .env

# Editar .env com as credenciais do seu MySQL
# nano .env (ou seu editor preferido)

# Rodar em desenvolvimento (com nodemon)
npm run dev

# Ou rodar em produção
npm start
```

O servidor estará disponível em `http://localhost:3000`

### 4. Acessar o Front-end

Abra seu navegador em `http://localhost:3000` e faça login com:
- **Email**: admin@estoque.com
- **Senha**: (configure no banco após criar a senha com hash)

## 📚 Fluxo da Aplicação

A comunicação entre as camadas segue este padrão:

```
Navegador → Rota → Controller → Service → Model → MySQL
     ↓
  Resosta volta pelo mesmo caminho
```

## 🔐 Autenticação

O sistema usa JWT (JSON Web Tokens) para autenticação:

1. Usuário faz login com email e senha
2. Backend valida credenciais e retorna um token
3. Frontend armazena o token no localStorage
4. Token é enviado em todas as requisições subsequentes
5. Middleware valida o token antes de permitir acesso

## 📝 Endpoints da API

### Autenticação
- `POST /api/auth/login` - Login

### Categorias (requer autenticação)
- `GET /api/categories` - Listar todas
- `POST /api/categories` - Criar nova
- `PUT /api/categories/:id` - Atualizar
- `DELETE /api/categories/:id` - Deletar

### Produtos (requer autenticação)
- `GET /api/products` - Listar todos
- `POST /api/products` - Criar novo
- `PUT /api/products/:id` - Atualizar
- `DELETE /api/products/:id` - Deletar

### Movimentações (requer autenticação)
- `GET /api/movements` - Listar todas
- `POST /api/movements` - Criar nova
- `PUT /api/movements/:id` - Atualizar
- `DELETE /api/movements/:id` - Deletar

### Dashboard (requer autenticação)
- `GET /api/dashboard/stats` - Estatísticas

## 🧪 Testes

```bash
cd backend

# Rodar os testes
npm test
```

## 🛠 Tecnologias Utilizadas

**Back-end:**
- Node.js
- Express.js
- MySQL 2
- JWT (jsonwebtoken)
- bcryptjs (hash de senhas)

**Front-end:**
- HTML5
- CSS3
- JavaScript (Vanilla)

**Banco de Dados:**
- MySQL 8+

## 📄 Licença

MIT

## 👨‍💻 Autor

Sistema criado para fins educacionais seguindo a apostila de desenvolvimento full-stack.
