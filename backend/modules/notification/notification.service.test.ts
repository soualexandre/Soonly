import { NotificationService } from './notification.service'
import { NotificationRepository } from './notification.repository'
import { NotificationType } from '@prisma/client'

jest.mock('./notification.repository')
jest.mock('../reminders/reminders.service')

describe('NotificationService', () => {
  let notificationService: NotificationService
  let notificationRepoMock: jest.Mocked<NotificationRepository>

  const mockNotification = {
    id: 'notif1',
    movieId: 'movie123',
    userId: 'user456',
    message: 'Test message',
    sentAt: new Date(),
    type: NotificationType.INFO,
  }

  beforeEach(() => {
    notificationRepoMock = new NotificationRepository() as jest.Mocked<NotificationRepository>

    notificationService = new NotificationService()

    // Substituir o repositório real pelo mock
    // @ts-ignore
    notificationService.notificationRepository = notificationRepoMock

    jest.clearAllMocks()
  })

  describe('createNotification', () => {
    const data = {
      movieId: 'movie123',
      userId: 'user456',
      message: 'Test message',
      sentAt: new Date(),
      type: NotificationType.REMINDER,
    }

    it('deve criar uma notificação com sucesso', async () => {
      notificationRepoMock.create.mockResolvedValue(mockNotification)

      const result = await notificationService.createNotification(data)

      expect(notificationRepoMock.create).toHaveBeenCalledWith(data)
      expect(result).toEqual(mockNotification)
    })

    it('deve lançar erro se falhar ao criar a notificação', async () => {
      notificationRepoMock.create.mockResolvedValue({})

      await expect(notificationService.createNotification(data)).rejects.toThrow('Failed to create notification')
      expect(notificationRepoMock.create).toHaveBeenCalledWith(data)
    })

    it('deve lançar erro se o repositório lançar erro', async () => {
      notificationRepoMock.create.mockRejectedValue(new Error('DB error'))

      await expect(notificationService.createNotification(data)).rejects.toThrow('DB error')
      expect(notificationRepoMock.create).toHaveBeenCalledWith(data)
    })
  })

  describe('findAllNotifications', () => {
    it('deve retornar todas as notificações com sucesso', async () => {
      notificationRepoMock.findAll.mockResolvedValue([mockNotification])

      const result = await notificationService.findAllNotifications()

      expect(notificationRepoMock.findAll).toHaveBeenCalled()
      expect(result).toEqual([mockNotification])
    })

    it('deve lançar erro se o repositório lançar erro', async () => {
      notificationRepoMock.findAll.mockRejectedValue(new Error('DB failure'))

      await expect(notificationService.findAllNotifications()).rejects.toThrow('DB failure')
      expect(notificationRepoMock.findAll).toHaveBeenCalled()
    })
  })
})
