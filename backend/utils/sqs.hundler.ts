import { NotificationType } from "@prisma/client";
import { NotificationService } from "../modules/notification/notification.service";

export class SqsHandlerService {
  constructor(private readonly notificationService: NotificationService) { }

  async handleMessage(body: any): Promise<void> {
    console.log('📨 Processando mensagem:', body);
    try {
      const data = typeof body === 'string' ? JSON.parse(body) : body;

      console.log('📨 Mensagem recebida:', data);

      switch (data.type) {
        case 'REMINDER_CREATED':
          console.log('🎬 Enviando lembrete de filme:', data.payload.movieId);

          const createNotification = await this.notificationService.createNotification({
            movieId: data.payload.movieId,
            userId: data.payload.userId,
            message: `Lembrete: O filme ${data.payload.movieId} está disponível!`,
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

