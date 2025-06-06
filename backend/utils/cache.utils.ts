import Redis from 'ioredis'

export class CacheService {
  private redis: Redis

  constructor() {
    this.redis = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: Number(process.env.REDIS_PORT) || 6379,
      password: process.env.REDIS_PASSWORD || undefined,
    })
  }

  async fetch<T>(key: string, ttlInSeconds: number, fetcher: () => Promise<T>): Promise<T> {
    const cached = await this.redis.get(key)
    if (cached) {
      return JSON.parse(cached)
    }

    const result = await fetcher()
    await this.redis.setex(key, ttlInSeconds, JSON.stringify(result))
    return result
  }

  async delete(key: string): Promise<void> {
    await this.redis.del(key)
  }

  async clear(): Promise<void> {
    const keys = await this.redis.keys('*')
    if (keys.length > 0) {
      await this.redis.del(keys)
    }
  }

  async exists(key: string): Promise<boolean> {
    const exists = await this.redis.exists(key)
    return exists === 1
  }
}
