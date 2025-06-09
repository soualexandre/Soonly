export interface Media {
  id: string;
  title: string;
  backdrop: string;
  poster: string;
  backdrop_path: string;
  poster_path: string;
  overview: string;
  releaseDate: string;
  mediaType: 'movie' | 'tv';
}

export interface MediaStoreState {
  upcomingMedia: Media[];
  featuredMedia: Media | null;
  reminders: string[];
}