<template>
    <header class="fixed top-0 left-0 right-0 z-50 bg-black/30 backdrop-blur-md shadow-md">
        <nav class="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <h1 class="text-xl font-semibold tracking-wider text-white drop-shadow">
                {{ $t('app.name') }}
            </h1>

            <div class="flex items-center gap-6">
                <div class="relative w-48">
                    <div class="absolute inset-y-0 left-3 flex items-center text-lg">🌐</div>
                    <select v-model="$i18n.locale"
                        class="w-full appearance-none bg-black/60 text-white border border-gray-600 rounded-lg pl-10 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent">
                        <option value="en">🇺🇸 English</option>
                        <option value="pt-BR">🇧🇷 Português</option>
                    </select>
                    <div class="absolute inset-y-0 right-3 flex items-center text-sm pointer-events-none">▼</div>
                </div>

                <div v-if="isAuthenticated && userDataLoaded" class="relative" ref="dropdownRef">
                    <button @click="toggleDropdown"
                        class="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-white font-bold text-lg focus:outline-none focus:ring-2 focus:ring-red-600/80"
                        aria-haspopup="true" :aria-expanded="dropdownOpen">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
                        </svg>
                    </button>

                    <div v-show="dropdownOpen"
                        class="absolute right-0 mt-2 w-56 bg-black/90 border border-gray-700 rounded-md shadow-lg py-3 z-50 flex flex-col transition-opacity duration-200"
                        :class="{'opacity-100': dropdownOpen, 'opacity-0': !dropdownOpen}">
                        <div class="px-4 py-2">
                            <div class="font-semibold truncate text-white" :title="userData.name">
                                {{ userData.name }}
                            </div>
                            <div v-if="userData.email" class="text-gray-400 text-xs truncate mt-1"
                                :title="userData.email">
                                {{ userData.email }}
                            </div>
                        </div>

                        <div class="border-t border-gray-700 my-2"></div>

                        <button @click="handleLogout"
                            class="px-4 py-2 text-left text-white hover:bg-gray-800 transition flex items-center gap-3"
                            role="menuitem">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-500" viewBox="0 0 20 20"
                                fill="currentColor">
                                <path fill-rule="evenodd"
                                    d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
                                    clip-rule="evenodd" />
                            </svg>
                            <span>{{ $t('auth.logout') }}</span>
                        </button>
                    </div>
                </div>

                <button v-else @click="goLogin"
                    class="bg-red-600 hover:bg-red-700 transition-colors rounded-md px-4 py-2 text-white font-semibold">
                    {{ $t('auth.login') }}
                </button>
            </div>
        </nav>
    </header>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '~/composables/useAuth'
import { onClickOutside } from '@vueuse/core'

const { isAuthenticated, logout } = useAuth()
const router = useRouter()

const dropdownOpen = ref(false)
const dropdownRef = ref(null)

const toggleDropdown = () => {
    dropdownOpen.value = !dropdownOpen.value
}
const closeDropdown = () => {
    dropdownOpen.value = false
}

const userData = ref({
    name: '',
    email: '',
})
const userDataLoaded = ref(false)

const loadUserData = () => {
    if (typeof window !== 'undefined') {
        userData.value = {
            name: localStorage.getItem('username') || '',
            email: localStorage.getItem('email') || '',
        }
        userDataLoaded.value = true
    }
}

onMounted(() => {
    loadUserData()
    window.addEventListener('storage', handleStorageEvent)
    window.addEventListener('user-data-updated', loadUserData)
})

onUnmounted(() => {
    window.removeEventListener('storage', handleStorageEvent)
    window.removeEventListener('user-data-updated', loadUserData)
})

const handleStorageEvent = (event: StorageEvent) => {
    if (event.key === 'username' || event.key === 'email') {
        loadUserData()
    }
}

onClickOutside(dropdownRef, closeDropdown)

const goLogin = () => {
    router.push('/login')
}

const handleLogout = () => {
    logout()
    dropdownOpen.value = false
    router.push('/')
}
</script>

<style scoped>
.transition-opacity {
  transition: opacity 0.2s ease;
}
</style>