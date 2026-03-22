import Fastify, { type FastifyInstance } from 'fastify'
import envPlugin from './plugins/env.js'

export const buildApp = async (): Promise<FastifyInstance> => {
  const app = Fastify({ logger: true })

  await app.register(envPlugin)

  app.setErrorHandler((err, request, reply) => {
    request.log.error(err);

    const statusCode =
      err.statusCode && err.statusCode >= 400
        ? err.statusCode
        : 500;

    reply.status(statusCode).send({
      message:
        statusCode === 500
          ? 'Something went wrong. Please try again later.'
          : err.message,
    });
  });
  return app
}
