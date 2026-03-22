import Fastify, { type FastifyInstance } from 'fastify'
import envPlugin from './plugins/env.js'
import { HttpStatus } from './types/statuses.js'

export const buildApp = async (): Promise<FastifyInstance> => {
  const app = Fastify({ logger: true })

  await app.register(envPlugin)

  app.setErrorHandler((err, request, reply) => {
    request.log.error(err)

    const statusCode = err.statusCode && err.statusCode >= HttpStatus.BAD_REQUEST ? err.statusCode : HttpStatus.INTERNAL_SERVER_ERROR

    reply.status(statusCode).send({
      message: statusCode === HttpStatus.INTERNAL_SERVER_ERROR ? 'Something went wrong. Please try again later.' : err.message,
    })
  })
  return app
}
