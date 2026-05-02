# Support & Feedback

## 목표
- 출시 후 사용자 문제를 빠르게 파악
- AI 일정 품질 피드백 수집 및 개선 루프 확보

## 앱 기능
- Profile > Support & Feedback에서 문의 제출
  - 유형: 앱 오류 / 결제·구독 / AI 일정 품질 / 예약 링크 문제 / 계정·개인정보 / 기타
  - 제목, 내용, 관련 trip, 스크린샷 URL(첨부 구조)
- AI 일정 피드백 제출
  - itinerary 만족도
  - 장소 추천 품질
  - 예약 체크리스트 유용성
  - 자유 의견

## DB 구조
- `support_tickets`
  - user_id, trip_id, type, title, content, status, attachments, internal_note
- `feedback_events`
  - user_id, trip_id, itinerary_satisfaction, place_recommendation_quality, booking_checklist_usefulness, comment
- 첨부는 URL 배열 구조로 optional 처리

## Admin
- ticket list 조회
- status 변경(open/in_progress/resolved)
- internal note 저장
- user/trip 최소 정보 표시용 필드 포함
- feedback event 목록 조회

## Email
- 접수 확인 메일 adapter 제공
- `RESEND_API_KEY` 없으면 mock(no-op) 동작

## 보안/운영
- 본인 user 기준 요청으로 저장
- 첨부 URL은 서명 URL + 짧은 TTL 정책 권장
