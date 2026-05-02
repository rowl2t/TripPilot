# TripPilot Auth & Authorization

## 목표
- Supabase Auth를 모바일/웹 공통 인증원으로 사용
- RLS 전제 하에 클라이언트 접근(anon key)과 서버 접근(service role)을 분리

## 구성
- `packages/api-client`
  - browser/mobile client factory
  - server(service role) client factory
  - auth helper(sign in/up, sign out, refresh)
  - typed API response/error wrapper
- `apps/mobile`
  - Expo SecureStore 기반 세션 저장
  - 보호 라우트 계산(`resolveMobileRoute`)
- `apps/web`
  - 퍼블릭 랜딩 + 인증 필요 account 라우트 분리
  - auth callback 해시 파서
- `apps/admin`
  - admin guard 골격(클레임 role 또는 profile flag 확장 가능)

## 보안 원칙
1. `SUPABASE_SERVICE_ROLE_KEY`는 서버/워커에서만 사용
2. 모바일/웹은 `ANON KEY`만 사용
3. RLS 우회 작업은 API/worker에서 service role로 수행
4. auth payload는 Zod 스키마로 검증

## 라우팅 플로우
- 로그인 전: mobile `/auth/sign-in`, web landing(`/`)
- 로그인 후 온보딩 미완료: mobile `/onboarding`
- 로그인 후 온보딩 완료: mobile `/trips`, web `/account/*`

## 테스트
- `packages/api-client/src/auth.test.ts`에서 validation/refresh helper 단위 테스트 포함
