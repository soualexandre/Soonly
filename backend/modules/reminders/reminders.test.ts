import { UserRepository } from 'modules/auth/auth.repository'
import { RemindersRepository } from './reminders.repository'
import { ReminderService } from './reminders.service'

describe('ReminderService - Métodos adicionais', () => {
  let service: ReminderService
  let remindersRepoMock: jest.Mocked<RemindersRepository>

  const reminderMock = {
    id: 'r1',
    userId: 'u1',
    movieId: 'm1',
    createdAt: new Date(),
  }

  beforeEach(() => {
    remindersRepoMock = {
      findByUserId: jest.fn(),
      deleteById: jest.fn(),
      findById: jest.fn(),
      findByMovieIdAndUserId: jest.fn(),
    } as unknown as jest.Mocked<RemindersRepository>
    const userRepoMock = {
      findById: jest.fn(),
    } as unknown as jest.Mocked<UserRepository>
    service = new ReminderService(remindersRepoMock, userRepoMock)
  })

  describe('findByUserId', () => {
    it('should throw if no reminders found', async () => {
      remindersRepoMock.findByUserId.mockResolvedValue(null as any)
      await expect(service.findByUserId('u1')).rejects.toThrow(
        'Failed to fetch reminders for user',
      )
    })
  })

  describe('deleteById', () => {
    it('should delete reminder and return true', async () => {
      remindersRepoMock.deleteById.mockResolvedValue(reminderMock)

      const result = await service.deleteById('r1')

      expect(result).toBe(true)
      expect(remindersRepoMock.deleteById).toHaveBeenCalledWith('r1')
    })

    it('should throw if delete fails', async () => {
      remindersRepoMock.deleteById.mockRejectedValue(new Error('Record not found'))

      await expect(service.deleteById('r1')).rejects.toThrow(
        'Failed to delete reminder',
      )
    })
  })

  describe('findByMovieIdAndUserId', () => {
    it('should throw if reminder does not exist', async () => {
      remindersRepoMock.findByMovieIdAndUserId.mockResolvedValue(null as any)
      await expect(
        service.findByMovieIdAndUserId('m1', 'u1'),
      ).rejects.toThrow('Reminder not found for movie and user')
    })
  })
})
