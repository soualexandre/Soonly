import { TMDBService } from '../../external/movies.external'
import { CacheService } from '../../utils/cache.utils'

export class MovieService {
  private tmdb = new TMDBService()
  private cache = new CacheService() 

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

  async upcoming() {
    return this.cache.fetch('movies:upcoming', 3600, async () => {
      const upcoming = await this.tmdb.upcomingMovies()
      if (!upcoming) throw new Error('Failed to fetch upcoming movies')
      return upcoming
    })
  }

  async findById(id: string) {
    return this.cache.fetch(`movies:id:${id}`, 3600, async () => {
      const byId = await this.tmdb.findById(id)
      if (!byId) throw new Error('Failed to fetch movie by ID')
      return byId
    })
  }
}
