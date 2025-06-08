import Fastify from 'fastify'
import cors from './plugins/cors'
import jwt from './plugins/jwt'
import prisma from './plugins/prisma'

import fastifyMultipart from '@fastify/multipart'
import { redisPlugin } from './plugins/redis.plugin'
import sqsPlugin from './plugins/sqs.plugin'
import { swagger } from './plugins/swagger'
import { authRoutes } from './routes/auth.routes'
import { movieRoutes } from './routes/movie.routes'
import { reminderRoutes } from './routes/reminder.routes'

export const buildApp = async () => {
  const app = Fastify({ logger: true })
  await app.register(redisPlugin)
  await app.register(sqsPlugin);

  app.register(cors)
  app.register(jwt)
  app.register(prisma)
  app.register(swagger)
  app.register(fastifyMultipart)

  app.register(authRoutes, { prefix: '/auth' })
  app.register(movieRoutes, { prefix: '/movies' })
  app.register(reminderRoutes, { prefix: '/reminders' })
  
  return app
}
