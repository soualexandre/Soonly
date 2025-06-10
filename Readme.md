# 🎬 Sonnly – Agenda de Estreias com 

🌟 Visão Geral
O Sonnly é uma aplicação fullstack moderna que permite aos usuários visualizar lançamentos futuros de filmes e agendar lembretes personalizados. Desenvolvido como desafio técnico, integra diversas tecnologias em uma arquitetura modular e escalável.

graph TD
    A[Frontend Vue.js] --> B[Backend Fastify]
    B --> C[Banco de Dados PostgreSQL]
    B --> D[API TMDb]
    B --> E[Sistema de Mensageria]
    E --> F[Serviço de Lembretes]
    C --> B
    D --> B

🚀 Tecnologias e Suas Funções

🖥️ Frontend (Vue.js)
    Tecnologia	Função	Localização
    Vue.js 3 + Vite	Framework principal para UI reativa	/soonly
    Tailwind CSS/Vuetify	Estilização e componentes UI	/soonly
    Pinia/Vuex	Gerenciamento de estado global	/soonly/stores
    Vue Router	Navegação entre páginas	/soonly/router
    Vue i18n	Internacionalização	/soonly/locales
    WebSockets	Comunicação em tempo real	Integrado nos componentes

⚙️ Backend (Node.js/Fastify)
    Tecnologia	Função	Localização
    Fastify	Framework para API RESTful	/backend
    Prisma ORM	Interface com PostgreSQL	/backend/prisma
    JWT	Autenticação de usuários	/backend/auth
    Redis	Cache e gerenciamento de sessões	Integrado
    RabbitMQ/SQS	Sistema de mensageria para lembretes	/backend/queues
    OpenTelemetry+Jaeger	Observabilidade e tracing	/backend/observability

🗄️ Infraestrutura
    Tecnologia	Função
    Docker	Containerização de serviços
    PostgreSQL	Armazenamento persistente de dados
    Redis	Cache e filas de mensagens
    Makefile	Automação de comandos

🧩 Funcionalidades Principais

journey
    title Fluxo do Usuário Sonnly
    section Autenticação
      Login/Cadastro: 5: Usuário
    section Explorar
      Buscar Filmes: 8: Usuário
      Ver Detalhes: 7: Usuário
    section Lembretes
      Criar Lembrete: 6: Usuário
      Receber Notificação: 4: Sistema
    section Perfil
      Gerenciar Preferências: 3: Usuário

    🎥 Catálogo de Filmes

    Integração em tempo real com TMDb API

    ⏰ Sistema de Lembretes

        Agendamento personalizado por usuário

        Notificações via WebSocket

        Gerenciamento de lembretes ativos

    🔐 Autenticação Segura

        Cadastro e login com JWT

        Proteção de rotas sensíveis

        Gerenciamento de sessões

    📊 Observabilidade

        Tracing de requisições com OpenTelemetry

        Monitoramento de desempenho com Jaeger

        Logs estruturados para debug

⚙️ Pré-requisitos
    Docker 20.10+

    Docker Compose 2.5+

    Node.js 18.x (opcional para desenvolvimento)

    Conta no TMDb (para API key)

# Chaves de API
    ACCESS_TOKEN_TMDB=seu_token_de_acesso
    API_KEY_TMDB=sua_chave_api_tmdb

    # Configurações Redis
    REDIS_HOST=redis
    REDIS_PORT=6379
    REDIS_PASSWORD=

    # Configurações AWS SQS (opcional)
    SQS_QUEUE_URL=
    SQS_REGION=us-east-1
    SQS_ACCESS_KEY_ID=
    SQS_SECRET_ACCESS_KEY=

    # Configurações da Aplicação
    PORT=3000
    JWT_SECRET=super_secreto_altere_isto
    JWT_EXPIRATION=24h

    # Banco de Dados
    DATABASE_URL="postgresql://user:password@postgres:5432/soonly?schema=public"

🚀 Instalação com Docker
    # Clone o repositório

    #Instalação Frontend
        git clone https://github.com/seu-usuario/soonly.git
        cd soonly
        # Construa e inicie os containers
        make dev

    #Instalação Frontend
        git clone https://github.com/seu-usuario/soonly.git
        cd soonly
        # Construa e inicie os containers
        make dev