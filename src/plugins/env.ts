import fp from 'fastify-plugin'
import fastifyEnv, { FastifyEnvOptions } from '@fastify/env'
import { FastifyInstance, FastifyPluginAsync } from 'fastify'

const schema = {
  type: 'object',
  required: ['PORT', 'HOST', 'APP_NAME'],
  properties: {
    PORT: { type: 'number', default: 4000 },
    HOST: { type: 'string', default: '0.0.0.0' },
    APP_NAME: { type: 'string' },
  },
}

const options: FastifyEnvOptions = {
  schema,
  dotenv: true,
  data: process.env
}

const envPlugin: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  await fastify.register(fastifyEnv, options)
}

export default fp(envPlugin)
