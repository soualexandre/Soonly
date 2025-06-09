import { AuthService } from './auth.service'
import { UserRepository } from './auth.repository'
import bcrypt from 'bcrypt'
import { User } from '@prisma/client'

jest.mock('bcrypt')

const mockUser: User = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  passwordHash: 'hashedPassword',
  createdAt: new Date(),
  updatedAt: new Date(),
}

describe('AuthService', () => {
  let userRepoMock: jest.Mocked<UserRepository>
  let authService: AuthService

  const mockName = 'John Doe'
  const mockEmail = 'john@example.com'
  const mockPassword = 'password123'

  beforeEach(() => {
    userRepoMock = {
      findByEmail: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
    } as jest.Mocked<UserRepository>

    authService = new AuthService(userRepoMock)
    jest.clearAllMocks()
  })

  describe('register', () => {
    it('deve registrar um novo usuário com sucesso', async () => {
      userRepoMock.findByEmail.mockResolvedValue(null)
      ;(bcrypt.hash as jest.Mock).mockResolvedValue('hashed123')
      userRepoMock.create.mockResolvedValue({ ...mockUser, passwordHash: 'hashed123' })

      const user = await authService.register(mockName, mockEmail, mockPassword)

      expect(userRepoMock.findByEmail).toHaveBeenCalledWith(mockEmail)
      expect(bcrypt.hash).toHaveBeenCalledWith(mockPassword, 10)
      expect(userRepoMock.create).toHaveBeenCalledWith({
        name: mockName,
        email: mockEmail,
        passwordHash: 'hashed123',
      })
      expect(user.email).toBe(mockEmail)
    })

    it('deve lançar erro se o usuário já existir', async () => {
      userRepoMock.findByEmail.mockResolvedValue(mockUser)

      await expect(authService.register(mockName, mockEmail, mockPassword)).rejects.toThrow(
        'User already exists'
      )
      expect(userRepoMock.create).not.toHaveBeenCalled()
    })
  })

  describe('authenticate', () => {
    it('deve autenticar com sucesso', async () => {
      userRepoMock.findByEmail.mockResolvedValue(mockUser)
      ;(bcrypt.compare as jest.Mock).mockResolvedValue(true)

      const user = await authService.authenticate(mockEmail, mockPassword)

      expect(user).toEqual(mockUser)
    })

    it('deve lançar erro se o usuário não existir', async () => {
      userRepoMock.findByEmail.mockResolvedValue(null)

      await expect(authService.authenticate('notfound@example.com', '123')).rejects.toThrow(
        'Invalid email or password'
      )
    })

    it('deve lançar erro se a senha estiver errada', async () => {
      userRepoMock.findByEmail.mockResolvedValue(mockUser)
      ;(bcrypt.compare as jest.Mock).mockResolvedValue(false)

      await expect(authService.authenticate(mockEmail, 'wrongpassword')).rejects.toThrow(
        'Invalid email or password'
      )
    })
  })
})
