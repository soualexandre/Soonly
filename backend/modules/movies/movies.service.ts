import { TMDBService } from '../../external/movies.external'

export class MovieService {
    private tmdb = new TMDBService()

    async list() {
        const list = await this.tmdb.listMovies()
        if (!list) {
            throw new Error('Failed to fetch movie list')
        }

        return list;
    }

    async search(query: string) {
        const searchResults = await this.tmdb.searchMovies(query)
        if (!searchResults) {
            throw new Error('Failed to search movies')
        }

        return searchResults;
    }
    async upcoming() {
        const upcomingMovies = await this.tmdb.upcomingMovies()
        if (!upcomingMovies) {
            throw new Error('Failed to fetch upcoming movies')
        }

        return upcomingMovies;
    }

    async findById(id: string) {
        const byId = await this.tmdb.findById(id)
        if (!byId) {
            throw new Error('Failed to fetch movie by ID')
        }
        return byId;
    }

}
