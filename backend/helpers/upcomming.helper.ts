import dayjs from 'dayjs';

export function formatUpcomingMovies(movies: any[], remindersIds: Set<string>) {
  const today = dayjs().startOf('day');

  return movies
    .filter((item: any) => {
      if (!item.release_date) return false;
      const releaseDate = dayjs(item.release_date).startOf('day');
      return releaseDate.isSame(today) || releaseDate.isAfter(today);
    })
    .map((item: any) => {
      const itemId = String(item.id);
      const isReminding = remindersIds.has(itemId);

      return {
        id: itemId,
        title: item.title,
        overview: item.overview,
        backdrop: item.backdrop_path ? `https://image.tmdb.org/t/p/w780${item.backdrop_path}` : '',
        poster: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : '',
        releaseDate: item.release_date,
        mediaType: 'movie',
        isReminding,
      };
    });
}
