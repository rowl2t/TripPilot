# 성능 최종 감사 보고서

## 요약
- 모바일 성능에서 즉시 적용 가능한 최적화(불필요 refetch 감소, 메모이제이션, 조건부 polling)를 반영했다.
- 측정이 필요한 항목은 로컬/프로덕션 모니터링 대상으로 분리했다.

## 1) Mobile Performance 점검 결과
- 긴 itinerary list virtualization: `FlatList` 사용(초기 렌더 제한 포함) 확인.
- saved links pagination: 페이지 단위 노출(`더 보기`) 확인.
- image lazy loading: 현재 이미지 중심 화면 비중 낮음(향후 이미지 확장 시 lazy loading 필요).
- TanStack Query cache key: 주요 훅에서 키 분리 확인.
- 불필요한 refetch 제거: `useTripDetail`에 `staleTime`/`refetchOnWindowFocus:false` 적용.
- heavy component memoization: 지도 pin 필터를 `useMemo`로 변경.
- saved link 후보 polling 최적화: pending/processing 상태에서만 polling.

## 적용한 최적화
1. Trip 상세 query refetch 완화
2. 지도 pin 필터 메모이제이션
3. Saved link 후보 polling 조건부 전환

## 추가 모니터링 필요
- 저사양 안드로이드에서 frame drop 측정(FPS, JS frame time)
- 대형 itinerary(100+ item)에서 스크롤 성능
- 이미지/썸네일 도입 시 메모리 사용량
