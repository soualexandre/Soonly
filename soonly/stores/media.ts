import { defineStore } from 'pinia';
import type { AxiosError } from 'axios';
import { isAxiosError } from 'axios';
import api from '~/utils/axios';
import {useToast}  from 'vue-toastification'

interface AppMedia {
  id: string;
  title: string;
  backdrop: string;
  poster: string;
  backdrop_path: string;
  poster_path: string;
  overview: string;
  releaseDate: string;
  mediaType: 'movie' | 'tv';
  userId?: string;
  movieId?: string;
}

interface UpcomingMediaApiResponse {
  dates: {
    maximum: string;
    minimum: string;
  };
  page: number;
  results: Array<{
    id: number;
    title: string;
    overview: string;
    backdrop_path: string;
    poster_path: string;
    release_date: string;
    vote_average: number;
    vote_count: number;
  }>;
  total_pages: number;
  total_results: number;
}

interface MediaStoreState {
  upcomingMedia: AppMedia[];
  featuredMedia: AppMedia | null;
  reminders: number[];
  loading: boolean;
  error: string | null;
}

export const useMediaStore = defineStore('media', {
  state: (): MediaStoreState => ({
    upcomingMedia: [],
    featuredMedia: null,
    reminders: [],
    loading: false,
    error: null,
  }),

  actions: {
    initReminders(): void {
      if (process.client) {
        const stored = localStorage.getItem('soonly-reminders');
        this.reminders = stored ? JSON.parse(stored) : [];
      }
    },

    async fetchUpcomingMedia(): Promise<void> {
      const toast = useToast()

      this.loading = true;
      this.error = null;
      try {
        const response = await api.get<UpcomingMediaApiResponse>('/movies/upcoming');

        this.upcomingMedia = response.data.results.map((item: UpcomingMediaApiResponse['results'][number]) => ({
          id: String(item.id),
          title: item.title,
          overview: item.overview,
          backdrop_path: item.backdrop_path,
          poster_path: item.poster_path,
          backdrop: item.backdrop_path ? `https://image.tmdb.org/t/p/w780${item.backdrop_path}` : '',
          poster: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : '',
          releaseDate: item.release_date,
          mediaType: 'movie',
        }));

        this.featuredMedia = this.upcomingMedia[0] || null;
      } catch (error) {
        toast.error('Erro ao buscar mídias futuras');
        this.handleAxiosError(error, 'Erro ao buscar mídias futuras.');
      } finally {
        this.loading = false;
      }
    },

    async fetchReminders(): Promise<void> {
      this.loading = true;
      this.error = null;
      const toast = useToast()

      try {
        const response = await api.get<number[]>('/reminders');
        this.reminders = response.data;
        if (process.client) {
          localStorage.setItem('soonly-reminders', JSON.stringify(this.reminders));
        }
      } catch (error) {
        toast.error('Erro ao Buscar Lembretes')
        this.handleAxiosError(error, 'Erro ao buscar lembretes.');
      } finally {
        this.loading = false;
      }
    },

    toggleReminder(mediaId: number): void {
      if (this.reminders.includes(mediaId)) {
        this.reminders = this.reminders.filter((id: number) => id !== mediaId);
      } else {
        this.reminders.push(mediaId);
      }
      if (process.client) {
        localStorage.setItem('soonly-reminders', JSON.stringify(this.reminders));
      }
    },

    handleAxiosError(error: unknown, fallbackMessage: string): void {
      let message = fallbackMessage;

      if (isAxiosError(error)) {
        const axiosError = error as AxiosError;
        message = axiosError.message || fallbackMessage;
      } else if (error instanceof Error) {
        message = error.message;
      }

      this.error = message;
      console.error('[Axios Error]', message);
    }
  },

  getters: {
    isReminded: (state) => (id: number): boolean => state.reminders.includes(id),
    hasError: (state): boolean => !!state.error,
    isLoading: (state): boolean => state.loading,
  },
});
