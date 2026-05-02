# Booking Checklist

## 목적
직접 예약 대행이 아닌 **예약 안내 + 제휴 링크 + 리마인더**로 초보자의 준비 부담을 낮춘다.

## 기능
- 여행별 `booking_tasks` 조회
- task 상세(권장 시점, 상태, 링크)
- 상태 전환: done / skipped / todo
- 리마인더 payload: due_date 기준 60분/30분 전

## 제휴 레이어
- provider enum: skyscanner, booking, agoda, klook, kkday, google_travel, manual
- `apps/worker/src/affiliate/url-builder.ts` URL builder로 mock 가능
- 추후 실 제휴 API 승인 시 adapter 교체

## 법적/운영 안내
- 가격/재고 실시간 변동 가능 문구를 UI에 고정 노출
- 결제/예약은 외부 파트너 사이트에서 진행

## 다음 단계
1. calendar_events 연동 reminder enqueue
2. push notification dispatch worker 연결
3. provider별 deep-link 파라미터 고도화
