import axios, { AxiosInstance } from 'axios';
import { TMDBConfig } from '../config/tmdb.config';

export class TMDBService {
  private readonly client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: TMDBConfig.baseURL,
      headers: {
        Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiOWE2MDk3OTIwNTVhN2QwMDhmZTFiNDg3ZWIzZTU4YSIsIm5iZiI6MTc0OTEzMDYyMS44ODksInN1YiI6IjY4NDE5ZDdkZGExMTc0NDk4N2JmMTQ5NiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ._QzRJ5X2lPyXtWXZ_1Y43LGOP0Y7IZwZIn5mkGDCMKE`,
        'Content-Type': 'application/json',
      },
    });
  }

  async searchMovies(query: string) {
    const response = await this.client.get('/search/movie', {
      params: {
        query,
        language: 'en-US',
        include_adult: false,
      },
    });
    return response.data;
  }

  async listMovies() {
    const response = await this.client.get('/movie/popular', {
      params: { language: 'pt-BR' },
    });
    return response.data;
  }
  async upcomingMovies(page: number) {
    const response = await this.client.get('/movie/upcoming', {
      params: { language: 'pt-BR', page: page },
    });

    return response.data;
  }

  async findById(id: string) {
    const response = await this.client.get(`/movie/${id}`, {
      params: { language: 'pt-BR' },
    });
    return response.data;
  }

}
function isSameOrAfter(date1: dayjs.Dayjs, date2: dayjs.Dayjs): boolean {
  return date1.isAfter(date2) || date1.isSame(date2);
}
