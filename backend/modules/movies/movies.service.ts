import { formatUpcomingMovies } from '../../helpers/upcomming.helper'
import { TMDBService } from '../../external/movies.external'
import { CacheService } from '../../utils/cache.utils'
import { ReminderService } from '../reminders/reminders.service'
import { RemindersRepository } from '../reminders/reminders.repository'
import { UserRepository } from '../auth/auth.repository'
import dayjs from 'dayjs';

const userRepository = new UserRepository();
const remindersRepository = new RemindersRepository()


function isSameOrAfter(date1: dayjs.Dayjs, date2: dayjs.Dayjs): boolean {
  return date1.isAfter(date2) || date1.isSame(date2);
}

export class MovieService {
  private tmdb = new TMDBService()
  private cache = new CacheService()
  private reminderService = new ReminderService(remindersRepository, userRepository)

  async list() {
    return this.cache.fetch('movies:list', 3600, async () => {
      const list = await this.tmdb.listMovies()
      if (!list) throw new Error('Failed to fetch movie list')
      return list
    })
  }

  async search(query: string) {
    return this.cache.fetch(`movies:search:${query}`, 3600, async () => {
      const searchResults = await this.tmdb.searchMovies(query)
      if (!searchResults) throw new Error('Failed to search movies')
      return searchResults
    })
  }

  async upcoming(page: number) {
    return this.cache.fetch(`movies:upcoming:${page}`, 30, async () => {
      const upcoming = await this.tmdb.upcomingMovies(page);
      if (!upcoming) throw new Error('Failed to fetch upcoming movies');

      const remindersData = await this.reminderService.list();
      const reminderIds = new Set(remindersData.map((item: any) => String(item.movieId)));

      const formatted = formatUpcomingMovies(upcoming.results, reminderIds);

      return {
        page: upcoming.page,
        totalPages: upcoming.totalPages,
        totalResults: upcoming.totalResults,
        results: formatted,
      };
    });
  }

  async findById(id: string) {
    return this.cache.fetch(`movies:id:${id}`, 3600, async () => {
      const byId = await this.tmdb.findById(id)
      if (!byId) throw new Error('Failed to fetch movie by ID')
      return byId
    })
  }
}
