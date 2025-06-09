<template>
  <div>
    <button @click="fetchReminders" class="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
      Atualizar lembretes
    </button>

    <div v-if="store.loading" class="text-white">Carregando lembretes...</div>

    <div v-else>
      <ReminderCard v-for="reminder in store.reminders" :key="reminder.movieId" :reminder="reminder"
        @remove-reminder="openConfirmModal" />
    </div>

    <div v-if="showModal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
      <div class="bg-gray-800 rounded-lg p-6 w-80 shadow-lg border border-gray-700">
        <h2 class="text-xl font-semibold text-white mb-4">Confirmar exclusão</h2>
        <p class="text-gray-300">Tem certeza que deseja excluir este lembrete?</p>

        <div class="mt-6 flex justify-end gap-4">
          <button class="px-4 py-2 rounded border border-gray-600 text-gray-300 hover:bg-gray-700"
            @click="closeConfirmModal">
            Cancelar
          </button>
          <button class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700" @click="confirmRemove">
            Excluir
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useReminderStore } from '~/stores/reminders'
import { onMounted, ref } from 'vue'
import ReminderCard from '~/components/reminder/RemindersCard.vue'

const store = useReminderStore()

const fetchReminders = async () => {
  await store.fetchReminders()
}

const showModal = ref(false)
const reminderToRemove = ref<{ movieId: string; userId: string } | null>(null)

function openConfirmModal(reminder: { movieId: string; userId: string }) {
  reminderToRemove.value = reminder
  showModal.value = true
}

function closeConfirmModal() {
  showModal.value = false
  reminderToRemove.value = null
}

async function confirmRemove() {
  if (reminderToRemove.value) {
    await store.removeReminder(reminderToRemove.value.userId, reminderToRemove.value.movieId)
    closeConfirmModal()
  }
}

onMounted(() => {
  fetchReminders()
})
</script>
