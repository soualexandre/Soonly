import { FastifyInstance } from 'fastify'

export async function reminderRoutes(app: FastifyInstance) {
  app.get('/reminder', async (request, reply) => {
    return { token: 'fake-token' }
  })
}
