<script setup lang="ts">
import { computed, defineProps } from 'vue';

const props = defineProps<{
  class?: string;
}>();

const aspectClass = computed(() => {
  return props.class ?? '';
});
</script>

<template>
  <div
    :class="[
      'animate-pulse rounded-2xl bg-slate-800/70 border border-slate-700/50 shadow-lg relative overflow-hidden',
      aspectClass
    ]"
    aria-busy="true"
    aria-label="Carregando conteúdo"
  >
    <div class="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
    <div class="h-full w-full bg-gradient-to-br from-slate-700 to-slate-800 rounded-2xl"></div>
  </div>
</template>

<style>
@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.animate-shimmer {
  animation: shimmer 2s infinite;
}
</style>