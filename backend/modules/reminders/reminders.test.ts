import { ReminderService } from './reminders.service'
import { NotificationType } from '@prisma/client'
import { UserRepository } from '../auth/auth.repository'
import { RemindersRepository } from './reminders.repository'
import { SQSPublisher } from '../../external/sqs.publisher.external'

jest.mock('../auth/auth.repository')
jest.mock('./reminders.repository')
jest.mock('../../external/sqs.publisher.external')

describe('ReminderService', () => {
    let service: ReminderService
    let userRepo: jest.Mocked<UserRepository>
    let remindersRepo: jest.Mocked<RemindersRepository>

    const mockReminder = {
        id: '1',
        movieId: 'movie1',
        userId: 'user1',
        type: 'REMINDER',
        sendAt: new Date(),
        message: 'Reminder message',
        createdAt: new Date(), // ✅ correto
    };
    beforeEach(() => {
        service = new ReminderService()
        userRepo = (UserRepository as jest.MockedClass<typeof UserRepository>).mock.instances[0] as unknown as jest.Mocked<UserRepository>
        remindersRepo = (RemindersRepository as jest.MockedClass<typeof RemindersRepository>).mock.instances[0] as unknown as jest.Mocked<RemindersRepository>
        jest.clearAllMocks()
    })

    describe('list', () => {
        it('should return reminder list', async () => {
            remindersRepo.findAll.mockResolvedValue([mockReminder])
            const result = await service.list()
            expect(result).toEqual([mockReminder])
        })

        it('should throw if no list is returned', async () => {
            remindersRepo.findAll.mockResolvedValue([])
            await expect(service.list()).rejects.toThrow('Failed to fetch movie list')
        })
    })

    describe('create', () => {
        const input = { ...mockReminder }

        it('should create a new reminder', async () => {
            userRepo.findById.mockResolvedValue({ id: 'user123' } as any)
            remindersRepo.findByMovieIdAndUserId.mockResolvedValue(null)
            remindersRepo.create.mockResolvedValue(mockReminder)

            const result = await service.create(input)
            expect(result).toEqual({ success: true })
        })

        it('should fail if user does not exist', async () => {
            userRepo.findById.mockResolvedValue(null)
            await expect(service.create(input)).rejects.toThrow('User does not exist')
        })

        it('should fail if reminder already exists', async () => {
            userRepo.findById.mockResolvedValue({ id: 'user123' } as any)
            remindersRepo.findByMovieIdAndUserId.mockResolvedValue(mockReminder)
            await expect(service.create(input)).rejects.toThrow('Reminder already exists for this movie and user')
        })

        it('should return false if creation fails', async () => {
            userRepo.findById.mockResolvedValue({ id: 'user123' } as any)
            remindersRepo.findByMovieIdAndUserId.mockResolvedValue(null)
            remindersRepo.create.mockResolvedValue(null)

            const result = await service.create(input)
            expect(result).toEqual({ success: false })
        })
    })

    describe('createQueue', () => {
        it('should enqueue a reminder creation', async () => {
            userRepo.findById.mockResolvedValue({ id: 'user123' } as any)
            remindersRepo.findByMovieIdAndUserId.mockResolvedValue(null)
            const sendMock = jest.fn()
                ; (SQSPublisher as jest.Mock).mockImplementation(() => ({ send: sendMock }))

            process.env.SQS_QUEUE_URL = 'https://fake-sqs-url.com'

            const result = await service.createQueue(mockReminder)
            expect(sendMock).toHaveBeenCalled()
            expect(result).toEqual({ success: true })
        })
    })

    describe('findByUserId', () => {
        it('should return reminders by user ID', async () => {
            remindersRepo.findByUserId.mockResolvedValue([mockReminder])
            const result = await service.findByUserId('user123')
            expect(result).toEqual([mockReminder])
        })

        it('should throw if userId is not provided', async () => {
            await expect(service.findByUserId('')).rejects.toThrow('User ID is required')
        })

        it('should throw if no reminders found', async () => {
            remindersRepo.findByUserId.mockResolvedValue([])
            await expect(service.findByUserId('user123')).rejects.toThrow('Failed to fetch reminders for user')
        })
    })

    describe('deleteById', () => {
        it('should delete reminder', async () => {
            remindersRepo.deleteById.mockResolvedValue()
            const result = await service.deleteById('1')
            expect(result).toBe(true)
        })

        it('should throw if no id provided', async () => {
            await expect(service.deleteById('')).rejects.toThrow('Reminder ID is required')
        })

        it('should throw if delete fails', async () => {
            remindersRepo.deleteById.mockResolvedValue(false)
            await expect(service.deleteById('1')).rejects.toThrow('Failed to delete reminder')
        })
    })

    describe('findById', () => {
        it('should return reminder by ID', async () => {
            remindersRepo.findById.mockResolvedValue(mockReminder)
            const result = await service.findById('1')
            expect(result).toEqual(mockReminder)
        })

        it('should throw if ID is not provided', async () => {
            await expect(service.findById('')).rejects.toThrow('Reminder ID is required')
        })

        it('should throw if not found', async () => {
            remindersRepo.findById.mockResolvedValue(null)
            await expect(service.findById('1')).rejects.toThrow('Reminder not found')
        })
    })

    describe('findByMovieIdAndUserId', () => {
        it('should return reminder by movieId and userId', async () => {
            remindersRepo.findByMovieIdAndUserId.mockResolvedValue(mockReminder)
            const result = await service.findByMovieIdAndUserId('movie123', 'user123')
            expect(result).toEqual(mockReminder)
        })

        it('should throw if movieId or userId is missing', async () => {
            await expect(service.findByMovieIdAndUserId('', 'user123')).rejects.toThrow('Movie ID and User ID are required')
        })

        it('should throw if reminder not found', async () => {
            remindersRepo.findByMovieIdAndUserId.mockResolvedValue(null)
            await expect(service.findByMovieIdAndUserId('movie123', 'user123')).rejects.toThrow('Reminder not found for movie and user')
        })
    })
})