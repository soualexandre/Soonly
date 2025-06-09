import { NotificationType, Reminder } from "@prisma/client";
import { NotificationService } from "../modules/notification/notification.service";
import { ReminderService } from "../modules/reminders/reminders.service";
import { RemindersRepository } from "../modules/reminders/reminders.repository";
import { UserRepository } from "../modules/auth/auth.repository";
import { NotificationRepository } from "../modules/notification/notification.repository";
const remindersRepository = new RemindersRepository()
const userRepository = new UserRepository()
const notificationRepository = new NotificationRepository()

const reminderService = new ReminderService(remindersRepository, userRepository)

const notificationService = new NotificationService(notificationRepository, reminderService)


export class SqsHandlerService {

  async handleMessage(body: any): Promise<void> {
    try {
      const data = typeof body === 'string' ? JSON.parse(body) : body;
      console.log("data source",)
      switch (data.type) {
        case 'REMINDER_CREATED':
          const reminder = await reminderService.create(data.payload);
          if (reminder) {
            const createNotification = await notificationService.createNotification({
              movieId: data.payload.movieId,
              userId: data.payload.userId,
              message: data.payload.message || 'Você tem um lembrete!',
              sentAt: new Date(),
              type: Object.values(NotificationType).includes(data.payload.type)
                ? data.payload.type
                : NotificationType.REMINDER
            });
            if (!createNotification) {
              console.error('❌ Falha ao criar notificação para o lembrete:', data.payload.movieId);
            } else {
              console.log('✅ Notificação criada com sucesso para o lembrete:', data.payload.movieId);
            }
          }

          break;
        default:
          console.warn('⚠️ Tipo de mensagem desconhecido:', data.type);
          break;
      }
    } catch (error) {
      console.error('❌ Erro ao processar mensagem SQS:', error);
    }
  }
}

reminderService