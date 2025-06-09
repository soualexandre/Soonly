import { ref, onMounted } from 'vue'

export function useAuth() {
  const isAuthenticated = ref(false)
  const token = ref('')

  const checkAuth = () => {
    if (typeof window !== 'undefined') {
      isAuthenticated.value = !!localStorage.getItem('token')
      token.value = localStorage.getItem('token') ?? ''
    }
  }

  onMounted(() => {
    checkAuth()
  })

  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token')
      localStorage.removeItem('username')
      localStorage.removeItem('email')
      window.location.href = '/login'
    }
  }

  return {
    token,
    isAuthenticated,
    logout,
    checkAuth
  }
}
