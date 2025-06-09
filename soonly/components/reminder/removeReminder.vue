<template>
    <div>
        <ReminderCard v-for="reminder in reminders" :key="reminder.movieId" :reminder="reminder"
            @remove-reminder="handleRemoveReminder" />
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ReminderCard from '~/components/reminder/RemindersCard.vue'


const reminders = ref([] as Array<{
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
}>)

function handleRemoveReminder(movieId: string) {
    reminders.value = reminders.value.filter((r: any) => r.movieId !== movieId)
}
</script>
