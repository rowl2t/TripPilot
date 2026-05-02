# 로컬 검증 가이드

## 필수 명령
- `corepack enable`
- `pnpm install`
- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`
- `pnpm build`
- `pnpm --filter mobile test`
- `pnpm --filter web build`
- `pnpm --filter admin build`
- `pnpm --filter worker build`

## DB / 마이그레이션
- `supabase db reset`
- `supabase migration up`

## EAS
- `eas build --profile preview`

## 필요한 환경변수(요약)
- Supabase: URL / ANON / SERVICE_ROLE
- OpenAI: API key / model
- Google Places/Routes key
- RevenueCat key
- Resend key
- Stripe key
