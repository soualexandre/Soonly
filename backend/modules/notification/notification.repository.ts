import { NotificationType, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient()

export class NotificationRepository {
    async findAll() {
        return prisma.notification.findMany();
    }

    async create(data: { movieId: string; userId: string, message: string, sentAt: Date, type: NotificationType }) {
     
        return await prisma.notification.create({
            data: {
                movieId: data.movieId,
                userId: data.userId,
                message: data.message,
                sentAt: data.sentAt,
                type: data.type,
            }
        })
    }
    async findByUserId(userId: string) {
        return prisma.notification.findMany({
            where: {
                userId: userId,
            }
        });
    }
    async deleteById(id: string) {
        return prisma.notification.delete({
            where: {
                id: id,
            }
        });
    }
    async findById(id: string) {
        return prisma.notification.findUnique({
            where: {
                id: id,
            }
        });
    }
}
