import 'dotenv/config'
import cluster from 'cluster'
import os from 'os'
import http from 'http'
import { HttpStatus } from './types/statuses.js'

if (cluster.isPrimary) {
  console.log(`Primary PID ${process.pid} is running`)

  const cores = Math.max(os.cpus().length, 2)

  const PORT = Number(process.env['PORT'])
  const HOST = process.env['HOST']
  const DB_PORT = PORT + cores

  cluster.fork({ PORT: DB_PORT, HOST })

  // Fork workers
  const workerPorts: number[] = []
  for (let i = 1; i < cores; i++) {
    const port = PORT + i
    workerPorts.push(port)
    cluster.fork({ PORT: port.toString(), HOST, DB: JSON.stringify({ host: HOST, port: DB_PORT }) })
  }

  let current = 0
  const lbServer = http.createServer((req, res) => {
    const targetPort = workerPorts[current]
    current = (current + 1) % workerPorts.length

    const options = {
      hostname: HOST,
      port: targetPort,
      path: req.url,
      method: req.method,
      headers: req.headers,
    }

    const proxy = http.request(options, proxyRes => {
      res.writeHead(proxyRes.statusCode || HttpStatus.INTERNAL_SERVER_ERROR, proxyRes.headers)
      proxyRes.pipe(res, { end: true })
    })

    req.pipe(proxy, { end: true })

    proxy.on('error', () => {
      res.writeHead(HttpStatus.INTERNAL_SERVER_ERROR)
      res.end('Worker error')
    })
  })

  lbServer.listen(PORT, () => {
    console.log(`Load balancer running on port ${PORT}`)
  })
} else {
  // Server
  await import('./server.js')
}
