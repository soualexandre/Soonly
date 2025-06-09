import { defineStore } from 'pinia'
import api from '~/utils/axios'

export const useReminderStore = defineStore('reminder', {
    state: () => ({
        reminders: [] as Array<{
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
        }>,
        loading: false,
    }),
    actions: {
        async fetchReminders() {
            const userId = localStorage.getItem('userId')
            if (!userId) return
            this.loading = true
            try {
                const res = await api.get(`/reminders/user/${userId}/reminders-notifications`)
                this.reminders = res.data.reminders
            } catch (error) {
                console.error('Erro ao buscar lembretes:', error)
            } finally {
                this.loading = false
            }
        },
    },
})
