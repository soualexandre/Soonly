import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient()

export class RemindersRepository {
    async findAll() {
        return prisma.reminder.findMany();
    }

    async create(data: { movieId: string; userId: string }) {
        return prisma.reminder.create({
            data: {
                movieId: data.movieId,
                userId: data.userId,
            }
        })
    }
    async findByUserId(userId: string) {
        return prisma.reminder.findMany({
            where: {
                userId: userId,
            }
        });
    }
    async deleteById(id: string) {
        return prisma.reminder.delete({
            where: {
                id: id,
            }
        });
    }
    async findById(id: string) {
        return prisma.reminder.findUnique({
            where: {
                id: id,
            }
        });
    }
    async findByMovieIdAndUserId(movieId: string, userId: string) {
        return prisma.reminder.findFirst({
            where: {
                movieId: movieId,
                userId: userId,
            }
        });
    }
}
