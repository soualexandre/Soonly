import Fastify from 'fastify'

import cors from './plugins/cors'
import jwt from './plugins/jwt'
import prisma from './plugins/prisma'

import { authRoutes } from './routes/auth.routes'
import { movieRoutes } from './routes/movie.routes'
import { reminderRoutes } from './routes/reminder.routes'

export const buildApp = () => {
  const app = Fastify({ logger: true })

  app.register(cors)
  app.register(jwt)
  app.register(prisma)

  app.register(authRoutes, { prefix: '/auth' })
  app.register(movieRoutes, { prefix: '/movies' })
  app.register(reminderRoutes, { prefix: '/reminders' })

  return app
}
