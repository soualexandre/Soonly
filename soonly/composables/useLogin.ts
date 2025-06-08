import { ref, reactive, computed } from 'vue'
import api from '~/utils/axios'
import { useRouter } from 'vue-router'

export function useLogin() {
  const router = useRouter()
  const loading = ref(false)
  const error = ref('')
  const showPassword = ref(false)
  const showForgotPassword = ref(false)
  const forgotPasswordEmail = ref('')

  const form = reactive({
    email: '',
    password: '',
    rememberMe: false
  })

  const errors = reactive({
    email: '',
    password: ''
  })

  const togglePassword = () => {
    showPassword.value = !showPassword.value
  }

  const validateForm = () => {
    errors.email = ''
    errors.password = ''
    let valid = true
    if (!form.email.includes('@')) {
      errors.email = 'Email inválido'
      valid = false
    }
    if (form.password.length < 6) {
      errors.password = 'Senha muito curta'
      valid = false
    }
    return valid
  }

  const handleLogin = async () => {
    if (!validateForm()) return
    loading.value = true
    error.value = ''
    try {
      const { data } = await api.post('/auth/login', form)
      localStorage.setItem('token', data.token)
      router.push('/dashboard')
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erro ao fazer login'
    } finally {
      loading.value = false
    }
  }

  const handleForgotPassword = async () => {
    try {
      await api.post('/auth/forgot-password', { email: forgotPasswordEmail.value })
      showForgotPassword.value = false
    } catch (err) {
      error.value = 'Erro ao enviar email de recuperação'
    }
  }

  const resetPasswordText = computed(() => {
    return 'Digite seu email para receber instruções de redefinição de senha.'
  })

  return {
    form,
    errors,
    loading,
    error,
    showPassword,
    showForgotPassword,
    forgotPasswordEmail,
    resetPasswordText,
    togglePassword,
    handleLogin,
    handleForgotPassword
  }
}
