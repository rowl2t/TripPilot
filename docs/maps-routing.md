# Maps & Routing UX

## 구현 요약
- Trip detail에 Map 섹션 추가.
- 날짜별 Day 필터 제공.
- itinerary 순서 번호(order) 표시.
- marker type 표시(hotel/airport/restaurant/attraction).
- Route summary에 이동 수단 + 예상 소요시간 표시.
- 90분 이상 구간 warning 표시(`isLongRouteLeg`).
- 장소 상세 bottom-sheet 대체 UI(카드) 제공: 이름/주소/카테고리/평점/체류시간/선택 이유/대체안.

## Provider layer
- `apps/mobile/src/maps/provider.ts`:
  - provider key 존재 여부 감지
  - key 미설정 시 mock map data 제공
  - route warning 로직 제공

## 테스트
- `apps/mobile/src/maps/provider.test.ts`에서 장거리 경고 로직 검증.
