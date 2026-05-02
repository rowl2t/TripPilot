# 출시 차단 이슈 (Release Blockers)

## Blocker-1: Stripe webhook replay 방지 부재
- 심각도: Critical
- 근거: 서명 검증만으로는 재전송 공격을 완전히 막을 수 없음
- 조치: 이벤트 ID 저장 + idempotency key 검증 + TTL 기반 중복 차단

## Blocker-2: Entitlement 서버 강제(enforcement) 부족
- 심각도: Critical
- 근거: 일부 유료 기능이 클라이언트 상태 의존 시 우회 가능성
- 조치: 서버 API에서 entitlement 확인 후 기능 허용

## Blocker-3: AI 장소 실재성 검증 강제 부족
- 심각도: High
- 근거: hallucinated place가 일정에 포함될 위험
- 조치: Places 검증 실패 시 미확정 배지 + 사용자 승인 전 확정 금지

## Blocker-4: RLS 정책 커버리지 검증 자동화 부족
- 심각도: High
- 근거: 테이블/정책 누락 시 데이터 오노출 위험
- 조치: 테이블별 RLS on/off, 정책 유효성 SQL 테스트 스위트 추가

## Blocker-5: PII 로그 마스킹 강제 규칙 부재
- 심각도: High
- 근거: 운영 로그에 이메일/토큰/개인정보 노출 가능성
- 조치: 공용 logger 마스킹 유틸 및 금칙 패턴 필터 적용
