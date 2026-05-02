import { describe, expect, it } from 'vitest';
import { InMemoryQueueProvider } from './in-memory-queue';
import { runWorker } from './worker-runtime';
import { createNoopDbAdapter } from '../db/ops';

describe('worker runtime', () => {
  it('retries and sends to dead letter queue', async () => {
    const queue = new InMemoryQueueProvider();
    const db = createNoopDbAdapter();

    await queue.enqueue('generate_trip_plan', { tripId: 'bad', userId: 'bad' }, { idempotencyKey: 'k1', attempts: 2 });
    await runWorker(queue, db);

    expect(queue.getDeadLetterJobs()).toHaveLength(1);
  });
});
