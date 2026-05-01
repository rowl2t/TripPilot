# Trip Plan Review & Edit UI

## 제공 화면
- Trip Overview: 제목/일정/예산/상태/예약 task 수/초대 CTA
- Day Timeline: 날짜별 아이템 확인 및 간단 편집
- Place Options: 후보 그룹 선택
- Regenerate: 전체/일자/조건 기반 재생성 요청

## 데이터 흐름
- query: `useTripDetail(tripId)`
- mutation:
  - `useUpdateItem` (부분 수정)
  - `useSelectOption` (후보 반영)
  - `useRegenerate` (worker 큐용 ai_runs 레코드 생성)

## UX 안전장치
- loading/error/empty 상태 기본 컴포넌트 사용
- optimistic update는 미사용, 성공 후 invalidate로 안전 동기화
- 실패 시 서버 원본 데이터 보존
