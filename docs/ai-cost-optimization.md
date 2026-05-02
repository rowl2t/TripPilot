# AI Cost Optimization

## 목표
- `gpt-5.5`는 최종 일정 생성/critique-repair에만 사용.
- 입력 정규화/링크 요약/후보 추출은 fast model로 분리.
- 캐시와 사용량 제한으로 운영 비용 절감.

## Model Routing
- 구현: `packages/ai/src/model-router.ts`
- fast task: `normalize_input`, `link_metadata_summary`, `candidate_extraction`
- quality task: `final_itinerary`, `critique_repair`

## Caching
- Trip input hash 기반 결과 캐시 (`planCache`)
- Places 검색 캐시 (`placesCache`)
- Saved link/스타일 분석 캐시 (`linkAnalysisCache`)
- 동일 key 중복 분석 방지

## Cost Tracking
- planner 결과에 `tokenUsage` + `estimatedCost` 유지
- DB `ai_runs`는 `token_usage`/`cost_estimate` 저장을 전제로 함
- `packages/api-client/src/services/usage-limit.ts`에 월간 비용 추정 helper 추가

## Limits
- 무료 사용자 월간 제한
- 과도한 입력 길이 제한
- 재생성 요청 제한
- 사용자 단위 rate limit 보호 구조

## Admin Visibility
- `apps/admin/src/ops/admin-ops.ts`
  - 대시보드에 `aiCostEstimateTotal`, `aiFailureRate` 제공
  - `listAiRuns`에 `cost_estimate` 포함

## 테스트
- `packages/ai/src/model-router.test.ts`
- `packages/ai/src/pipeline/planner.test.ts` 캐시 hit/miss 확인
- `packages/api-client/src/services/usage-limit.test.ts`
