import fp from 'fastify-plugin'
import jwt from '@fastify/jwt'

export default fp(async (app) => {
  app.register(jwt, {
    secret: process.env.JWT_SECRET || 'supersecret',
    sign: {
      expiresIn: '24h' 
    }
  })

  app.decorate(
    'authenticate',
    async (request: any, reply: any) => {
      try {
        await request.jwtVerify()
      } catch (err) {
        reply.code(401).send({ error: 'Unauthorized' })
      }
    }
  )
})

