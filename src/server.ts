import { buildApp } from './app.js'
import 'dotenv/config'
import type { EnvVars } from './types/interfaces.js'
import { routes } from './routes/product.route.js'
import proxy from '@fastify/http-proxy'

const readDbConfig = (): { host: string; port: number } | undefined => {
  const dbConfigJson = process.env['DB']
  if (dbConfigJson) {
    return JSON.parse(dbConfigJson)
  } else {
    return undefined
  }
}

const start = async (): Promise<void> => {
  const fastify = await buildApp()

  const db = readDbConfig()
  if (db) {
    fastify.register(proxy, {
      upstream: `http://${db.host}:${db.port}`,
      prefix: '/',
    })
  } else {
    fastify.register(routes)
  }

  const envs = fastify.getEnvs<EnvVars>()
  const port = envs.PORT
  const host = envs.HOST

  try {
    await fastify.listen({ port, host })
    fastify.log.info(`${envs.APP_NAME} running on http://${host}:${port}`)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start().catch(err => {
  console.error(err)
  process.exit(1)
})
