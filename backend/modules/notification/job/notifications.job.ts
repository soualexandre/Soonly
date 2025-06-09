import { FastifyInstance } from "fastify";
import { NotificationRepository } from "../notification.repository";
import { WebSocketService } from "../../websocket/websocket.service";
import { CronJob } from "cron";

const notificationRepository = new NotificationRepository();

export class NotificationJob {
    private fastify: FastifyInstance;
    private wsService: WebSocketService;

    constructor(fastify: FastifyInstance) {
        this.fastify = fastify;
        this.wsService = new WebSocketService(fastify);
        this.setupCronJob();
    }

    private setupCronJob() {
        const job = new CronJob("*/10 * * * * *", async () => {
            console.log("Cron rodando");

            await this.processNotifications();
        });

        job.start();
    }

    private async processNotifications() {
        try {
            const now = new Date();
            const pendingNotifications = await notificationRepository.findPendingNotifications(now);
            console.log("pending", pendingNotifications);
            if (pendingNotifications.length <= 0) {
                this.fastify.log.info('Menos de 1 notificações pendentes. Nada será enviado.');
                return;
            }
            for (const notification of pendingNotifications) {
                try {
                    this.wsService.sendNotification(notification.userId, {
                        id: notification.id,
                        message: notification.message,
                        movieId: notification.movieId
                    });

                    await notificationRepository.markAsSent(notification.id);

                    this.fastify.log.info(`Notificação enviada: ${notification.id}`);
                } catch (error) {
                    this.fastify.log.error(`Erro ao enviar notificação ${notification.id}: ${error}`);
                }
            }
        } catch (error) {
            this.fastify.log.error(`Erro no job de notificações: ${error}`);
        }
    }
}
