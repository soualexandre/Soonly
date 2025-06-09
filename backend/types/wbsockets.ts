export type WebSocketEvent = 
  | 'CONNECTED'
  | 'REMINDER_CREATED'
  | 'REMINDER_UPDATED'
  | 'REMINDER_DELETED';

export interface WebSocketMessage<T = any> {
  event: WebSocketEvent;
  data: T;
}