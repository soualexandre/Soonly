<script setup lang="ts">
import { useIntersectionObserver } from '@vueuse/core';
import { storeToRefs } from 'pinia';
import { ref } from 'vue';
import AppCard from '~/components/ui/AppCard.vue';
import AppSkeleton from '~/components/ui/AppSkaleton.vue';
import { useMediaStore } from '~/stores/media';
import { useAuth } from '~/composables/useAuth';

function debounce<T extends (...args: any[]) => any>(fn: T, delay = 300) {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
}

const mediaStore = useMediaStore();
const { upcomingMedia, currentPage, totalPages, loading, isReminded } = storeToRefs(mediaStore);
const { toggleReminder, fetchMoreUpcomingMedia } = mediaStore;

const gridRef = ref<HTMLElement | null>(null);
const sentinel = ref<HTMLElement | null>(null);
const { isAuthenticated } = useAuth();


const loadMore = debounce(async () => {
  await fetchMoreUpcomingMedia();
});

useIntersectionObserver(
  sentinel,
  ([{ isIntersecting }]) => {
    console.log('Sentinel isIntersecting:', isIntersecting);
    if (isIntersecting) {
      loadMore();
    }
  },
  { threshold: 0.1 }
);
</script>

<template>
  <section
    class="min-h-screen mx-auto bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-16 px-4 sm:px-6 lg:px-8"
    aria-labelledby="upcoming-media-section">
    <div class="max-w-7xl mx-auto">
      <div class="text-center mb-16">
        <h1
          class="text-5xl sm:text-6xl lg:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 mb-6 tracking-tight">
          {{ $t('home.movieReminder') }}
        </h1>
        <p class="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
          {{ $t('home.favoriteMoveies') }}
        </p>
      </div>

      <div class="mb-12">
        <div class="flex items-center gap-4 mb-8">
          <div class="h-1 w-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
          <h2 id="upcoming-media-section" class="text-3xl sm:text-4xl font-bold text-white">
            {{ $t('home.upcomingReleases') }}
          </h2>
        </div>

        <div ref="gridRef"
          class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6 lg:gap-8">
          <AppCard v-for="item in upcomingMedia" :key="item.id" :media="item" :is-reminded="isReminded(Number(item.id))"
            :is-authenticated="isAuthenticated" @remind="toggleReminder(Number(item.id))"
            class="transform transition-all duration-300 hover:scale-105 hover:shadow-2xl focus:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-500/50" />

          <AppSkeleton v-if="loading" v-for="i in 5" :key="`skeleton-${i}`" class="aspect-[2/3]" />
        </div>
      </div>
    </div>

    <div ref="sentinel" class="h-10"></div>
  </section>
</template>
