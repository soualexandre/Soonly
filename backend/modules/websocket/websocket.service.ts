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

      socket.on("authenticate", (token: string) => {
        const userId = this.authenticateUser(token);
        if (userId) {
          const room = `user_${userId}`;
          socket.join(room);
          console.log(`Usuário autenticado: ${userId}, entrou na sala: ${room}`);
        }
      });
    });
  }

  sendNotification(userId: string, payload: any): void {
    const room = `user_${userId}`;
    this.fastify.io.to(room).emit("notification", payload);
    this.fastify.log.info(`Notificação emitida para sala: ${room}`);
  }

  private authenticateUser(token: string): string | null {
    try {
      const decoded = this.fastify.jwt.verify(token) as { userId: string };
      return decoded.userId;
    } catch (error) {
      this.fastify.log.error("Erro ao verificar token JWT:", error);
      return null;
    }
  }
}
