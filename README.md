# TripPilot Monorepo

TripPilot 상용 서비스 개발을 위한 pnpm + Turborepo 기반 모노레포입니다.

## Workspace 구조
- `apps/mobile`: Expo React Native 앱 스캐폴드 + SecureStore 인증 세션
- `apps/web`: Next.js 웹 랜딩/계정 인증 흐름 스캐폴드
- `apps/admin`: 운영자 콘솔(admin guard 골격)
- `apps/worker`: Node.js 비동기 워커
- `packages/api-client`: Supabase typed auth/client helper
- `packages/schemas`: auth/profile/trip/error Zod 스키마
- `packages/*`: 공통 도메인/SDK/설정 모듈
- `supabase/*`: 운영 DB 마이그레이션/시드
- `docs/*`: 제품/아키텍처/DB/Auth/엔지니어링 표준

## 공통 명령
- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`
- `pnpm build`

## Auth 관련 환경변수
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (서버 전용)
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `EXPO_PUBLIC_SUPABASE_URL`
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`

## 다음 단계
1. 각 앱 실 프레임워크 라우터(Expo Router / Next App Router) 연결
2. API 서버 앱 추가 후 service role-only 엔드포인트 구현
3. RevenueCat/Stripe subscription webhook 동기화
