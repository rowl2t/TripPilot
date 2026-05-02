# Deploy Guide

## Web/Admin (Vercel)
- Create Vercel projects for `apps/web` and `apps/admin`.
- Build command: `pnpm --filter @trippilot/web build` (or admin)
- Output: framework default
- Required env:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `NEXT_PUBLIC_APP_URL`
  - optional analytics keys

## Worker (Railway baseline)
- Use `apps/worker/Dockerfile`.
- Set env:
  - `SUPABASE_URL`
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `OPENAI_API_KEY`
  - `REDIS_URL` (if Redis queue provider enabled)
- Healthcheck endpoint: `GET /healthz`.
- Ensure SIGTERM graceful shutdown is handled.
