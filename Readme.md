# 🎬 Sonnly – Agenda de Estreias com Lembretes

**Sonnly** é uma aplicação fullstack desenvolvida como parte de um desafio técnico. Seu objetivo é permitir que usuários visualizem filmes que ainda vão estrear e possam marcar lembretes para receber notificações antes da estreia.

---

## 📌 Objetivos Técnicos Atendidos

- 🔐 Autenticação com JWT
- 🎬 Integração com a API do TMDb para lançamentos futuros
- 🧠 Gerenciamento de lembretes vinculados ao usuário
- 📨 Emissão de eventos para lembretes (via mensageria)
- 💾 Persistência com PostgreSQL + Prisma ORM
- 📈 Observabilidade com OpenTelemetry + Jaeger *(em progresso)*
- 🧪 Testes unitários e de carga com Jest e K6
- ☁️ Deploy containerizado com Docker e orquestrado via Makefile

---

## 🚀 Como rodar o projeto

### ✅ Pré-requisitos

- [Docker](https://www.docker.com/) e [Docker Compose](https://docs.docker.com/compose/) instalados
- Banco de dados PostgreSQL configurado (local ou via container)
- Arquivo `.env` com variáveis de ambiente (veja abaixo)

---

### ⚙️ Passos para iniciar

1. **Crie o arquivo `.env`:**

```env
DATABASE_URL=postgresql://user:password@localhost:5432/Soonly_db
JWT_SECRET=your_jwt_secret
TMDB_API_KEY=sua_chave_tmdb


# 🎬 Premind – Agenda de Estreias com Lembretes

**Premind** é uma aplicação fullstack desenvolvida como parte de um desafio técnico. Seu objetivo é permitir que usuários visualizem filmes que ainda vão estrear e possam marcar lembretes para receber notificações antes da estreia.

---

## 📌 Objetivos Técnicos Atendidos

- 🔐 Autenticação com JWT
- 🎬 Integração com a API do TMDb para lançamentos futuros
- 🧠 Gerenciamento de lembretes vinculados ao usuário
- 📨 Emissão de eventos para lembretes (via mensageria)
- 💾 Persistência com PostgreSQL + Prisma ORM
- 📈 Observabilidade com OpenTelemetry + Jaeger *(em progresso)*
- 🧪 Testes unitários e de carga com Jest e K6
- ☁️ Deploy containerizado com Docker e orquestrado via Makefile

---

## 🚀 Como rodar o projeto

### ✅ Pré-requisitos

- [Docker](https://www.docker.com/) e [Docker Compose](https://docs.docker.com/compose/) instalados
- Banco de dados PostgreSQL configurado (local ou via container)
- Arquivo `.env` com variáveis de ambiente (veja abaixo)

---

### ⚙️ Passos para iniciar

1. **Crie o arquivo `.env`:**

```env
DATABASE_URL=postgresql://user:password@localhost:5432/premind
JWT_SECRET=your_jwt_secret
TMDB_API_KEY=sua_chave_tmdb

# Testes unitários
npm run test

# Testes de carga (exemplo com K6)
k6 run tests/load/reminders.test.js
