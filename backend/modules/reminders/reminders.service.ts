import { NotificationType } from '@prisma/client'
import { sqsClient } from '../../config/sqs.config'
import { SQSPublisher } from '../../external/sqs.publisher.external'
import { UserRepository } from '../auth/auth.repository'
import { RemindersRepository } from './reminders.repository'

export class ReminderService {
    constructor(
        private readonly remindersRepository: RemindersRepository,
        private readonly userRepository: UserRepository
    ) { }

    async list() {
        const list = await this.remindersRepository.findAll()
        if (!list) throw new Error('Failed to fetch movie list')
        return list
    }

    async create(data: { movieId: string; userId: string; type: NotificationType; sendAt?: Date; message?: string }) {
        const isUserExists = await this.userRepository.findById(data.userId)
        if (!isUserExists) {
            throw new Error('User does not exist')
        }

        const isReminderExists = await this.remindersRepository.findByMovieIdAndUserId(data.movieId, data.userId)
        if (isReminderExists) {
            throw new Error('Reminder already exists for this movie and user')
        }

        const reminder = await this.remindersRepository.create(data)
        if (!reminder) {
            return { success: false }
        }

        return { success: true }
    }

    async createQueue(data: { movieId: string; userId: string; type: NotificationType; sendAt?: Date; message?: string }) {
        const isUserExists = await this.userRepository.findById(data.userId)
        if (!isUserExists) {
            throw new Error('User does not exist')
        }

        const isReminderExists = await this.remindersRepository.findByMovieIdAndUserId(data.movieId, data.userId)
        if (isReminderExists) {
            throw new Error('Reminder already exists for this movie and user')
        }

        const publisher = new SQSPublisher(sqsClient)
        await publisher.send(process.env.SQS_QUEUE_URL!, {
            type: 'REMINDER_CREATED',
            payload: {
                userId: data.userId,
                movieId: data.movieId,
                sendAt: data.sendAt ? data.sendAt.toISOString() : new Date().toISOString(),
                message: data.message,
                type: data.type,
            },
        })

        return isUserExists;
    }

    async findByUserId(userId: string) {
        if (!userId) {
            throw new Error('User ID is required')
        }
        const reminders = await this.remindersRepository.findByUserId(userId)
        if (!reminders) throw new Error('Failed to fetch reminders for user')
        return reminders
    }

    async deleteById(id: string): Promise<boolean> {
        try {
            const deleted = await this.remindersRepository.deleteById(id)
            return !!deleted
        } catch (error) {
            throw new Error('Failed to delete reminder')
        }
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

    async getUserRemindersAndNotifications(userId: string) {
        if (!userId) {
            throw new Error('Movie ID and User ID are required')
        }

        const reminder = await this.remindersRepository.getUserRemindersAndNotifications(userId);
        if (!reminder) throw new Error('Reminder not found for movie and user')

        return reminder;
    }
}
