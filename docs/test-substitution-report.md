# pnpm 불가 환경 대체 검증 보고서 (Codex)

## 1) pnpm 불가 원인
- `pnpm --version` 수행 시 corepack이 `https://registry.npmjs.org/pnpm/-/pnpm-10.0.0.tgz` 다운로드 단계에서 실패했다.
- 오류 핵심: Proxy HTTP Tunneling 403, 요청 취소(UND_ERR_ABORTED).
- 결론: 현재 환경에서는 pnpm bootstrap 자체가 막혀 있어 정식 `pnpm install / pnpm test` 경로 실행 불가.

## 2) 시도한 명령
### 환경 확인
- `node --version`
- `npm --version`
- `corepack --version`
- `pnpm --version`
- `yarn --version`
- `bun --version`
- `git status --short`

### 패키지 매니저/워크스페이스 확인
- `package.json`의 `packageManager`, `scripts` 출력
- `pnpm-lock.yaml` 존재 여부
- `pnpm-workspace.yaml` 존재 여부
- `turbo.json` 존재 여부

### node_modules 직접 실행
- `./node_modules/.bin/tsc --noEmit`
- `./node_modules/.bin/eslint .`
- `./node_modules/.bin/vitest run`
- `./node_modules/.bin/turbo run build`

### 정적 검증
- env 사용 목록 추출 및 `.env.example` 비교
- secret key 사용 위치 점검
- 금지 패턴(`console.log`, `debugger`, `TODO`, `FIXME`, `@ts-ignore`, `eslint-disable`, `any`, `dangerouslySetInnerHTML`, `eval`, `new Function`) 점검
- zod validation 사용 여부 점검
- RLS enable/policy/migration 순서 점검
- mock/provider 분리 상태 점검
- client 코드의 server 전용 import 위험 점검

## 3) 성공한 명령
- `node --version` → `v22.21.1`
- `npm --version` → `11.4.2` (warning 1건)
- `corepack --version` → `0.34.0`
- `yarn --version` → `4.12.0`
- `bun --version` → `1.2.14`
- `git status --short` → 정상 실행
- `./node_modules/.bin/vitest run packages/api-client/src/monetization.test.ts` → 통과

## 4) 실패한 명령
- `pnpm --version`
  - 실패 원인: registry/proxy 403으로 corepack 다운로드 실패
- `./node_modules/.bin/eslint .`
  - 실패 원인: `typescript-eslint` 패키지 해석 실패
- `./node_modules/.bin/vitest run` (전체)
  - 실패 원인: workspace alias(`@trippilot/schemas`) 해석 실패 다수
- `./node_modules/.bin/turbo run build`
  - 실패 원인: ENETUNREACH 네트워크 오류로 일부 빌드 실패
- `./node_modules/.bin/tsc --noEmit`
  - 프로젝트 타겟 없이 help 출력(유효한 전체 타입검사로 보기 어려움)

## 5) 대체 검증 목록
1. env 사용 변수 전수 추출 및 `.env.example` 누락 키 비교
2. client 코드 내 `SUPABASE_SERVICE_ROLE_KEY` 사용 여부 확인
3. client 코드 내 `OPENAI_API_KEY` 직접 사용 여부 확인
4. client 코드 내 RevenueCat secret 직접 사용 여부 확인
5. 정적 위험 패턴(로그/디버거/무시 주석/unsafe API) 점검
6. API mutation zod validation 여부 점검
7. Supabase migration의 RLS enable/policy 점검
8. migration 파일 순서 점검
9. mock/provider 분리 위치 점검
10. mobile/web/client import 경로에서 server-only 위험 확인

## 6) 발견한 문제
### High
1. **`.env.example`에 실제 사용 env 일부 누락**
   - `EXPO_PUBLIC_GOOGLE_MAPS_API_KEY`
   - `EXPO_PUBLIC_REVENUECAT_API_KEY`
   - `EXPO_NOTIFICATIONS_ENABLED`
   - `EXPO_PUSH_TOKEN`
2. **웹훅 검증 로직 변경 이후 테스트 불일치**
   - `packages/api-client/src/monetization.test.ts`가 구 시그니처 기준 검증

### Medium
1. 전체 Vitest 실행 시 workspace alias 해석 오류 다수
2. ESLint 실행 시 `typescript-eslint` 패키지 해석 오류
3. turbo build 네트워크 장애(ENETUNREACH)

## 7) 수정한 문제
1. `.env.example`에 누락된 모바일 env 키 추가
2. `packages/api-client/src/monetization.test.ts`를 신규 웹훅 검증 방식(HMAC+secret) 기준으로 갱신

## 8) 재검증 결과
- 단일 테스트 재실행:
  - `./node_modules/.bin/vitest run packages/api-client/src/monetization.test.ts` 통과
- 정적 재점검:
  - env 누락 항목 반영 확인
  - client/service-role 직접 노출 미발견(워커 서버 코드에서만 사용)

## 9) 로컬에서 반드시 재실행할 명령
1. `corepack enable`
2. `pnpm --version`
3. `pnpm install`
4. `pnpm lint`
5. `pnpm typecheck`
6. `pnpm test`
7. `pnpm build`
8. `pnpm --filter @trippilot/mobile test`
9. `pnpm --filter @trippilot/worker build`

## 10) 테스트 신뢰도 평가
- **현재 신뢰도: 중간 이하 (Low-Medium)**
- 이유:
  - pnpm 경로를 통한 공식 품질게이트 미실행
  - 일부 테스트/빌드가 네트워크/alias 문제로 불완전
  - 다만 정적 검증, 단일 핵심 테스트, 보안/성능/신뢰성 수동 점검은 수행됨
