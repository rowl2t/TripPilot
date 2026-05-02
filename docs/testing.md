# Testing & Quality Plan (Step 18)

## Added/updated tests
- Unit:
  - `apps/worker/src/saved-links/policy.test.ts` (prompt-injection sanitization)
  - `packages/api-client/src/services/usage-limit.test.ts` (usage limit guard)
  - existing planner/affiliate tests retained.
- E2E skeleton:
  - `apps/mobile/e2e/maestro-onboarding-trip-flow.yaml`.

## Quality improvements
- Query cache policy tuned (`staleTime`, `gcTime`, retries, focus refetch off).
- Saved link creation mutation debounced to reduce duplicate submissions.
- AI planner request de-duplication via input hash cache.
- Places search result cache added to reduce repeated provider calls.

## Performance safeguards
- TanStack Query default cache tuned for mobile.
- AI duplicate generation prevention with in-flight cache.
- Places API query cache per query string.

## Pending
- Full lint/typecheck/test/build blocked by environment-level pnpm download issue.
- After dependency install in CI/dev machine, run:
  - `pnpm lint`
  - `pnpm typecheck`
  - `pnpm test`
  - `pnpm build`
