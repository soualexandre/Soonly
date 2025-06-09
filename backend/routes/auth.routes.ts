import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { AuthService } from '../modules/auth/auth.service'

const authService = new AuthService()

interface RegisterBody {
  name: string
  email: string
  password: string
}

interface LoginBody {
  email: string
  password: string
}

export async function authRoutes(app: FastifyInstance) {
  app.post(
    '/register',
    async (
      request: FastifyRequest<{ Body: RegisterBody }>,
      reply: FastifyReply
    ) => {
      const { name, email, password } = request.body
      try {
        const user = await authService.register(name, email, password)
        return reply.code(201).send({ id: user.id, email: user.email, name: user.name })
      } catch (error: any) {
        return reply.code(409).send({ error: error.message })
      }
    }
  )

  app.post(
    '/login',
    async (
      request: FastifyRequest<{ Body: LoginBody }>,
      reply: FastifyReply
    ) => {
      const { email, password } = request.body
      try {
        const user = await authService.authenticate(email, password)
        const token = await reply.jwtSign({ userId: user.id })
        return reply.send({ userId: user.id, username: user.name, email: user.email, token: token })
      } catch (error: any) {
        return reply.code(401).send({ error: error.message })
      }
    }
  )

   app.get('/me', { preValidation: [app.authenticate] }, async (request, reply) => {
    return reply.send({ user: request.user })
  })
}
