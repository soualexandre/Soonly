import pino from 'pino'

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: {
    targets: [
      {
        target: 'pino-pretty',
        level: 'info',
        options: {
          colorize: true,
          translateTime: 'SYS:yyyy-mm-dd HH:MM:ss.l',
          ignore: 'pid,hostname'
        }
      },
      {
        target: 'pino/file',
        level: 'debug',
        options: {
          destination: './logs/app.log',
          mkdir: true
        }
      }
    ]
  }
})