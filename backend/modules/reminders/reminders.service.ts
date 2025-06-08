import { NotificationType } from '@prisma/client'
import { sqsClient } from '../../config/sqs.config'
import { SQSPublisher } from '../../external/sqs.publisher.external'
import { UserRepository } from '../auth/auth.repository'
import { RemindersRepository } from './reminders.repository'
export class ReminderService {
    private userRepository = new UserRepository()
    private remindersRepository = new RemindersRepository()

    async list() {
        const list = await this.remindersRepository.findAll()
        if (!list) throw new Error('Failed to fetch movie list')
        return list
    }

    async create(data: { movieId: string; userId: string, type: NotificationType, sendAt?: Date, message?: string }) {
        const isUserExists = await this.userRepository.findById(data.userId)
        if (!isUserExists) {
            throw new Error('User does not exist')
        }
        const isReminderExists = await this.remindersRepository.findByMovieIdAndUserId(data.movieId, data.userId)
        if (isReminderExists) {
            throw new Error('Reminder already exists for this movie and user')
        }
        const publisher = new SQSPublisher(sqsClient);
        await publisher.send(process.env.SQS_QUEUE_URL!, {
            type: "REMINDER_CREATED",
            payload: {
                userId: data.userId,
                movieId: data.movieId,
                sendAt: new Date().toISOString(),
                message: data.message,
                type: data.type as NotificationType
            },
        });

        const created = await this.remindersRepository.create({movieId: data.movieId, userId: data.userId})
        if (!created) throw new Error('Failed to create movie reminder')
        return true
    }
    async findByUserId(userId: string) {
        if (!userId) {
            throw new Error('User ID is required')
        }
        const reminders = await this.remindersRepository.findByUserId(userId)
        if (!reminders) throw new Error('Failed to fetch reminders for user')
        return reminders
    }
    async deleteById(id: string) {
        if (!id) {
            throw new Error('Reminder ID is required')
        }
        const deleted = await this.remindersRepository.deleteById(id)
        if (!deleted) throw new Error('Failed to delete reminder')
        return deleted
    }
    async findById(id: string) {
        if (!id) {
            throw new Error('Reminder ID is required')
        }
        const reminder = await this.remindersRepository.findById(id)
        if (!reminder) throw new Error('Reminder not found')
        return reminder
    }

    async findByMovieIdAndUserId(movieId: string, userId: string) {
        if (!movieId || !userId) {
            throw new Error('Movie ID and User ID are required')
        }
        const reminder = await this.remindersRepository.findByMovieIdAndUserId(movieId, userId)
        if (!reminder) throw new Error('Reminder not found for movie and user')
        return reminder
    }

}
