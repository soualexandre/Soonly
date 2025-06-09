import { NotificationType } from "@prisma/client";
import { NotificationRepository } from "./notification.repository";
import { ReminderService } from "../reminders/reminders.service";

const notificationRepository = new NotificationRepository();
const reminderService = new ReminderService();

export class NotificationService {
    async createNotification(data: { movieId: string; userId: string, message: string, sentAt: Date, type: NotificationType }) {
        try {

            const notification = await notificationRepository.create(data);

            if (!notification) {
                throw new Error('Failed to create notification');
            }

            return notification;
        } catch (error) {
            console.error('Error creating notification:', error);
            throw error;
        }
    }
    async findAllNotifications() {
        const notifications = await notificationRepository.findAll();
        if (!notifications) {
            throw new Error('Failed to fetch notifications');
        }
        return notifications;
    }

}