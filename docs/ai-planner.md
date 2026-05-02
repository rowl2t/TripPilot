# TripPilot AI Planner Pipeline

## 모델/환경변수
- `OPENAI_API_KEY`
- `OPENAI_TRIP_PLANNER_MODEL` (기본 `gpt-5.5`)
- `OPENAI_FAST_MODEL` (기본 `gpt-5.4-mini`)
- `GOOGLE_PLACES_API_KEY` / `GOOGLE_ROUTES_API_KEY`

## 파이프라인 단계
1. `normalizeTripInput`
2. `destinationResearchPlan`
3. `placeCandidateGeneration` (AI + saved links + Places 결과 병합)
4. `itineraryDraftGeneration`
5. `bookingTaskGeneration`
6. `critiqueAndRepair`
7. `persistPlan` (`itinerary_days`, `itinerary_items`, `trip_place_options`, `booking_tasks`, `ai_runs`)

## Structured Output 보장
- `packages/schemas/src/ai-planner.ts`의 Zod schema로 모든 핵심 출력 검증.
- schema 파싱 실패 시 run status를 `planning_failed`로 기록하고 재시도 큐로 보냄.

## Places/Routes 안전장치
- API key가 없으면 deterministic mock provider 사용.
- key가 있으면 실 서비스 어댑터로 대체 가능.

## idempotency / retry / cost
- `input_hash`(SHA-256) 기반 동일 입력 식별.
- `ai_runs`에 `token_usage`, `cost_estimate`, `prompt_version`, `status` 저장.
- 실패 시 trip status를 `planning_failed`로 업데이트 후 재시도 가능.

## Prompt versioning
- `prompt_version=trip_planner_v1`로 시작.
- 프롬프트 변경 시 버전 증가 + A/B 실험 가능 구조 유지.

## Safety
- 사실성 위험이 있는 장소 정보는 Places 검증 통과 항목만 우선 사용.
- 과밀 일정/예산 초과/동선 문제는 critique 단계에서 검사 및 수정.
