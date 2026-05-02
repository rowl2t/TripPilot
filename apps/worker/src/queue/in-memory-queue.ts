import { randomUUID } from 'node:crypto';
import type { QueueJob, QueueProvider } from './types';

export class InMemoryQueueProvider implements QueueProvider {
  private queue: QueueJob[] = [];
  private deadLetterQueue: QueueJob[] = [];
  private seenKeys = new Set<string>();
  private handler?: (job: QueueJob) => Promise<void>;
  private running = false;

  async enqueue(name: QueueJob['name'], payload: unknown, options: { idempotencyKey: string; attempts?: number }) {
    if (this.seenKeys.has(options.idempotencyKey)) {
      return { id: options.idempotencyKey, name, payload, idempotencyKey: options.idempotencyKey, attemptsMade: 0, attemptsMax: options.attempts ?? 3 };
    }
    this.seenKeys.add(options.idempotencyKey);
    const job: QueueJob = { id: randomUUID(), name, payload, idempotencyKey: options.idempotencyKey, attemptsMade: 0, attemptsMax: options.attempts ?? 3 };
    this.queue.push(job);
    return job;
  }

  subscribe(handler: (job: QueueJob) => Promise<void>) { this.handler = handler; }

  async start() {
    this.running = true;
    while (this.running && this.handler) {
      const next = this.queue.shift();
      if (!next) break;
      try {
        await this.handler(next);
      } catch {
        next.attemptsMade += 1;
        if (next.attemptsMade >= next.attemptsMax) this.deadLetterQueue.push(next);
        else {
          const backoffMs = Math.min(5000, 300 * (2 ** (next.attemptsMade - 1)));
          await new Promise((resolve) => setTimeout(resolve, backoffMs));
          this.queue.push(next);
        }
      }
    }
  }

  async stop() { this.running = false; }
  getDeadLetterJobs() { return [...this.deadLetterQueue]; }
}
