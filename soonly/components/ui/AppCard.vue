<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import ReminderConfirmModal from '~/components/reminder/ReminderConfirmModal.vue';
import { useMediaStore } from '~/stores/media';
import type { Media } from '~/types/media';
import api from '~/utils/axios';

const props = defineProps<{
  media: Media;
  isAuthenticated: boolean;
}>();

const emit = defineEmits<{
  (e: 'remind', id: number): void;
}>();

const mediaStore = useMediaStore();
const { isReminded } = mediaStore;
const router = useRouter();
const loading = ref(false);
const showModal = ref(false);
const toast = useToast();
const userId = localStorage.getItem('userId');
const { featuredMedia } = storeToRefs(mediaStore);

async function callApiReminder() {
  loading.value = true;

  const releaseDate = new Date();
  releaseDate.setDate(releaseDate.getDate() + 1);

  const reminderData = {
    movieId: String(props.media.id),
    userId,
    message: `Não perca o lançamento de ${props.media.title} amanhã!`,
    type: 'REMINDER',
    sentAt: releaseDate.toISOString().replace('T', ' ').slice(0, 19),
  };

  try {
    const response = await api.post('/reminders', reminderData);

    if (!response.data) {
      toast.error('Erro ao criar lembrete');
      throw new Error('Falha ao criar lembrete');
    }

    toast.success('Lembrete criado com sucesso');
    emit('remind', Number(props.media.id));
    mediaStore.isReminded(Number(props.media.id));
  } catch (error) {
    toast.error('Erro ao adicionar lembrete. Tente novamente.');
  } finally {
    loading.value = false;
  }
}

function onReminderButtonClick() {
  if (!props.isAuthenticated) {
    router.push('/login');
    return;
  }
  if (loading.value) return;

  showModal.value = true;
}

function onModalConfirm() {
  showModal.value = false;
  callApiReminder();
}

function onModalCancel() {
  showModal.value = false;
}
</script>

<template>
  <article
    class="group relative overflow-hidden rounded-2xl bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 shadow-xl hover:shadow-2xl transition-all duration-500 hover:bg-slate-700/60"
    role="article"
    :aria-labelledby="`media-title-${media.id}`"
  >
    <div class="relative overflow-hidden rounded-t-2xl">
      <NuxtImg
        :src="media.poster"
        :alt="`Poster de ${media.title}`"
        class="w-full h-full object-cover aspect-[2/3] transition-transform duration-700 group-hover:scale-110"
        format="webp"
        loading="lazy"
        sizes="sm:50vw md:33vw lg:20vw"
      />

      <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
     
      <div class="absolute top-4 right-4 z-10">
        <div
          class="flex items-center justify-center w-8 h-8 rounded-full bg-black/30 backdrop-blur-sm border border-white/20 transition-all duration-300 group-hover:scale-110"
          :aria-label="media.isReminding ? 'Lembrete ativo' : 'Sem lembrete ativo'"
          role="img"
        >
          <svg v-if="media.isReminding" class="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <path
              d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"
            />
          </svg>
          <svg v-else class="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </div>
      </div>
    </div>

    <div class="p-4 space-y-4">
      <h3
        :id="`media-title-${media.id}`"
        class="text-white font-bold text-lg leading-tight line-clamp-2 group-hover:text-blue-300 transition-colors duration-300"
      >
        {{ media.title }} 
      </h3>

      <ReminderConfirmModal
        :show="showModal"
        :mediaTitle="media.title"
        @confirm="onModalConfirm"
        @cancel="onModalCancel"
      />

      <button
        @click="onReminderButtonClick"
        :disabled="!props.isAuthenticated || loading || media.isReminding"
        :class="[
          'w-full py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-300 transform flex items-center justify-center gap-2 shadow-lg',
          media.isReminding
            ? 'bg-gray-500 cursor-not-allowed text-white'
            : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white hover:shadow-blue-500/30',
          (!props.isAuthenticated || loading) ? 'opacity-70' : 'hover:scale-105 focus:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-500/50'
        ]"
        :aria-label="media.isReminding ? `Lembrete já ativo para ${media.title}` : `Adicionar lembrete para ${media.title}`"
      >
        <svg v-if="media.isReminding" class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path
            d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"
          />
        </svg>
        <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        {{ media.isReminding ? 'Lembrete Ativo' : 'Adicionar Lembrete' }}
      </button>
    </div>
  </article>
</template>
