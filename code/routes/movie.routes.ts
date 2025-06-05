import { FastifyInstance } from 'fastify'

export async function movieRoutes(app: FastifyInstance) {
  app.get('/list', async (request, reply) => {
    return { token: 'fake-token' }
  })
}
