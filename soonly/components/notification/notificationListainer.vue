<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useSocket } from '~/composables/webSocket'

const { connect, notifications } = useSocket()

onMounted(() => {
  connect()
})

function closeNotification(id: string | number) {
  const index = notifications.value.findIndex(n => n.id === id)
  if (index !== -1) notifications.value.splice(index, 1)
}
</script>

<template>
  <div v-if="notifications.length > 0"
    class="fixed top-4 right-4 w-80 max-h-[80vh] overflow-y-auto space-y-2 z-50">
    <div v-for="notification in notifications" :key="notification.id"
      class="bg-blue-600 text-white p-4 rounded shadow-md animate-fade-in relative">
      <button @click="closeNotification(notification.id)" class="absolute top-1 right-2 text-white hover:text-gray-300"
        aria-label="Fechar notificação">
        &times;
      </button>
      <h3 class="font-bold">Nova Notificação</h3>
      <p>{{ notification.message }}</p>
      <small class="opacity-70">Filme ID: {{ notification.movieId }}</small>
    </div>
  </div>
</template>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-fade-in {
  animation: fade-in 0.3s ease forwards;
}
</style>
