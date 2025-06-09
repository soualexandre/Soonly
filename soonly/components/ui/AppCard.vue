<script setup lang="ts">
import { useRouter } from 'vue-router';
import type { Media } from '~/types/media';
import { ref } from 'vue';
import api from '~/utils/axios';
const mediaStore = useMediaStore();

const props = defineProps<{
  media: Media;
  isReminded: boolean;
  isAuthenticated: boolean;
}>();

const emit = defineEmits<{
  (e: 'remind', id: string): void;
}>();

const router = useRouter();
const loading = ref(false);
const userId = localStorage.getItem('userId');

async function handleReminderClick() {

  if (!props.isAuthenticated) {
    router.push('/login');
    return;
  }

  if (loading.value) return;

  loading.value = true;
  const { featuredMedia } = storeToRefs(mediaStore);
  const releaseDate = new Date();
  releaseDate.setDate(releaseDate.getDate() + 1);

  const reminderData = {
    movieId: String(featuredMedia?.value?.id),
    userId: userId,
    message: `Não perca o lançamento de ${featuredMedia?.value?.title} amanhã!`,
    type: "REMINDER",
    sentAt: releaseDate?.toISOString().replace('T', ' ').slice(0, 19)
  };
  try {
    const response = await api.post('/reminders', reminderData);
    console.log("reponse", response);
    console.log("reponse", typeof response);
    if (!response.data) {
      throw new Error('Falha ao atualizar lembrete');
    }

    emit('remind', props.media.id);
  } catch (error) {
    console.error(error);
    alert('Não foi possível atualizar o lembrete. Tente novamente.');
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <article
    class="group relative overflow-hidden rounded-2xl bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 shadow-xl hover:shadow-2xl transition-all duration-500 hover:bg-slate-700/60"
    role="article" :aria-labelledby="`media-title-${media.id}`">
    <div class="relative overflow-hidden rounded-t-2xl">
      <NuxtImg :src="media.poster" :alt="`Poster de ${media.title}`"
        class="w-full h-full object-cover aspect-[2/3] transition-transform duration-700 group-hover:scale-110"
        format="webp" loading="lazy" sizes="sm:50vw md:33vw lg:20vw" />

      <div
        class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
      </div>

      <div class="absolute top-4 right-4 z-10">
        <div
          class="flex items-center justify-center w-8 h-8 rounded-full bg-black/30 backdrop-blur-sm border border-white/20 transition-all duration-300 group-hover:scale-110"
          :aria-label="isReminded ? 'Lembrete ativo' : 'Sem lembrete ativo'" role="img">
          <svg v-if="isReminded" class="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <path
              d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
          </svg>
          <svg v-else class="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </div>
      </div>
    </div>

    <div class="p-4 space-y-4">
      <h3 :id="`media-title-${media.id}`"
        class="text-white font-bold text-lg leading-tight line-clamp-2 group-hover:text-blue-300 transition-colors duration-300">
        {{ media.title }}
      </h3>

      <button @click="handleReminderClick" :disabled="!props.isAuthenticated || loading" :class="[
        'w-full py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-300 transform hover:scale-105 focus:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-500/50 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl',
        isReminded
          ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white hover:shadow-green-500/30'
          : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white hover:shadow-blue-500/30',
        !props.isAuthenticated || loading ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'
      ]" :aria-label="isReminded ? `Remover lembrete para ${media.title}` : `Adicionar lembrete para ${media.title}`">
        <svg v-if="isReminded" class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path
            d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
        </svg>
        <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        {{ loading ? 'Aguarde...' : (isReminded ? 'Lembrete Ativo' : 'Adicionar Lembrete') }}
      </button>
    </div>
  </article>
</template>
