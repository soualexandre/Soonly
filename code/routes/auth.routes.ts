import { FastifyInstance } from 'fastify'

export async function authRoutes(app: FastifyInstance) {
  app.post('/login', async (request, reply) => {
    return { token: 'fake-token' }
  })
}
