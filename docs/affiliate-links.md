# Affiliate Links & Booking Link Quality

## 목표
- 예약 체크리스트에서 바로 유용한 외부 링크로 이동
- 제휴 API가 없어도 fallback 검색 링크 안정 생성

## 구현
- `packages/api-client/src/affiliate-links.ts`
  - provider별 URL builder 분리
  - destination/date/travelers/currency 반영
  - UTM 파라미터 자동 부여
  - `AFFILIATE_ID` env 반영
  - provider unavailable 시 `google_search` fallback

## 대상 카테고리
- 항공권(flight)
- 숙소(hotel)
- 도시 간 교통(transport)
- 액티비티(activity)
- 식당 예약(restaurant)
- eSIM(esim)
- 여행자 보험(insurance)

## Tracking
- outbound click event 생성 helper
- 기록 필드: provider, task_type, trip_id, task_id
- 개인정보 최소화(PII 미포함)

## UI
- 예약 링크 버튼
- provider 표시
- 가격 변동/최종 확인 안내
- 링크 오류 신고 버튼
