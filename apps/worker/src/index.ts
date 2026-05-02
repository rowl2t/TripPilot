import { createServer } from 'node:http';

import { InMemoryQueueProvider, createProducer, runWorker } from './queue';
import { createNoopDbAdapter } from './db/ops';

export const queueProvider = new InMemoryQueueProvider();
export const producer = createProducer(queueProvider);

export const startWorker = async () => {
  await runWorker(queueProvider, createNoopDbAdapter());
};

export const startHealthcheckServer = (port = Number(process.env.PORT ?? 8080)) => {
  const server = createServer((req, res) => {
    if (req.url === '/healthz') {
      res.writeHead(200, { 'content-type': 'application/json' });
      res.end(JSON.stringify({ ok: true, service: 'worker' }));
      return;
    }
    res.writeHead(404);
    res.end();
  });
  server.listen(port);
  return server;
};

const server = startHealthcheckServer();
void startWorker();

process.on('SIGTERM', async () => {
  await queueProvider.stop();
  server.close();
});
