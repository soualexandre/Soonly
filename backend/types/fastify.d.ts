import { Redis as RedisClient } from 'ioredis'

declare module 'fastify' {
  interface FastifyInstance {
    redis: RedisClient
  }
}

