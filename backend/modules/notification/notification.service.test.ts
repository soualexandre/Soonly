import { NotificationService } from './notification.service'
import { NotificationRepository } from './notification.repository'
import { ReminderService } from '../reminders/reminders.service'
import { NotificationType } from '@prisma/client'

jest.mock('./notification.repository')
jest.mock('../reminders/reminders.service')

describe('NotificationService', () => {
  let notificationService: NotificationService
  let notificationRepositoryMock: jest.Mocked<NotificationRepository>
  let reminderServiceMock: jest.Mocked<ReminderService>

  const mockNotification = {
    id: '1',
    movieId: 'movie123',
    userId: 'user123',
    message: 'Your movie is about to start',
    sentAt: new Date(),
    type: NotificationType.REMINDER,
  }

  const mockNotificationList = [mockNotification]

  beforeEach(() => {
  notificationRepositoryMock = {
    create: jest.fn(),
    findAll: jest.fn(),
  } as unknown as jest.Mocked<NotificationRepository>;

  reminderServiceMock = {
    findByUserId: jest.fn(),
    deleteById: jest.fn(),
  } as unknown as jest.Mocked<ReminderService>;

  notificationService = new NotificationService(notificationRepositoryMock, reminderServiceMock);

  jest.clearAllMocks();
});

  describe('createNotification', () => {
    it('deve criar a notificação com sucesso', async () => {
      notificationRepositoryMock.create.mockResolvedValue(mockNotification)

      const result = await notificationService.createNotification({
        movieId: mockNotification.movieId,
        userId: mockNotification.userId,
        message: mockNotification.message,
        sentAt: mockNotification.sentAt,
        type: mockNotification.type,
      })

      expect(notificationRepositoryMock.create).toHaveBeenCalledWith({
        movieId: mockNotification.movieId,
        userId: mockNotification.userId,
        message: mockNotification.message,
        sentAt: mockNotification.sentAt,
        type: mockNotification.type,
      })

      expect(result).toEqual(mockNotification)
    })

    it('deve lançar erro se a criação da notificação falhar', async () => {
      notificationRepositoryMock.create.mockResolvedValue(null)

      await expect(notificationService.createNotification({
        movieId: mockNotification.movieId,
        userId: mockNotification.userId,
        message: mockNotification.message,
        sentAt: mockNotification.sentAt,
        type: mockNotification.type,
      })).rejects.toThrow('Failed to create notification')

      expect(notificationRepositoryMock.create).toHaveBeenCalled()
    })
  })

  describe('findAllNotifications', () => {
    it('deve retornar a lista de notificações com sucesso', async () => {
      notificationRepositoryMock.findAll.mockResolvedValue(mockNotificationList)

      const result = await notificationService.findAllNotifications()

      expect(notificationRepositoryMock.findAll).toHaveBeenCalled()
      expect(result).toEqual(mockNotificationList)
    })

    it('deve lançar erro se a busca de notificações falhar', async () => {
      notificationRepositoryMock.findAll.mockResolvedValue(null)

      await expect(notificationService.findAllNotifications()).rejects.toThrow('Failed to fetch notifications')
      expect(notificationRepositoryMock.findAll).toHaveBeenCalled()
    })
  })
})
