# TripPilot Security Review (Step 17)

## 1) Secrets
- No API keys are hardcoded in runtime code; environment variables are used.
- `NEXT_PUBLIC_*` / `EXPO_PUBLIC_*` are treated as public-only values.
- Server secrets (`SUPABASE_SERVICE_ROLE_KEY`, `OPENAI_API_KEY`, `STRIPE_SECRET_KEY`) must remain server-side.

## 2) RLS
- Supabase migration enables RLS on core user data tables (`profiles`, `trips`, `saved_links`, `ai_runs`, `audit_logs`, etc.).
- Owner/member policies and admin gates are defined in migration SQL.
- Reference/public data should remain read-only and non-sensitive.

## 3) API Validation
- New privacy endpoints use Zod validation before DB writes.
- Error responses avoid raw internal stack traces.

## 4) AI Safety
- AI outputs validated with Zod in planner pipeline.
- Saved-link metadata sanitized before analysis; metadata is never treated as instructions.

## 5) Privacy
- Added account deletion/data export request skeletons via auditable requests.
- Recommend automated redaction for logs before central shipping.

## 6) SNS Link Policy
- Explicit policy module prohibits unauthorized scraping/login bypass/DRM bypass.

## 7) Booking Disclaimer
- Product surfaces should show:
  - price/availability can change
  - external booking site redirect
  - affiliate disclosure when applicable

## Residual Risks
- Full dependency install is currently blocked in this environment, so full CI verification is pending.
- Redis/BullMQ production queue provider is still a follow-up implementation.
