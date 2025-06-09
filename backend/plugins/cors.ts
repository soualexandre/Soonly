import fp from 'fastify-plugin'
import cors from '@fastify/cors'

export default fp(async (app) => {
  app.register(cors, {
    origin: '*',
    methods: ['GET', 'POST', 'DELETE', 'PUT', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
})
