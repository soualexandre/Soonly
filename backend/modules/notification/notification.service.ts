import { NotificationType } from "@prisma/client";
import { NotificationRepository } from "./notification.repository";
import { NotificationData } from "./type/notification.type";

export class NotificationService {
    constructor(
        private notificationRepository: NotificationRepository,
    ) { }

    async createNotification(data: { movieId: string; userId: string, message: string, sentAt: Date, type: NotificationType }): Promise<NotificationData> {
        const notification = await this.notificationRepository.create(data);
        if (!notification) throw new Error('Failed to create notification');
        return notification;
    }

    async findAllNotifications() {
        const notifications = await this.notificationRepository.findAll();
        if (!notifications) throw new Error('Failed to fetch notifications');
        return notifications;
    }

      async deleteByUserAndNotification(userId: string, movieId:string) {
        const notifications = await this.notificationRepository.deleteManyByUserAndMovie(userId, movieId);
        if (!notifications) throw new Error('Failed to fetch notifications');
        return notifications;
    }
}
