# TripPilot Monorepo

TripPilot 상용 서비스 개발을 위한 pnpm + Turborepo 기반 모노레포입니다.

## Workspace 구조
- `apps/mobile`: Expo React Native 앱
- `apps/web`: Next.js 웹 랜딩/정책 페이지
- `apps/admin`: 운영자 콘솔 레이어
- `apps/worker`: 비동기 작업 워커 + healthcheck
- `packages/api-client`: Supabase typed API helpers
- `packages/ai`: itinerary planning pipeline
- `packages/schemas`: Zod 도메인 스키마
- `supabase/*`: DB migration/seed/RLS
- `docs/*`: 운영/보안/배포/출시 문서

## 공통 명령
- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`
- `pnpm build`

## 출시 준비 문서
- `docs/release-checklist.md`
- `docs/store-listing.md`
- `docs/app-review-notes.md`
- `docs/final-audit.md`
- `docs/deploy.md`
- `docs/supabase-ops.md`

## 핵심 환경변수
- Supabase: `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- Mobile public: `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY`
- Web public: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- AI/3rd-party: `OPENAI_API_KEY`, `GOOGLE_PLACES_API_KEY`, `STRIPE_SECRET_KEY`, `REVENUECAT_API_KEY`
- EAS: `EXPO_EAS_PROJECT_ID`, `EXPO_IOS_BUNDLE_ID`, `EXPO_ANDROID_PACKAGE`
