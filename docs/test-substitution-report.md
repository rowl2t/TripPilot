# 대체 검증 보고서

## 1) pnpm 실행 불가 원인
- corepack이 pnpm tarball/metadata를 registry에서 가져오지 못함(Proxy 403 / ENETUNREACH).

## 2) 실제 실행한 명령
- node --version
- npm --version
- corepack --version
- pnpm --version
- yarn --version
- bun --version
- git status --short
- corepack enable
- corepack prepare pnpm@latest --activate
- ./node_modules/.bin/tsc --noEmit
- ./node_modules/.bin/eslint .
- ./node_modules/.bin/vitest run
- ./node_modules/.bin/turbo run build
- ./node_modules/.bin/expo --version

## 3) 실패한 명령과 사유
- pnpm 관련 명령: registry/proxy 네트워크 실패
- eslint: `typescript-eslint` 모듈 해석 실패
- turbo build: 네트워크 연결 실패로 일부 빌드 실패

## 4) 수행한 정적 검증
- env 사용 변수 vs `.env.example` 비교
- secret/service-role 하드코딩 grep
- TODO/FIXME/@ts-ignore/console.log/debugger 패턴 점검
- mock/prod provider 혼재 지점 점검

## 5) 수정한 문제
- 모바일 결제 훅에서 비공개 env(`REVENUECAT_API_KEY`) 사용 제거 → `EXPO_PUBLIC_REVENUECAT_API_KEY` 사용
- monetization query 실패 시 throw 누락 보완
- Profile 화면의 unsafe mock-client 직접 호출 제거 상태 확인

## 6) 남은 로컬 검증 필요 항목
- pnpm lint/typecheck/test/build 전체 통과
- EAS preview 빌드
- Supabase migration reset/적용 검증

## 7) 로컬 실행 명령
- `corepack enable`
- `pnpm install`
- `pnpm lint && pnpm typecheck && pnpm test && pnpm build`

## 8) 잔여 이슈 위험도
- 높음: pnpm 네트워크 이슈로 품질게이트 미완료
- 중간: 일부 기능은 mock/provider fallback 전제
