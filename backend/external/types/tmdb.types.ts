export interface MovieSearchResult {
  page: number;
  results: {
    id: number;
    title: string;
    overview: string;
    release_date: string;
    poster_path: string | null;
  }[];
  total_pages: number;
  total_results: number;
}
