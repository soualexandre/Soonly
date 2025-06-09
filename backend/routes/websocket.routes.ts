import { FastifyInstance } from 'fastify'
import WebSocket from 'ws'

export const wsClients = new Set<WebSocket>() 

export async function websocketRoutes(app: FastifyInstance) {
  app.get('/ws', { websocket: true }, (socket, req) => {
    wsClients.add(socket)
    console.log('📡 Novo cliente conectado. Total:', wsClients.size)

    socket.send(JSON.stringify({
      event: 'CONNECTED',
      message: 'Bem-vindo ao WebSocket de lembretes!'
    }))

    socket.on('message', (message) => {
      const msgString = message.toString()
      console.log('📨 Mensagem recebida:', msgString)
    })

    socket.on('close', () => {
      wsClients.delete(socket)
      console.log('❌ Cliente desconectado. Total:', wsClients.size)
    })
  })
}
declare module 'fastify' {
interface FastifyInstance {
  websocketServer: WebSocket.ServerOptions
}
}