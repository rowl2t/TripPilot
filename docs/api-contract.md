# API Contract (Internal)

## 목표
mobile/web/admin/worker가 동일한 request/response 계약을 공유하고, 변경 시 파손을 줄인다.

## Versioning
- Internal API Version: `2026-05-02.v1`
- 위치
  - `packages/schemas/src/api-contract.ts` (`API_VERSION`)
  - `packages/api-client/src/types.ts` (`INTERNAL_API_VERSION`)
- Breaking change 규칙
  1. schema 필드 삭제/타입 변경 시 버전 증가
  2. `docs/api-contract.md`에 변경 내역 기록
  3. consumer(apps/worker) 영향 체크 후 배포

## Canonical Resource Schemas
- Trip
- Itinerary
- Place Option
- Saved Link
- Booking Task
- Calendar Event
- Subscription
- Support Ticket

(정의: `packages/schemas/src/api-contract.ts`)

## API Client 계약
- 공통 응답 타입: `ApiResponse<T>`
- 공통 pagination 타입: `Paged<T>` / `Pagination`
- auth-aware wrapper: `AuthAwareClient`
- error normalization: `toApiError`, `normalizeUnknownError`

## 테스트
- schema parse test: `packages/schemas/src/api-contract.test.ts`
- API mock test: support/affiliate/reliability 등 existing tests에서 응답 형태 검증
