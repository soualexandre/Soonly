import { NotificationType } from "@prisma/client";
import { NotificationService } from "../modules/notification/notification.service";

export class SqsHandlerService {
  constructor(private readonly notificationService: NotificationService) { }

  async handleMessage(body: any): Promise<void> {
    try {
      const data = typeof body === 'string' ? JSON.parse(body) : body;

      switch (data.type) {
        case 'REMINDER_CREATED':
          const createNotification = await this.notificationService.createNotification({
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

