import { ref, onBeforeUnmount } from 'vue'
import { io, Socket } from 'socket.io-client'
import { useAuth } from '~/composables/useAuth' 

const socket = ref<Socket | null>(null)
const notifications = ref<Array<any>>([])

export function useSocket() {
  const { token } = useAuth()
  console.log("token", token)
  const connect = () => {
    if (socket.value) return

    socket.value = io('http://localhost:3053', {
      transports: ['websocket'],
      auth: {
        token: token.value,
      }
    })

    socket.value.on('connect', () => {
      console.log('Socket conectado', socket.value?.id)
     
      socket.value?.emit('authenticate', token.value)
    })

    socket.value.on('notification', (payload) => {
      notifications.value.push(payload)
    })

    socket.value.on('disconnect', () => {
      console.log('Socket desconectado')
    })
  }

  const disconnect = () => {
    socket.value?.disconnect()
    socket.value = null
  }

  onBeforeUnmount(() => {
    disconnect()
  })

  return { socket, connect, disconnect, notifications }
}
