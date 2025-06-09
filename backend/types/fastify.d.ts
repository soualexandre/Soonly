import { Redis as RedisClient } from 'ioredis'
import { Server as SocketIOServer } from 'socket.io';

declare module 'fastify' {
  interface FastifyInstance {
    io: SocketIOServer;
  }
}

declare module 'fastify' {
  interface FastifyInstance {
    redis: RedisClient
  }
}

