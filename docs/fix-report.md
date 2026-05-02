# Fix Report (Comprehensive Stabilization Pass)

## 1) 구조 분석 결과
전체 레포를 기준으로 이전 단계 산출물을 점검했고, 다음 위험군을 확인했습니다.

- **워크스페이스 TS 경계 문제**: path alias(`@trippilot/*`)를 쓰는 구조에서 package/app `rootDir` 제약이 있으면 교차 import가 쉽게 깨짐.
- **중복/충돌 가능 이름**: 도메인 스키마에서 이름이 겹치면 barrel export에서 충돌 가능.
- **성능/중복 요청**: 모바일 saved-link 생성과 AI 플래닝에서 중복 요청 가능.
- **테스트 공백**: E2E는 skeleton만 존재, CI wiring/실기기 실행은 별도 필요.

## 2) 이번 수정(안전 우선)

### A. 타입 안정성 보강
- `apps/mobile/src/hooks/use-saved-links.ts`의 debounce 유틸을 제네릭 `TResult` 기반으로 교정해 `unknown` 누수/추론 약화를 줄였습니다.

### B. 품질/성능 보강(이전 단계 반영 유지)
- React Query 캐시 정책 튜닝, saved-link debounce, AI 플랜 in-flight dedupe, places query cache를 유지.

### C. 보안/정책 반영 상태 확인
- saved-link metadata sanitize + policy comment 적용 상태 유지.
- privacy/security 문서(SECURITY.md, PRIVACY_ENGINEERING.md) 유지.

## 3) 검증 시도
필수 명령:
- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`
- `pnpm build`

현재 환경에서는 corepack이 `pnpm@10.0.0` 다운로드 시 프록시 터널 403으로 실패하여 실행 불가.

대안 검증:
- `tsc -p packages/api-client/tsconfig.json --noEmit` 실행으로 정적 오류군 확인.
- 확인된 주 오류는 **의존성 미설치**(`vitest`, `zod`, `@supabase/supabase-js` 등)와 연계됨.

## 4) 남은 리스크
1. **의존성 설치 전 CI 신뢰성 검증 불가**
   - pnpm 설치/네트워크 정상화 후 전체 스크립트 재검증 필요.
2. **통합/E2E 실동작 검증 부족**
   - Maestro skeleton은 존재하지만 디바이스/시뮬레이터 기반 실주행 검증 필요.
3. **Worker production queue 미완료**
   - Redis/BullMQ provider는 interface만 준비된 상태로 추후 구현 필요.
