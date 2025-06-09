import { Static, Type } from '@sinclair/typebox'
import { NotificationType } from '@prisma/client'

export const Reminder = Type.Object({
  userId: Type.String({ format: 'uuid' }),
  movieId: Type.String(),
  type: Type.Optional(Type.Enum(NotificationType)),
  sendAt: Type.Optional(Type.String({ format: 'date-time' })),
  message: Type.Optional(Type.String()),
  createdAt: Type.String({ format: 'date-time' }),
})

export const ReminderArray = Type.Array(Reminder)

export const CreateReminderBody = Type.Object({
  movieId: Type.String(),
  userId: Type.String({ format: 'uuid' }),
  type: Type.Enum(NotificationType),
  sendAt: Type.Optional(Type.String({ format: 'date-time' })),
  message: Type.Optional(Type.String()),
})

export const UserIdParams = Type.Object({
  userId: Type.String({ format: 'uuid' }),
})

export const IdParams = Type.Object({
  id: Type.String({ format: 'uuid' }),
})

export type ReminderType = Static<typeof Reminder>
export type ReminderArrayType = Static<typeof ReminderArray>
export type CreateReminderBodyType = Static<typeof CreateReminderBody>
export type UserIdParamsType = Static<typeof UserIdParams>
export type IdParamsType = Static<typeof IdParams>
