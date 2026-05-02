# AI 비용 최종 감사 보고서

## 요약
- 모델 라우팅에서 fast/quality 분리가 존재함.
- `ai_runs`에 `cost_estimate` 기록 구조 존재.
- 중복 regenerate 방지를 위해 동일 payload queued/running 중복 생성 차단 로직을 추가했다.

## 1) AI Cost 점검 결과
- gpt-5.5 사용 범위: 최종 itinerary/critique 단계 위주로 제한됨.
- fast model routing: normalize/extract 단계는 fast 모델 사용.
- input_hash cache: regenerate 요청 시 payload 해시를 사용.
- duplicate regenerate 방지: 동일 trip/scope/hash + queued/running이면 재삽입 차단(이번 반영).
- monthly usage limit: `enforceUsageLimit`로 월 한도 확인.
- ai_runs cost_estimate 기록: planner job insert 시 기록.

## 남은 개선(모니터링/추가개발)
- 프롬프트 토큰 상한/압축 전략 고도화
- 사용자별/기능별 월 비용 대시보드
- 고비용 요청 자동 샘플링 알림
