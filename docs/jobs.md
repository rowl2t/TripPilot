# Worker Jobs (Step 16)

## Queue
- `QueueProvider` abstraction added.
- Default: `InMemoryQueueProvider` for dev/test.
- Supports idempotency key, retry attempts, and dead-letter queue.

## Job types
1. `generate_trip_plan`
2. `regenerate_trip_plan`
3. `analyze_saved_link`
4. `create_booking_tasks`
5. `sync_calendar_events`
6. `send_invite_email`
7. `refresh_affiliate_links`

## Reliability
- Payload validated with Zod before job logic.
- Retry on failure until `attemptsMax`.
- Failures move to DLQ.
- Job result/error writes into DB adapter (`ai_runs`, `saved_links`, `trips`, `audit_logs` hooks).

## Running
- `startWorker()` boots worker loop.
- Producer: `producer.enqueueJob(name, payload, idempotencyKey)`.
- Graceful shutdown on `SIGTERM`.

## Next production step
- Add BullMQ/Redis provider implementing same `QueueProvider` interface using:
  - `REDIS_HOST`
  - `REDIS_PORT`
  - optional `REDIS_PASSWORD`
