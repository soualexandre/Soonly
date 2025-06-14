export interface Media {
  id: string;
  title: string;
  overview: string;
  backdrop: string;
  poster: string;
  releaseDate: Date;
  mediaType: 'movie' | 'tv';
  isReminding: boolean;
}

export interface MediaStoreState {
  upcomingMedia: Media[];
  featuredMedia: Media | null;
  reminders: string[];
}