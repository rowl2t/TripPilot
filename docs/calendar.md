# Calendar Feature

## 제공 기능
- 앱 내 Calendar 탭 리스트 뷰
- itinerary_items + booking_tasks 기반 calendar_events 생성
- 중복 생성 방지(제목+시작시각 기준)
- ICS 텍스트 export

## 어댑터
- Google Calendar adapter (`apps/worker/src/calendar/google-adapter.ts`)
  - credentials 없으면 mock externalEventId 반환
- Apple Calendar
  - 현재 EventKit 직접연동 대신 ICS export 우선
  - 추후 native module로 확장 가능하도록 interface 분리

## Reminder
- booking due_date 기준 60분/30분 전 payload 생성
- 추후 push worker + calendar_events 동기화 예정

## 보안
- OAuth client id/secret/refresh token은 env로만 주입
- 앱 클라이언트에 service role / secret 노출 금지
