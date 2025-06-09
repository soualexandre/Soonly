import { NotificationType } from '@prisma/client'

export type NotificationData = {
  movieId: string | null
  userId: string
  message: string
  sentAt: Date
  type: NotificationType
}