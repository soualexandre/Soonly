import { FastifyInstance } from 'fastify'
import { ReminderService } from '../modules/reminders/reminders.service'
import {
  ReminderArray,
  CreateReminderBody,
  UserIdParams,
  IdParams,
  Reminder,
  UserReminderNotificationResponse
} from '../utils/schemas/reminder.schema'
import { RemindersRepository } from '../modules/reminders/reminders.repository'
import { UserRepository } from '../modules/auth/auth.repository'
import { Type } from '@sinclair/typebox'
import { NotificationService } from '../modules/notification/notification.service'
import { NotificationRepository } from '../modules/notification/notification.repository'

const remindersRepository = new RemindersRepository()
const userRepository = new UserRepository()
const notificationRepository = new NotificationRepository();

const remindersService = new ReminderService(remindersRepository, userRepository)
const notificationService = new NotificationService(notificationRepository);

export async function reminderRoutes(app: FastifyInstance) {
  app.get('/', {
    schema: {
      description: 'Lista todos os reminders',
      response: {
        200: ReminderArray
      }
    }
  }, async (request, reply) => {
    const reminders = await remindersService.list()
    if (!reminders) {
      return reply.status(500).send({ error: 'Failed to fetch reminders' })
    }
    return reminders
  })

  app.post('/', {
    schema: {
      description: 'Cria um novo reminder',
      body: CreateReminderBody,
      response: {
        201: Reminder
      }
    }
  }, async (request, reply) => {
    const { movieId, userId, type, sendAt, message } = request.body as any

    const reminder = await remindersService.createQueue({ movieId, userId, type, sendAt, message })

    return reminder;
  })

  app.get('/user/:userId', {
    schema: {
      description: 'Busca reminders de um usuário',
      params: UserIdParams,
      response: {
        200: ReminderArray
      }
    }
  }, async (request, reply) => {
    const { userId } = request.params as any
    if (!userId) {
      return reply.status(400).send({ error: 'User ID is required' })
    }
    const reminders = await remindersService.findByUserId(userId)
    if (!reminders) {
      return reply.status(500).send({ error: 'Failed to fetch reminders for user' })
    }
    return reminders
  })

  app.delete('/:id', {
    schema: {
      description: 'Deleta um reminder pelo ID',
      params: IdParams,
      response: {
        204: { type: 'null' }
      }
    }
  }, async (request, reply) => {
    const { id } = request.params as any
    if (!id) {
      return reply.status(400).send({ error: 'Reminder ID is required' })
    }
    const deleted = await remindersService.deleteById(id)
    if (!deleted) {
      return reply.status(500).send({ error: 'Failed to delete reminder' })
    }
    return reply.status(204).send()
  })

  app.get('/:id', {
    schema: {
      description: 'Busca reminder por ID',
      params: IdParams,
      response: {
        200: Reminder,
        404: {
          type: 'object',
          properties: {
            error: { type: 'string' }
          }
        }
      }
    }
  }, async (request, reply) => {
    const { id } = request.params as any
    if (!id) {
      return reply.status(400).send({ error: 'Reminder ID is required' })
    }
    const reminder = await remindersService.findById(id)
    if (!reminder) {
      return reply.status(404).send({ error: 'Reminder not found' })
    }
    return reminder
  })

  app.get('/user/:userId/reminders-notifications', {
    schema: {
      description: 'Retorna todos os reminders e notificações de um usuário',
      params: UserIdParams,
      response: {
        200: UserReminderNotificationResponse,
        404: Type.Object({
          error: Type.String(),
        }),
      },
    },
  }, async (request, reply) => {
    const { userId } = request.params as { userId: string }

    if (!userId) {
      return reply.status(400).send({ error: 'User ID is required' })
    }

    const userData = await remindersService.getUserRemindersAndNotifications(userId);

    if (!userData) {
      return reply.status(404).send({ error: 'User not found' })
    }

    return {
      reminders: userData.reminders,
    }
  })

  app.delete('/:userId/:movieId', {
    schema: {
      description: 'Deleta reminders e notifications por userId e movieId',
      params: {
        type: 'object',
        properties: {
          userId: { type: 'string' },
          movieId: { type: 'string' }
        },
        required: ['userId', 'movieId']
      },
      response: {
        204: { type: 'null' },
        400: {
          type: 'object',
          properties: {
            error: { type: 'string' }
          }
        },
        500: {
          type: 'object',
          properties: {
            error: { type: 'string' }
          }
        }
      }
    }
  }, async (request, reply) => {
    const { userId, movieId } = request.params as { userId: string; movieId: string }

    if (!userId || !movieId) {
      return reply.status(400).send({ error: 'userId e movieId são obrigatórios' })
    }

    try {
      await notificationService.deleteByUserAndNotification(userId, movieId)

      await remindersService.deleteByUserAndMovie(userId, movieId)

      return reply.status(204).send()
    } catch (error) {
      request.log.error(error)
      return reply.status(500).send({ error: 'Erro ao deletar lembrete e notificações' })
    }
  })


  app.setErrorHandler((error, request, reply) => {
    console.error(error)
    reply.status(500).send({ error: 'Internal Server Error' })
  })
}
