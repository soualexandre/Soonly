import { PrismaClient, User } from '@prisma/client'

const prisma = new PrismaClient()

export class UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email } })
  }

  async create(userData: { name: string; email: string; passwordHash: string }): Promise<User> {
    return prisma.user.create({ data: userData })
  }
}
