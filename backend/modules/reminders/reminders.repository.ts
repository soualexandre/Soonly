import { PrismaClient } from '@prisma/client';
import { ReminderData } from './type/reminder.type';

const prisma = new PrismaClient()

export class RemindersRepository {
    async findAll(): Promise<ReminderData[] | null> {
        return prisma.reminder.findMany();
    }

    async getUserRemindersAndNotifications(userId: string) {
        const userData = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                reminders: true,
                notifications: true,
            },
        });

        if (!userData) return null;

        const { reminders, notifications } = userData;

        const notificationsMap = notifications.reduce((map, notification) => {
            if (!map[notification.movieId]) {
                map[notification.movieId] = [];
            }
            map[notification.movieId].push(notification);
            return map;
        }, {} as Record<string, typeof notifications>);

        const mergedReminders = reminders.map(reminder => ({
            ...reminder,
            notifications: notificationsMap[reminder.movieId] || [],
        }));

        return {
            reminders: mergedReminders,
        };
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
