import { FastifyInstance } from 'fastify';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';

export async function swagger(app: FastifyInstance) {
  await app.register(fastifySwagger, {
    swagger: {
      info: {
        title: 'API de Estréias de Filmes',
        description: 'Documentação da API de Estréia de Filmes com Fastify + Swagger',
        version: '1.0.0',
      },
      host: 'localhost:3053',
      schemes: ['http'],
      consumes: ['application/json'],
      produces: ['application/json'],
    },
  });

  await app.register(fastifySwaggerUi, {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: false,
    },
  });
}
