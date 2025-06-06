import { FastifyInstance } from 'fastify'
import { ReminderService } from '../modules/reminders/reminders.service'
const remindersService = new ReminderService()

export async function reminderRoutes(app: FastifyInstance) {
  app.get('/', async (request, reply) => {
    const reminders = await this.remindersService.list()
    if (!reminders) {
      return reply.status(500).send({ error: 'Failed to fetch reminders' })
    }
    return reminders
  })
  app.post('/', async (request, reply) => {
    const { movieId, userId } = request.body as { movieId: string; userId: string }
    if (!movieId || !userId) {
      return reply.status(400).send({ error: 'movieId and userId are required' })
    }
    const reminder = await remindersService.create({ movieId, userId })
    if (!reminder) {
      return reply.status(500).send({ error: 'Failed to create reminder' })
    }
    return reply.status(201).send(reminder)
  })

  app.get('/user/:userId', async (request, reply) => {
    const { userId } = request.params as { userId: string }
    if (!userId) {
      return reply.status(400).send({ error: 'User ID is required' })
    }
    const reminders = await remindersService.findByUserId(userId)
    if (!reminders) {
      return reply.status(500).send({ error: 'Failed to fetch reminders for user' })
    }
    return reminders
  })
  app.delete('/:id', async (request, reply) => {
    const { id } = request.params as { id: string }
    if (!id) {
      return reply.status(400).send({ error: 'Reminder ID is required' })
    }
    const deleted = await remindersService.deleteById(id)
    if (!deleted) {
      return reply.status(500).send({ error: 'Failed to delete reminder' })
    }
    return reply.status(204).send()
  })
  app.get('/:id', async (request, reply) => {
    const { id } = request.params as { id: string }
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
