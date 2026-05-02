import type { QueueProvider, QueueJob } from './types';
import type { WorkerDbAdapter } from '../db/ops';
import { jobRegistry } from '../jobs/registry';

export const runWorker = async (queue: QueueProvider, db: WorkerDbAdapter) => {
  queue.subscribe(async (job: QueueJob) => {
    try {
      await jobRegistry[job.name](job.payload, { db });
      await db.updateAiRun({ idempotencyKey: job.idempotencyKey, status: 'success' });
      await db.insertAuditLog({ action: 'worker_job_succeeded', targetType: 'job', targetId: job.id, metadata: { name: job.name } });
    } catch (error) {
      await db.updateAiRun({ idempotencyKey: job.idempotencyKey, status: 'failed', error: error instanceof Error ? error.message : String(error) });
      await db.insertAuditLog({ action: 'worker_job_failed', targetType: 'job', targetId: job.id, metadata: { name: job.name } });
      throw error;
    }
  });
  await queue.start();
};
