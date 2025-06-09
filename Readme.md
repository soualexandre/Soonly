# 🎬 Sonnly – Agenda de Estreias com Lembretes

**Sonnly** é uma aplicação fullstack moderna, desenvolvida como parte de um desafio técnico. Seu objetivo é permitir que usuários visualizem lançamentos futuros de filmes e agendem lembretes personalizados para não perder nenhuma estreia.

A arquitetura do projeto é modular, com frontend Vue.js, backend Node.js com Fastify, banco PostgreSQL via Prisma, mensageria para envio de lembretes e infraestrutura containerizada com Redis e Docker.

---

## 🌐 Visão Geral

- 🔐 Autenticação com JWT
- 🎬 Integração com TMDb API para lançamentos futuros
- 🧠 Gerenciamento de lembretes por usuário
- 📨 Emissão de eventos para lembretes via mensageria
- 💾 Persistência com PostgreSQL e Prisma ORM
- 📈 Observabilidade com OpenTelemetry + Jaeger *(em progresso)*
- 🧪 Testes unitários e de carga com Jest e K6
- ☁️ Deploy containerizado com Docker e Makefiles modulares

---

🖥️ Frontend – Vue.js
Localizado em /soonly

Funcionalidades e tecnologias:
⚙️ Vue.js 3 + Vite

🎨 Tailwind CSS, Vuetify ou ShadCN-Vue

📦 Gerenciamento de estado com Pinia ou Vuex

🌐 Integração com REST APIs e WebSockets

♻️ Componentes modulares e reutilizáveis

🔐 Autenticação com JWT ou OAuth

🚀 Otimizações com Lazy Loading, Code Splitting e SSR (Nuxt.js)

🌍 Internacionalização (i18n) e suporte a temas dinâmicos

🔧 Backend – Node.js com Fastify
Localizado em /backend

Funcionalidades e tecnologias:
⚙️ API RESTful com Fastify

📄 Endpoints CRUD para usuários e lembretes

🔐 Autenticação via JWT

💾 Banco de dados relacional com PostgreSQL + Prisma

🧾 Logs estruturados com suporte a traceability

📬 Emissão de eventos via mensageria (RabbitMQ, etc.)

📈 Observabilidade com OpenTelemetry + Jaeger (em andamento)

🧪 Testes
✅ Jest para testes unitários

📊 K6 para testes de carga

Rodar testes

# Testes unitários
npm run test

# Testes de carga com K6
k6 run tests/load/reminders.test.js

Rodar testes
# Testes unitários
npm run test

# Testes de carga com K6
k6 run tests/load/reminders.test.js

🐳 Como Rodar o Projeto
✅ Pré-requisitos
Docker

Docker Compose

Node.js (para execução local opcional)

Arquivo .env com variáveis de ambiente

# .env
DATABASE_URL=postgresql://user:password@localhost:5432/soonly
JWT_SECRET=supersecreto
TMDB_API_KEY=sua_chave_tmdb


⚙️ Comandos Makefile
Na raiz do projeto:
make dev         # Sobe Redis e PostgreSQL

No frontend (/soonly):
cd soonly
make install
make dev


No backend (/backend):
cd backend
make install
make dev


🛣️ Roadmap
 Integração com TMDb

 Sistema de lembretes

 Autenticação segura com JWT

 Integração com mensageria (RabbitMQ ou Kafka)

 Finalizar observabilidade com OpenTelemetry e Jaeger

 Notificações via e-mail ou push

 Dashboard de lembretes e lançamentos

 Integração com CI/CD (GitHub Actions)

 📄 Licença
Distribuído sob a licença MIT. Consulte LICENSE para mais informações.