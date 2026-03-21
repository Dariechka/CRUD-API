import 'dotenv/config'
import cluster from 'cluster'
import os from 'os'
import http from 'http'

const PORT = Number(process.env['PORT']);
const HOST = process.env['HOST'];

const cpuCores = Math.max(os.cpus().length, 2);

if (cluster.isPrimary) {
  console.log(`Primary PID ${process.pid} is running`);

  // Fork workers
  const workerPorts: number[] = [];
  for (let i = 1; i < cpuCores; i++) {
    const port = PORT + i;
    workerPorts.push(port);
    cluster.fork({ PORT: port.toString(), HOST });
  }

  let current = 0;
  const lbServer = http.createServer((req, res) => {
    const targetPort = workerPorts[current];
    current = (current + 1) % workerPorts.length;

    const options = {
      hostname: HOST,
      port: targetPort,
      path: req.url,
      method: req.method,
      headers: req.headers,
    };

    const proxy = http.request(options, (proxyRes) => {
      res.writeHead(proxyRes.statusCode || 500, proxyRes.headers);
      proxyRes.pipe(res, { end: true });
    });

    req.pipe(proxy, { end: true });

    proxy.on("error", (err) => {
      res.writeHead(500);
      res.end("Worker error");
    });
  });

  lbServer.listen(PORT, () => {
    console.log(`Load balancer running on port ${PORT}`);
  });
} else {
  // Server
  import('./server.js');
}
