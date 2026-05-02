# TripPilot Privacy Engineering (Step 17)

## Data minimization
- Collect only trip-planning-essential data (destination, dates, traveler/budget preferences).
- Saved link analysis stores minimal metadata and derived candidates.

## Logging guidance
- Avoid storing direct PII in logs.
- Keep audit trail semantic (`action`, `target_type`, `target_id`) over raw payload dumps.

## User rights skeleton
- `requestAccountDeletion` records deletion requests for controlled processing.
- `requestDataExport` records export requests for controlled processing.

## Third-party policies
- Link analysis relies on public/user-provided metadata.
- No credentialed scraping or policy-bypassing mechanisms.

## Security controls map
- Zod input validation
- RLS at DB layer
- role-gated admin access
- server-only secrets
