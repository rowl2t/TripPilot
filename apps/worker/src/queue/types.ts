export type JobName =
  | 'generate_trip_plan'
  | 'regenerate_trip_plan'
  | 'analyze_saved_link'
  | 'create_booking_tasks'
  | 'sync_calendar_events'
  | 'send_invite_email'
  | 'refresh_affiliate_links';

export interface EnqueueOptions {
  idempotencyKey: string;
  attempts?: number;
}

export interface QueueJob<TPayload = unknown> {
  id: string;
  name: JobName;
  payload: TPayload;
  idempotencyKey: string;
  attemptsMade: number;
  attemptsMax: number;
}

export interface QueueProvider {
  enqueue: <TPayload>(name: JobName, payload: TPayload, options: EnqueueOptions) => Promise<QueueJob<TPayload>>;
  subscribe: (handler: (job: QueueJob) => Promise<void>) => void;
  start: () => Promise<void>;
  stop: () => Promise<void>;
  getDeadLetterJobs: () => QueueJob[];
}
