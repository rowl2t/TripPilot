# 신뢰성(외부 API/워커) 최종 감사 보고서

## 요약
- 워커 재시도(backoff) 로직을 보강했다.
- 장애 시 UX 저하(Degradation) 안내 경로는 존재하나, 운영 알림/자동복구는 추가 필요.

## 1) Worker Reliability
- retry with backoff: 인메모리 큐 재시도 시 지수 백오프 추가(최대 5초).
- idempotency key: 큐 enqueue에서 중복 키 차단 확인.
- dead letter handling: 재시도 초과 시 dead letter 적재 확인.
- failed job admin visibility: 감사로그/상태 업데이트 경로 존재.
- graceful shutdown: stop 플래그는 있으나 in-flight drain 고도화 필요.

## 2) External API Failure
- OpenAI/Places/RevenueCat/Supabase/Email 실패 시 fallback/오류 메시지 경로 일부 존재.
- Redis 실패: in-memory 대체 또는 지연 시나리오 문서화 필요.

## 3) UX Degradation
- 장애 시 기존 여행 조회 가능 여부: query 캐시/오류 처리 경로 존재.
- 새 생성 실패 시 입력 보존: 화면별 일관성 점검 필요(수동 QA 권장).
- pending/retry 상태 표시: status banner/분석 상태 표기 존재.
- 사용자 친화적 에러 메시지: 일부 적용, 전 구간 통일 필요.

## 남은 release 주의사항
- 외부 API 장애 주입 테스트(chaos) 자동화 필요
- worker dead letter 알림(Slack/Email) 연동 필요
