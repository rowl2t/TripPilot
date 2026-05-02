# Architecture Audit

## Scope
Monorepo responsibility boundaries, dependency direction, strict typing posture, and production safety assumptions.

## Findings and fixes

### 1) App responsibility leakage (mobile trip detail)
- **Issue**: `globalThis.__inviteEmail` was used as temporary cross-render storage in `apps/mobile/app/trips/[id]/index.tsx`.
- **Risk**: hidden global mutable state, difficult debugging, potential side effects.
- **Fix**: replaced with local React state (`useState`) and explicit input binding.

### 2) Accessibility/UX consistency
- **Issue**: invite email input lacked explicit accessibility label.
- **Fix**: added `accessibilityLabel="invite-email"` and controlled input value.

### 3) AI prompt versioning
- **Issue**: planner prompts were raw strings without version tags.
- **Fix**: introduced `PROMPT_VERSION` constant and embedded version tag in AI prompts.

## Dependency direction review
- apps -> packages direction is preserved.
- No app-specific imports were introduced in packages during this audit pass.

## Schema and validation review
- AI output still parsed by Zod schemas before returning planner output.
- Privacy/security policy docs remain in place.

## Remaining risks
- Full static/runtime verification remains blocked in this environment due to pnpm bootstrap network failure.
- Some `as any` usages remain in test mocks and should be progressively replaced with typed factories.
