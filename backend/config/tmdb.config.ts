export const TMDBConfig = {
  baseURL: 'https://api.themoviedb.org/3',
  apiKey: process.env.API_KEY_TMDB as string,
  accessToken: process.env.ACCESS_TOKEN_TMDB as string,
};
