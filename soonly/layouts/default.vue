<template>
  <div class="min-h-screen flex flex-col bg-black text-white">
    <header class="fixed top-0 left-0 right-0 z-50 bg-black/30 backdrop-blur-md shadow-md">
      <nav class="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <h1 class="text-xl font-semibold tracking-wider text-white drop-shadow">
          {{ $t('app.name') }}
        </h1>
        <div class="relative w-48">
          <div class="absolute inset-y-0 left-3 flex items-center text-lg">🌐</div>
          <select
            v-model="$i18n.locale"
            class="w-full appearance-none bg-black/60 text-white border border-gray-600 rounded-lg pl-10 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
          >
            <option value="en">🇺🇸 English</option>
            <option value="pt-BR">🇧🇷 Português</option>
          </select>
          <div class="absolute inset-y-0 right-3 flex items-center text-sm pointer-events-none">▼</div>
        </div>
      </nav>
    </header>

    <main class="">
      <NuxtPage />
    </main>

    <footer class="py-4 text-center text-gray-500 text-sm bg-black/80 border-t border-gray-800">
      © 2025 Meu Projeto Nuxt
    </footer>
  </div>
</template>

<script setup lang="ts">
// Nenhum script por enquanto
</script>

