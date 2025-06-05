import fp from 'fastify-plugin'
import jwt from '@fastify/jwt'

export default fp(async (app) => {
  app.register(jwt, {
    secret: process.env.JWT_SECRET || 'super-secret',
  })

  app.decorate(
    'authenticate',
    async (request: any, reply: any) => {
      try {
        await request.jwtVerify()
      } catch (err) {
        reply.send(err)
      }
    }
  )
})
