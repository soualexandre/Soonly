import { FastifyInstance } from 'fastify';

import { MovieService } from '../modules/movies/movies.service';
const movieService = new MovieService();

export async function movieRoutes(app: FastifyInstance) {
  app.get('/list', async (request, reply) => {
    try {
      const result = await movieService.list();
      reply.send(result);
    } catch (err) {
      app.log.error(err);
      reply.code(500).send({ error: 'Erro ao buscar filmes no TMDB' });
    }
  });
    
  app.get('/upcoming', async (request, reply) => {
    try {
      const result = await movieService.upcoming();
      reply.send(result);
    } catch (err) {
      app.log.error(err);
      reply.code(500).send({ error: 'Erro ao buscar filmes futuros no TMDB' });
    }
  })
  
  app.get('/findById/:id', async (request, reply) => {
    const { id } = request.params as { id: string }
    try {
      const result = await movieService.findById(id);
      if (!result) {
        return reply.code(404).send({ error: 'Filme não encontrado' });
      }
      reply.send(result);
    } catch (err) {
      app.log.error(err);
      reply.code(500).send({ error: 'Erro ao buscar filme no TMDB' });
    }
  })
}
