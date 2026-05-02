# Reliability & Graceful Degradation

## 목표
외부 서비스(OpenAI, Places, RevenueCat, Supabase, Redis/Worker) 장애 시 앱 전체가 깨지지 않고 핵심 흐름을 유지.

## 공통 전략
- provider별 timeout (`withTimeout`)
- retry with backoff (`withRetryBackoff`)
- simple circuit breaker (`createCircuitBreaker`)
- 상태 배너(`StatusBanner`)로 사용자 안내

## 시나리오 대응
1. **OpenAI 장애**
   - 기존 일정 조회 유지
   - 새 생성은 대기/재시도 안내
   - 사용자 입력은 draft에 보존
2. **Places 장애**
   - AI 후보 표시 + 검증 필요 안내
   - 추후 재검증 가능
3. **RevenueCat 장애**
   - 최근 entitlement cache 사용
   - 실패 안내 메시지 제공
4. **Redis/Worker 장애**
   - pending 유지 + 재시도 버튼 안내
   - admin failed job 확인
5. **Supabase 일시 오류**
   - 사용자 친화 오류 메시지
   - 재시도 UX 노출

## 구현 위치
- `packages/api-client/src/reliability.ts`
- `packages/api-client/src/monetization.ts` (entitlement cache fallback)
- `apps/mobile/src/components/StatusBanner.tsx`
- `apps/admin/src/ops/admin-ops.ts` (`getProviderHealth`)

## 테스트
- provider failure mock 기반 reliability helper 테스트
