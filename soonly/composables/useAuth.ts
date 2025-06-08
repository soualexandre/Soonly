import { computed } from 'vue'

export function useAuth() {
  const isAuthenticated = computed(() => {
    return !!localStorage.getItem('token')
  })

  const logout = () => {
    localStorage.removeItem('token')
    window.location.href = '/login'
  }

  return {
    isAuthenticated,
    logout
  }
}
