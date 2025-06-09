<template>
  <div class="min-h-screen flex flex-col bg-black text-white">
    <AppHeader />
    <main class="">
      <NuxtPage />
    </main>

    <footer class="py-4 text-center text-gray-500 text-sm bg-black/80 border-t border-gray-800">
      © 2025 Meu Projeto Nuxt
    </footer>
  </div>
</template>

<script setup lang="ts">
import AppHeader from './appHeader.vue'
</script>
