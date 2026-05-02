# Notifications & Reminder System

## 구현 범위
- 모바일 알림 권한 요청 흐름
- 예약 리마인더(7일/3일/당일)
- 여행 리마인더(14일/7일/1일/당일)
- 사용자 설정(전체/예약/여행/마케팅)
- 중복 발송 방지(idempotencyKey)

## 구성
- `apps/mobile/src/notifications/provider.ts`
  - Expo provider (env 기반)
  - Mock provider (UI/테스트용)
- `apps/mobile/src/notifications/reminders.ts`
  - booking_tasks due_date 기반 payload 생성
  - trip 시작일 기반 payload 생성
- `apps/mobile/src/notifications/service.ts`
  - 권한 확인 후 reminder 동기화

## 권한 거절 처리
- 권한 거절 시 푸시 발송은 생략하고 앱 내 리마인더 설정만 유지.

## 테스트
- `apps/mobile/src/notifications/service.test.ts`에서 mock provider 기반 동작 검증.
