import { FastifyInstance } from 'fastify'
import { ReminderService } from '../modules/reminders/reminders.service'
import {
  ReminderArray,
  CreateReminderBody,
  UserIdParams,
  IdParams,
  Reminder
} from '../utils/schemas/reminder.schema'

const remindersService = new ReminderService()

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
    if (!reminder) {
      return reply.status(500).send({ error: 'Failed to create reminder' })
    }
    return reply.status(201).send(reminder)
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

  app.setErrorHandler((error, request, reply) => {
    console.error(error)
    reply.status(500).send({ error: 'Internal Server Error' })
  })
}
