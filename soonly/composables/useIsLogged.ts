import { useAuth } from '~/composables/useAuth'

const { isAuthenticated } = useAuth()

if (!isAuthenticated.value) {
     window.location.href = '/login'
}
