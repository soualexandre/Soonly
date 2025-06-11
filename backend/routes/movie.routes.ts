import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

import { MovieService } from '../modules/movies/movies.service';
const movieService = new MovieService();

interface UpcomingQuery {
  page?: string;
}

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

  app.get('/upcoming', async (request: FastifyRequest<{ Querystring: UpcomingQuery }>, reply: FastifyReply) => {
    try {
      const pageRaw = request.query.page;
      const page = pageRaw ? parseInt(pageRaw, 10) : 1;

      const safePage = (Number.isInteger(page) && page > 0) ? page : 1;

      const result = await movieService.upcoming(safePage);

      reply.send(result);
    } catch (err) {
      app.log.error(err);
      reply.code(500).send({ error: 'Erro ao buscar filmes futuros no TMDB' });
    }
  });

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
