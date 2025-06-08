import { FastifyInstance } from 'fastify'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'

export async function swagger(app: FastifyInstance) {
  await app.register(fastifySwagger, {
    openapi: {
      info: {
        title: 'API de Estreias de Filmes',
        description: 'Documentação da API de Estreias de Filmes com Fastify + Swagger',
        version: '1.0.0',
      },
      servers: [
        {
          url: 'http://localhost:3053',
        },
      ],
    }
  })

  await app.register(fastifySwaggerUi, {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'full',
      deepLinking: false,
    },
  })

 
}