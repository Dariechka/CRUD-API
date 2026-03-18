import Fastify, { type FastifyInstance } from 'fastify'
import envPlugin from './plugins/env'

export const buildApp = async (): Promise<FastifyInstance> => {
  const app = Fastify({ logger: true })

  await app.register(envPlugin)

  return app
}
