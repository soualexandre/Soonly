import { FastifyInstance } from "fastify";

export class WebSocketService {
  constructor(private fastify: FastifyInstance) {
    this.setupSocketIO();
  }

  private setupSocketIO() {
    const io = this.fastify.io;

    if (!io) {
      throw new Error("Socket.IO não está registrado no Fastify.");
    }

    io.on("connection", (socket) => {
      console.log(`Cliente conectado: ${socket.id}`);

      socket.on("authenticate", (token) => {
        const userId = this.authenticateUser(token);
        if (userId) {
          socket.join(`user_${userId}`);
        }
      });
    });
  }

  sendNotification(userId: string, payload: any): Promise<void> {
    return new Promise((resolve, reject) => {
 

      socket.emit("notification", payload, (ack: any) => {
        if (ack.success) {
          resolve();
        } else {
          reject(new Error("Erro no ack da notificação"));
        }
      });
    });
  }

  private authenticateUser(token: string): string | null {
    return "user-id-from-token";
  }
}
