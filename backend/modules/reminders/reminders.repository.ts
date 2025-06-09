import { PrismaClient } from '@prisma/client';
import { ReminderData } from './type/reminder.type';

const prisma = new PrismaClient()

export class RemindersRepository {
    async findAll(): Promise<ReminderData[] | null> {
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
    async deleteById(id: string): Promise<ReminderData> {
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
