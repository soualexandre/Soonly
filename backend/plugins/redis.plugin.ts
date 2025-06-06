import fp from 'fastify-plugin'
import Redis from 'ioredis'
import { redisConfig } from '../config/redis.config'
import { hostname } from 'os'

export const redisPlugin = fp(async function (fastify) {
  const redis = new Redis({
    host: redisConfig.host,
    port: redisConfig.port,
    password: redisConfig.password,
  })

  redis.on('error', (err) => {
    fastify.log.error('Redis error', redisConfig.host, redisConfig.port)
  })

  redis.on('connect', () => {
    fastify.log.info('Redis connected', redisConfig.host, redisConfig.port)
  })
  
  redis.on('ready', () => {
    fastify.log.info('Redis ready', redisConfig.host, redisConfig.port)
  })

  redis.on('close', () => {
    fastify.log.info('Redis connection closed', redisConfig.host, redisConfig.port)
  })

  redis.on('reconnecting', () => {
    fastify.log.info('Redis reconnecting', redisConfig.host, redisConfig.port)
  })  

  fastify.decorate('redis', redis)
  
  fastify.addHook('onClose', async () => {
    await redis.quit()
  })
})
