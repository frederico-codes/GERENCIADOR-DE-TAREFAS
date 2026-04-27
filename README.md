# Gerenciador de Tarefas API

API REST desenvolvida com :
- Node.js
- TypeScript
- Express
- Prisma ORM
- PostgreSQL
- Zod (validação)
- JWT (autenticação)
- bcrypt (hash de senha)
- Jest (testes)
- ESLint
- Prettier
- Docker


---

## 📌 Descrição

Esta API permite:

- Cadastro e autenticação de usuários
- Criação e gerenciamento de times
- Associação de usuários a times
- Criação e gerenciamento de tarefas
- Controle de status e prioridade das tarefas
- Histórico de alterações das tarefas

A aplicação segue boas práticas de arquitetura, validação de dados e controle de acesso com JWT.

---


## Como rodar o projeto localmente


### 1. Clone o repositório

```bash
git clone git@github.com:frederico-codes/GERENCIADOR-DE-TAREFAS.git
cd GERENCIADOR-DE-TAREFAS

```

### 2. Instale as dependências

```bash
npm install

```

### 3. Configure as variáveis de ambiente

```bash
DATABASE_URL="postgresql://user:password@localhost:5432/database"
JWT_SECRET="sua_chave_secreta"
PORT=3000

```
### 4. Execute as migrations do banco

```bash
npx prisma migrate dev

```
### 5. Inicie o servidor

```bash
npm run dev

```

### 6. Acesse a aplicação

```bash
http://localhost:3000

```
### 7. Rodando com Docker

```
docker-compose up -d
```

---

## 🌐 Deploy

A API está disponível em produção:

🔗 https://gerenciador-de-tarefas-2-bs7u.onrender.com

---

## 🧪 Testando a API em produção

Você pode testar os endpoints utilizando ferramentas como:

- Insomnia
- Postman

## 📬 Coleção Insomnia

Arquivo disponível em:

/insomnia/Insomnia_2026-04-27

Importe no Insomnia para testar a API.

---

## 📡 Documentação dos Endpoints


### 👤 Users

#### Criar usuário
```
POST /users

{
  "name": "Nome do usuário",
  "email": "user@example.com",
  "password": "123456"
}
```

### 🔐 Sessions

#### Criar sessão

```http
POST /sessions

{
  "email": "admin@test.com",
  "password": "123456"
}
```

### 👥 Teams
```
POST /teams
GET /teams
PUT /teams/:id
DELETE /teams/:id

{
  "name": "Nome do time",
  "description": "Descrição do time"
}

```
### 🔗 Team Members

```
POST /team-members
GET /team-members
DELETE /team-members/:id

{
  "teamId": "uuid-do-time",
  "userId": "uuid-do-usuario"
}
```
### 📋 Tasks

```
POST /tasks
GET /tasks
PUT /tasks/:id
PATCH /tasks/:id/status
PATCH /tasks/:id/priority
DELETE /tasks/:id

{
  "title": "Título da tarefa",
  "description": "Descrição da tarefa",
  "status": "pending",
  "priority": "medium",
  "assignedTo": "uuid-do-usuario",
  "teamId": "uuid-do-time"
}

```

```
{
  "status": "in_progress"
}
```
```
{
  "priority": "high"
}
```

```
POST /task-histories
GET /task-histories
GET /task-histories/:id
```

🔐 Autenticação nas rotas protegidas

Para acessar rotas protegidas, envie o token JWT no header:
```
Authorization: Bearer <token>
```

---

## 🧪 Como rodar os testes

Este projeto utiliza **Jest** e **Supertest** para testar os endpoints da API.

### Rodar os testes em modo desenvolvimento (watch)

```bash
npm run test:dev
```

## 👨‍💻 Autor

Desenvolvido por Frederico Nakajima 🚀