import { MovieService } from './movies.service'
import { TMDBService } from '../../external/movies.external'
import { CacheService } from '../../utils/cache.utils'

jest.mock('../../external/movies.external')
jest.mock('../../utils/cache.utils')

describe('MovieService', () => {
  let movieService: MovieService
  let tmdbMock: jest.Mocked<TMDBService>
  let cacheMock: jest.Mocked<CacheService>

  const mockMoviesList = [{ id: '1', title: 'Movie 1' }]
  const mockSearchResults = [{ id: '2', title: 'Search Result' }]
  const mockUpcoming = [{ id: '3', title: 'Upcoming Movie' }]
  const mockMovieById = { id: '1', title: 'Movie 1' }

  beforeEach(() => {
    tmdbMock = new TMDBService() as jest.Mocked<TMDBService>
    cacheMock = new CacheService() as jest.Mocked<CacheService>

    movieService = new MovieService()

    // Override the private properties to mocks
    // @ts-ignore
    movieService.tmdb = tmdbMock
    // @ts-ignore
    movieService.cache = cacheMock

    jest.clearAllMocks()
  })

  describe('list', () => {
    it('deve retornar a lista de filmes com sucesso', async () => {
      cacheMock.fetch.mockImplementation(async (_, __, cb) => cb())
      tmdbMock.listMovies.mockResolvedValue(mockMoviesList)

      const result = await movieService.list()

      expect(cacheMock.fetch).toHaveBeenCalledWith('movies:list', 3600, expect.any(Function))
      expect(tmdbMock.listMovies).toHaveBeenCalled()
      expect(result).toEqual(mockMoviesList)
    })

    it('deve lançar erro se falhar ao buscar a lista de filmes', async () => {
      cacheMock.fetch.mockImplementation(async (_, __, cb) => cb())
      tmdbMock.listMovies.mockResolvedValue(null)

      await expect(movieService.list()).rejects.toThrow('Failed to fetch movie list')
      expect(tmdbMock.listMovies).toHaveBeenCalled()
    })
  })

  describe('search', () => {
    const query = 'star wars'

    it('deve retornar resultados da busca com sucesso', async () => {
      cacheMock.fetch.mockImplementation(async (_, __, cb) => cb())
      tmdbMock.searchMovies.mockResolvedValue(mockSearchResults)

      const result = await movieService.search(query)

      expect(cacheMock.fetch).toHaveBeenCalledWith(`movies:search:${query}`, 3600, expect.any(Function))
      expect(tmdbMock.searchMovies).toHaveBeenCalledWith(query)
      expect(result).toEqual(mockSearchResults)
    })

    it('deve lançar erro se falhar ao buscar os resultados', async () => {
      cacheMock.fetch.mockImplementation(async (_, __, cb) => cb())
      tmdbMock.searchMovies.mockResolvedValue(null)

      await expect(movieService.search(query)).rejects.toThrow('Failed to search movies')
      expect(tmdbMock.searchMovies).toHaveBeenCalledWith(query)
    })
  })

  describe('upcoming', () => {
    it('deve retornar filmes futuros com sucesso', async () => {
      cacheMock.fetch.mockImplementation(async (_, __, cb) => cb())
      tmdbMock.upcomingMovies.mockResolvedValue(mockUpcoming)

      const result = await movieService.upcoming()

      expect(cacheMock.fetch).toHaveBeenCalledWith('movies:upcoming', 3600, expect.any(Function))
      expect(tmdbMock.upcomingMovies).toHaveBeenCalled()
      expect(result).toEqual(mockUpcoming)
    })

    it('deve lançar erro se falhar ao buscar filmes futuros', async () => {
      cacheMock.fetch.mockImplementation(async (_, __, cb) => cb())
      tmdbMock.upcomingMovies.mockResolvedValue(null)

      await expect(movieService.upcoming()).rejects.toThrow('Failed to fetch upcoming movies')
      expect(tmdbMock.upcomingMovies).toHaveBeenCalled()
    })
  })

  describe('findById', () => {
    const movieId = '123'

    it('deve retornar filme pelo id com sucesso', async () => {
      cacheMock.fetch.mockImplementation(async (_, __, cb) => cb())
      tmdbMock.findById.mockResolvedValue(mockMovieById)

      const result = await movieService.findById(movieId)

      expect(cacheMock.fetch).toHaveBeenCalledWith(`movies:id:${movieId}`, 3600, expect.any(Function))
      expect(tmdbMock.findById).toHaveBeenCalledWith(movieId)
      expect(result).toEqual(mockMovieById)
    })

    it('deve lançar erro se falhar ao buscar filme pelo id', async () => {
      cacheMock.fetch.mockImplementation(async (_, __, cb) => cb())
      tmdbMock.findById.mockResolvedValue(null)

      await expect(movieService.findById(movieId)).rejects.toThrow('Failed to fetch movie by ID')
      expect(tmdbMock.findById).toHaveBeenCalledWith(movieId)
    })
  })
})
