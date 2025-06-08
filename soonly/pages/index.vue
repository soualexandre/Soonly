<script setup lang="ts">
import { useMediaStore } from '~/stores/media';
import HeroSection from '~/components/home/HeroSection.vue'
import MediaGrid from '~/components/home/MediaGrid.vue'
const mediaStore = useMediaStore();

useHead({
  title: 'Soonly - Acompanhe próximas estreias',
  meta: [
    {
      name: 'description',
      content: 'Marque lembretes para filmes e séries que estão por vir e nunca perca uma estreia'
    },
    {
      name: 'theme-color',
      content: '#0a0a0a'
    }
  ],
  htmlAttrs: {
    lang: 'pt-BR'
  }
});

onMounted(async () => {
  await Promise.all([
    mediaStore.fetchUpcomingMedia()
  ]);
});

if (process.server) {
  await mediaStore.fetchUpcomingMedia();
}
</script>

<template>
  <div>
    <HeroSection />
    <MediaGrid  :mediaList="mediaStore.upcomingMedia" :isRemindedFn="mediaStore.isReminded" />
  </div>
</template>
