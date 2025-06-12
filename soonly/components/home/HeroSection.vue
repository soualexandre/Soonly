<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { computed, ref } from 'vue';
import { useAuth } from '~/composables/useAuth';
import { useMediaStore } from '~/stores/media';
import { useToast } from 'vue-toastification';
import api from '~/utils/axios';

import ReminderConfirmModal from '~/components/reminder/ReminderConfirmModal.vue';
const toast = useToast();

const mediaStore = useMediaStore();
const { featuredMedia } = storeToRefs(mediaStore);
const { toggleReminder, isReminded } = mediaStore;
const { isAuthenticated } = useAuth();

const isReminderLoading = ref(false);
const reminderError = ref<string | null>(null);
const showConfirmModal = ref(false);

function handleReminderClick() {
   if (featuredMedia.value?.isReminding) {
    return; 
  }
  if (!isAuthenticated.value) {
    window.location.href = '/login';
  } else if (featuredMedia.value) {
    showConfirmModal.value = true;
  }
}

async function onConfirmReminder() {
  showConfirmModal.value = false;
  await createReminder();
}

function onCancelReminder() {
  showConfirmModal.value = false;
}

const formattedReleaseDate = computed(() => {
  if (!featuredMedia.value?.releaseDate) return 'Data não informada';

  const date = new Date(featuredMedia.value.releaseDate);
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(date);
});
async function createReminder() {
  if (!featuredMedia.value) return;

  isReminderLoading.value = true;
  reminderError.value = null;

  try {
    const userId = localStorage.getItem('userId');
    if (!userId) throw new Error('User ID not found');

    const releaseDate = new Date();
    releaseDate.setDate(releaseDate.getDate() + 1);

    const reminderData = {
      movieId: String(featuredMedia.value.id),
      userId,
      message: `Não perca o lançamento de ${featuredMedia.value.title} amanhã!`,
      type: 'REMINDER',
      sentAt: releaseDate.toISOString().replace('T', ' ').slice(0, 19)
    };

    const response = await api.post('/reminders', reminderData);
    if (!response.data) {
      toast.error('Erro ao Criar Lembrete');
      throw new Error('Failed to create reminder');
    }

    toast.success('Lembrete Criado com Sucesso');
    toggleReminder(Number(featuredMedia.value.id));
  } catch (error) {
    console.error('Reminder error:', error);
    reminderError.value = 'Erro ao criar lembrete. Tente novamente.';
  } finally {
    isReminderLoading.value = false;
  }
}

</script>

<template>
  <section class="relative h-screen overflow-hidden" aria-labelledby="featured-media-title">
    <div class="absolute inset-0 w-full">
      <NuxtImg :src="`${featuredMedia?.backdrop}`" :alt="`Capa do filme ${featuredMedia?.title}`"
        class="w-full h-full object-cover" sizes="100vw" format="webp" densities="x1 x2" loading="eager" />
      <div class="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent"></div>
      <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
    </div>

    <div class="relative z-20 h-full flex items-center max-w-7xl mx-auto">
      <div class="container w-full mx-auto px-6 md:px-12 lg:px-20">
        <div class="max-w-4xl">
          <div
            class="inline-flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-500 px-4 py-2 rounded-full text-white font-semibold text-sm mb-6">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            {{ $t('home.featured') }}
          </div>

          <h1 id="featured-media-title"
            class="text-5xl sm:text-6xl lg:text-8xl font-black mb-6 text-white leading-tight tracking-tight drop-shadow-2xl">
            {{ featuredMedia?.title }}
          </h1>

          <div class="flex items-center gap-3 mb-8">
            <div class="flex items-center gap-2 bg-blue-600/90 backdrop-blur-sm px-4 py-2 rounded-full">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span class="text-white font-semibold">{{ formattedReleaseDate }}</span>
            </div>
          </div>

          <p class="text-lg sm:text-xl text-gray-200 mb-10 leading-relaxed max-w-3xl drop-shadow-lg">
            {{ featuredMedia?.overview || 'Descrição não disponível.' }}
          </p>

          <AppButton :icon="featuredMedia?.isReminding ? 'i-heroicons-bell-alert' : 'i-heroicons-bell'"
            :variant="featuredMedia?.isReminding ? 'primary' : 'secondary'"
            :aria-label="featuredMedia?.isReminding ? 'Lembrete já criado' : 'Ativar lembrete'"
            :disabled="featuredMedia?.isReminding" :loading="isReminderLoading" @click="handleReminderClick" class="px-8 py-4 rounded-xl font-bold text-lg shadow-2xl transform transition-all duration-300 hover:scale-105 focus:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-500/50
    bg-gradient-to-r
    " :class="featuredMedia?.isReminding
      ? 'from-gray-500 to-gray-600 cursor-not-allowed hover:scale-100 hover:shadow-none'
      : 'from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:shadow-blue-500/40'
      ">
            {{ featuredMedia?.isReminding ? $t('home.reminderActive') : $t('home.remindMe') }}
          </AppButton>

          <ReminderConfirmModal :show="showConfirmModal" :mediaTitle="featuredMedia?.title ?? ''"
            @confirm="onConfirmReminder" @cancel="onCancelReminder" />
        </div>
      </div>
    </div>
  </section>
</template>
