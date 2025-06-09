import { NotificationType } from "@prisma/client";
import { NotificationRepository } from "./notification.repository";
import { ReminderService } from "../reminders/reminders.service";
import { NotificationData } from "./type/notification.type"

export class NotificationService {
    constructor(
        private notificationRepository: NotificationRepository,
        private reminderService: ReminderService
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
}
