import { NotificationType } from "@prisma/client";
import { NotificationRepository } from "./notification.repository";

const notificationRepository = new NotificationRepository();

export class NotificationService {
    async createNotification(data: { movieId: string; userId: string, message: string, sentAt: Date, type: NotificationType }) {
        const notification = await notificationRepository.create(data);
        if (!notification) {
            throw new Error('Failed to create notification');
        }
        return notification;
    }
}