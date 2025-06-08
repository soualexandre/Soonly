<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
    <!-- Background e Decorações -->
    <div class="absolute inset-0 opacity-10">
      <div class="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20"></div>
      <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      <div class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
    </div>

    <!-- Conteúdo -->
    <div class="relative z-10 w-full max-w-md mx-auto px-6">
      <div class="text-center mb-8">
        <h1 class="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 mb-2">
          Soonly
        </h1>
        <p class="text-slate-400 text-sm">{{ $t('login.welcome') || 'Bem-vindo de volta' }}</p>
      </div>

      <div class="bg-black/40 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-8 shadow-2xl">
        <form @submit.prevent="handleLogin" class="space-y-6">
          <!-- Campo Email -->
          <div>
            <label for="email" class="block text-sm font-medium text-slate-300 mb-2">
              {{ $t('login.email') || 'Email' }}
            </label>
            <input id="email" v-model="form.email" type="email" required
              class="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-lg text-white"
              :placeholder="$t('login.emailPlaceholder') || 'Digite seu email'"
              :class="{ 'border-red-500 focus:ring-red-500': errors.email }" />
            <p v-if="errors.email" class="mt-1 text-sm text-red-400">{{ errors.email }}</p>
          </div>

          <!-- Campo Senha -->
          <div>
            <label for="password" class="block text-sm font-medium text-slate-300 mb-2">
              {{ $t('login.password') || 'Senha' }}
            </label>
            <div class="relative">
              <input id="password" v-model="form.password" :type="showPassword ? 'text' : 'password'" required
                class="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-lg text-white pr-12"
                :placeholder="$t('login.passwordPlaceholder') || 'Digite sua senha'"
                :class="{ 'border-red-500 focus:ring-red-500': errors.password }" />
              <button type="button" @click="togglePassword" class="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white">
                <svg v-if="!showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                </svg>
              </button>
            </div>
            <p v-if="errors.password" class="mt-1 text-sm text-red-400">{{ errors.password }}</p>
          </div>

          <!-- Opções adicionais -->
          <div class="flex items-center justify-between">
            <label class="flex items-center">
              <input v-model="form.rememberMe" type="checkbox"
                class="rounded border-slate-600 bg-slate-800/50 text-blue-500" />
              <span class="ml-2 text-sm text-slate-300">{{ $t('login.rememberMe') || 'Lembrar de mim' }}</span>
            </label>
            <button type="button" @click="showForgotPassword = true"
              class="text-sm text-blue-400 hover:text-blue-300">{{ $t('login.forgotPassword') || 'Esqueceu a senha?' }}</button>
          </div>

          <!-- Botão Login -->
          <button type="submit" :disabled="loading"
            class="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg">
            <span v-if="!loading">{{ $t('login.signIn') || 'Entrar' }}</span>
            <span v-else>Entrando...</span>
          </button>

          <div v-if="error" class="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-center text-red-400 text-sm">
            {{ error }}
          </div>
        </form>

        <!-- Cadastro -->
        <div class="mt-8 pt-6 border-t border-slate-700 text-center text-slate-400 text-sm">
          {{ $t('login.noAccount') || 'Não tem uma conta?' }}
          <button @click="$emit('switchToRegister')" class="text-blue-400 hover:text-blue-300 ml-1 font-medium">
            {{ $t('login.signUp') || 'Cadastre-se' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de Redefinição de Senha -->
    <div v-if="showForgotPassword" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-slate-800 rounded-2xl p-6 w-full max-w-md border border-slate-600">
        <h3 class="text-xl font-bold text-white mb-4">{{ $t('login.resetPassword') || 'Redefinir Senha' }}</h3>
        <p class="text-slate-300 mb-4 text-sm">{{ resetPasswordText }}</p>
        <form @submit.prevent="handleForgotPassword">
          <input v-model="forgotPasswordEmail" type="email" required
            class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white mb-4"
            :placeholder="$t('login.email') || 'Email'" />
          <div class="flex gap-3">
            <button type="button" @click="showForgotPassword = false"
              class="flex-1 py-2 px-4 bg-slate-600 hover:bg-slate-500 text-white rounded-lg">Cancelar</button>
            <button type="submit"
              class="flex-1 py-2 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg">Enviar</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useLogin } from '~/composables/useLogin'

const {
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
} = useLogin()

defineEmits<{ switchToRegister: [] }>()
</script>
