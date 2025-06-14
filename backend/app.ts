// src/app.ts
import fastifyMultipart from '@fastify/multipart'
import Fastify from 'fastify'
import fastifySocketIO from "fastify-socket.io"
import { NotificationJob } from './modules/notification/job/notifications.job'
import cors from './plugins/cors'
import jwt from './plugins/jwt'
import prisma from './plugins/prisma'
import { redisPlugin } from './plugins/redis.plugin'
import sqsPlugin from './plugins/sqs.plugin'
import { swagger } from './plugins/swagger'
import { authRoutes } from './routes/auth.routes'
import { movieRoutes } from './routes/movie.routes'
import { reminderRoutes } from './routes/reminder.routes'
import { websocketRoutes } from './routes/websocket.routes'

export const buildApp = async () => {
  const app = Fastify({
    logger: process.env.NODE_ENV !== 'test',
    connectionTimeout: 60000,
    requestTimeout: 30000
  });

  app.register(fastifySocketIO, {
    cors: {
      origin: "*",
      methods: ['GET', 'POST', 'DELETE', 'PUT', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    }
  });

  await app.register(redisPlugin);
  await app.register(sqsPlugin);
  app.register(cors);
  app.register(jwt);
  app.register(prisma);
  app.register(swagger);

  app.register(fastifyMultipart, {
    limits: {
      fileSize: 10 * 1024 * 1024
    }
  });
  app.io.on('connection', (socket) => {
    console.log('Cliente conectado:', socket.id)
  })

  app.register(authRoutes, { prefix: '/auth' });
  app.register(movieRoutes, { prefix: '/movies' });
  app.register(reminderRoutes, { prefix: '/reminders' });
  app.register(websocketRoutes);

  await app.ready();
  new NotificationJob(app);
  console.log("Job de notificações iniciado");


  return app;
};
