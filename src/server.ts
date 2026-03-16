import { buildApp } from './app'
import 'dotenv/config'
import type { EnvVars } from './types/interfaces'


const start = async () => {
  const app = await buildApp()

  try {
    const envs = app.getEnvs<EnvVars>();
    const port = envs.PORT;
    const host = envs.HOST;

    await app.listen({ port, host })

    console.log(`${envs.APP_NAME} running on http://${host}:${port}`)
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

start()
