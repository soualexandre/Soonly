<template>
  <div
    class="container max-w-7xl  via-indigo-700 to-blue-700 rounded-xl shadow-lg p-6 hover:shadow-2xl transition-shadow duration-300 mb-6 max-w-xl mx-auto"
  >
    <div class="flex justify-between items-start">
      <div>
        <h2 class="text-2xl font-bold text-white mb-1 truncate">
          Lembrete para filme <span class="font-mono">{{ reminder.movieId }}</span>
        </h2>
        <p class="text-indigo-200 text-sm">
          Criado em: {{ formatDate(reminder.createdAt) }}
        </p>
      </div>

      <button
        @click="$emit('remove-reminder', reminder.movieId)"
        class="text-red-400 hover:text-red-600 transition-colors duration-200"
        aria-label="Remover lembrete"
        title="Remover lembrete"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <div class="mt-5 space-y-3 max-h-48 overflow-y-auto pr-2">
      <div
        v-for="notification in reminder.notifications"
        :key="notification.id"
        class="bg-indigo-900 bg-opacity-50 rounded-md p-4 shadow-md hover:bg-indigo-800 transition-colors duration-200"
      >
        <p class="text-white font-medium">{{ notification.message }}</p>
        <span class="text-xs text-indigo-300 block mt-1">
          Enviado em: {{ formatDate(notification.sentAt) }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  reminder: {
    userId: string
    movieId: string
    createdAt: string
    notifications: Array<{
      id: string
      userId: string
      type: string
      message: string
      sentAt: string
      movieId: string
    }>
  }
}>()

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleString()
}
</script>

<style scoped>
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-thumb {
  background-color: rgba(100, 100, 255, 0.5);
  border-radius: 3px;
}
</style>
