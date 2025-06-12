import { defineStore } from 'pinia';
import type { AxiosError } from 'axios';
import { isAxiosError } from 'axios';
import api from '~/utils/axios';
import { useToast } from 'vue-toastification'
import type { Media } from '~/types/media';

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
    backdrop: string;
    poster: string;
    releaseDate: Date;
    vote_average: number;
    vote_count: number;
    isReminding: boolean;
  }>;
  total_pages: number;
  total_results: number;
}

interface MediaStoreState {
  upcomingMedia: Media[];
  featuredMedia: Media | null;
  reminders: number[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
}

interface UpcomingMediaItem {
  id: number;
  title: string;
  overview: string;
  backdrop: string;
  poster: string;
  releaseDate: Date;
  vote_average: number;
  vote_count: number;
  isReminding: boolean;
}

interface UpcomingMediaApiResponse {
  dates: {
    maximum: string;
    minimum: string;
  };
  page: number;
  results: UpcomingMediaItem[];
  total_pages: number;
  total_results: number;
}

export const useMediaStore = defineStore('media', {
  state: (): MediaStoreState => ({
    upcomingMedia: [],
    featuredMedia: null,
    reminders: [],
    loading: false,
    error: null,
    currentPage: 1,
    totalPages: 1,
  }),



  actions: {
    initReminders(): void {
      if (process.client) {
        const stored = localStorage.getItem('soonly-reminders');
        this.reminders = stored ? JSON.parse(stored) : [];
      }
    },

    mapApiResponse(results: UpcomingMediaApiResponse['results']): Media[] {
      return results.map((item) => ({
        id: String(item.id),
        title: item.title,
        overview: item.overview,
        backdrop: item.backdrop,
        poster: item.poster,
        releaseDate: item.releaseDate,
        mediaType: 'movie',
        isReminding: item.isReminding
      }));
    },

    async fetchUpcomingMedia(): Promise<void> {
      const toast = useToast();
      this.loading = true;
      this.error = null;

      try {
        const response = await api.get<UpcomingMediaApiResponse>('/movies/upcoming', {
          params: { page: 1 }
        });

        const mappedMedia = this.mapApiResponse(response.data.results);
        this.upcomingMedia = mappedMedia;
        this.featuredMedia = mappedMedia.length > 0 ? mappedMedia[0] : null;
        this.currentPage = response.data.page;
        this.totalPages = response.data.total_pages;

      } catch (error) {
        toast.error('Erro ao buscar mídias futuras');
        this.handleAxiosError(error, 'Erro ao buscar mídias futuras.');
      } finally {
        this.loading = false;
      }
    },

    async fetchMoreUpcomingMedia(): Promise<void> {
      if (this.currentPage >= this.totalPages || this.loading) {
        return;
      }

      this.loading = true;
      this.error = null;

      try {
        const nextPage = this.currentPage + 1;
        const response = await api.get<UpcomingMediaApiResponse>('/movies/upcoming', {
          params: { page: nextPage }
        });

        const mappedMedia = this.mapApiResponse(response.data.results);
        this.upcomingMedia = [...this.upcomingMedia, ...mappedMedia];
        this.currentPage = response.data.page;
        this.totalPages = response.data.total_pages;

        console.log("Page loaded:", response.data.page, "Total pages:", response.data.total_pages);
      } catch (error) {
        this.handleAxiosError(error, 'Erro ao buscar mais mídias futuras.');
      } finally {
        this.loading = false;
      }
    },


    updateIsReminding(mediaId: number, isReminding: boolean) {
      this.upcomingMedia = this.upcomingMedia.map(media => {
        if (parseInt(media.id) === mediaId) {
          return { ...media, isReminding }
        }
        return media
      })
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
