<template>
  <div>
    <button @click="fetchReminders" class="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
      Atualizar lembretes
    </button>

    <div v-if="store.loading" class="text-white">Carregando lembretes...</div>

    <div v-else>
      <ReminderCard v-for="reminder in store.reminders" :key="reminder.movieId" :reminder="reminder" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useReminderStore } from '~/stores/reminders'
import { onMounted } from 'vue'
import ReminderCard from '~/components/reminder/RemindersCard.vue'

const store = useReminderStore()

const fetchReminders = async () => {
  await store.fetchReminders()
}

onMounted(() => {
  fetchReminders()
})
</script>
