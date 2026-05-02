import type { QueueProvider } from './types';
import type { JobName } from './types';

export const createProducer = (queue: QueueProvider) => ({
  enqueueJob: async (name: JobName, payload: unknown, idempotencyKey: string) => queue.enqueue(name, payload, { idempotencyKey, attempts: 3 })
});
