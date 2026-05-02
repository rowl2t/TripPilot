# Admin Operations (Step 15)

## Scope
TripPilot admin console server-side operations for production-like operations.

## Features
- Dashboard aggregates:
  - Total users (`profiles`)
  - Total trips (`trips`)
  - Total AI runs (`ai_runs`)
  - Failed jobs (`ai_runs.status = failed`)
  - Subscription status summary (`subscriptions.status`)
- AI Runs:
  - list status/model/token usage/error
  - retry failed runs (`status -> queued`)
- Trips:
  - list minimal fields: `id`, `owner_id`, `status`, `created_at`
- Saved Links:
  - list failed analysis rows
  - retry analysis (`analysis_status -> queued`)
- Support:
  - support thread list contract (`support_threads` table expected)
- Audit Logs:
  - list logs
  - write every admin action via `recordAuditLog`

## Security
- `canAccessAdmin` / `assertAdminAccess` enforces authenticated admin-only access.
- Access accepts either JWT role `admin` or `profileIsAdmin=true`.
- Service role usage stays server-side only (use `createSupabaseServerClient`).
- Admin actions should call `recordAuditLog` consistently.

## Monitoring
- `initSentry`: DSN missing => noop `captureException`.
- `initPostHog`: API key missing => noop `capture`.
- `logger`: JSON structured logs with timestamp/level/message.
- `logWorkerJobFailure`: standardized worker failure logging.

## Required env
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SENTRY_DSN` (optional)
- `POSTHOG_API_KEY` (optional)
