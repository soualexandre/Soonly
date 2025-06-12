import { defineStore } from 'pinia'
import api from '~/utils/axios'
import {useToast}  from 'vue-toastification'

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
            const toast = useToast()
            const userId = localStorage.getItem('userId')
            if (!userId) return
            this.loading = true
            try {
                const res = await api.get(`/reminders/user/${userId}/reminders-notifications`)
                this.reminders = res.data.reminders
            } catch (error) {
                console.error('Erro ao buscar lembretes:', error)
                toast.error('Erro ao buscar lembretes')
            } finally {
                this.loading = false
            }
        },
        async removeReminder(userId: string | null, movieId: string) {
            try {
                const toast = useToast()

                const res = await api.delete(`/reminders/${userId}/${movieId}`)

                if (res.status !== 204) {
                   toast.error('Erro ao remover lembrete')
                    throw new Error('Erro ao remover lembrete')
                }
                toast.success('Lembrete removido com sucesso!')

                await this.fetchReminders()

            } catch (err) {
                console.error('Erro ao remover lembrete:', err)
            }
        }
    },
})
