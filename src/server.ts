import { buildApp } from './app'
import 'dotenv/config'
import type { EnvVars } from './types/interfaces'
import { productRoutes } from './routes/product.route'


const start = async () => {
  const fastify = await buildApp()

  fastify.register(productRoutes);

  const envs = fastify.getEnvs<EnvVars>();
  const port = envs.PORT;
  const host = envs.HOST;

  try {
    await fastify.listen({ port, host });
    fastify.log.info(`${envs.APP_NAME} running on http://${host}:${port}`);
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()
