<script setup lang="ts">
import { ref, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useMediaStore } from '~/stores/media';
import AppCard from '~/components/ui/AppCard.vue';
import AppSkeleton from '~/components/ui/AppSkaleton.vue';
import { useIntersectionObserver } from '@vueuse/core';
import type { Media } from '~/types/media';

defineProps<{
  mediaList: Array<any>,
  isRemindedFn: (id: number) => boolean
}>();

const mediaStore = useMediaStore();
const { upcomingMedia } = storeToRefs(mediaStore);
const { toggleReminder, isReminded } = mediaStore;

const gridRef = ref<HTMLElement | null>(null);
const sentinel = ref<HTMLElement | null>(null);

const visibleItems = ref(5);

useIntersectionObserver(
  sentinel,
  ([{ isIntersecting }]) => {
    if (isIntersecting && visibleItems.value < upcomingMedia.value.length) {
      visibleItems.value += 5;
    }
  },
  { threshold: 0.1 }
);


const visibleMedia = computed<Media[]>(() => {
  return upcomingMedia.value.slice(0, visibleItems.value);
});

const loadingSkeletonsCount = computed(() => {
  const diff = upcomingMedia.value.length - visibleItems.value;
  return diff > 0 ? Math.min(5, diff) : 0;
});
</script>

<template>
  <section
    class="min-h-screen  mx-auto bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-16 px-4 sm:px-6 lg:px-8"
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
          <AppCard v-for="item in visibleMedia" :key="item.id" :media="item" :is-reminded="isReminded(Number(item.id))"
            @remind="toggleReminder(Number(item.id))"
            class="transform transition-all duration-300 hover:scale-105 hover:shadow-2xl focus:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-500/50" />
          <div ref="sentinel" class="h-1"></div>
          <AppSkeleton v-for="i in loadingSkeletonsCount" :key="`skeleton-${i}`" class="aspect-[2/3]" />
        </div>
      </div>
    </div>
  </section>
</template>