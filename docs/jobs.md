# Jobs 운영 가이드

## 개요
워커는 큐 기반으로 비동기 작업을 처리합니다.

## 주요 작업
- 여행 일정 생성
- 저장 링크 분석
- 알림/후속 처리

## 운영 체크
- pending/failed 수 모니터링
- 실패 작업 재시도
- DLQ 누적 여부 확인

## 로컬 테스트
```bash
pnpm --filter @trippilot/worker test
```
