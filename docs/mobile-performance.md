# Mobile Performance Profiling & 개선

## 목표
여행 일정이 길어져도 스크롤/상호작용이 부드럽도록 렌더링 비용과 네트워크 낭비를 줄임.

## 적용 내용

### 1) Trip Detail
- 타임라인 렌더링을 `map`에서 `FlatList`로 변경
- `initialNumToRender`, `windowSize`, `removeClippedSubviews` 적용
- 긴 일정에서 메모리/렌더링 비용 절감

### 2) Saved Links
- 목록 페이징(클라이언트 페이지 size=10)
- `FlatList` 기반 가상화
- 후보 polling은 선택된 링크에서만 수행
- query staleTime/키 정리로 불필요 refetch 감소

### 3) Calendar
- 이벤트 목록 `FlatList` 가상화
- 월별 필터 + 월 키 캐시(queryKey에 month 포함)
- 월 탭 전환 시 전체 재조회 비용 축소

### 4) State / Query
- query key에 버전/파라미터 포함 (`saved-links`, `calendar-events`)
- staleTime 설정 강화
- 후보 확정/거절 mutation 시 optimistic 흐름을 위한 cancel/invalidate 정리

### 5) Bundle
- 현재 단계: 외부 대형 의존성 추가 없이 RN 기본 가상화 우선 적용
- 차기: 화면별 dynamic import 및 이미지 썸네일 lazy 로더 분리 검토

## 추가 권장
- Hermes profile + React DevTools flame chart로 Trip Detail/Calendar 스크롤 프레임 측정
- 500+ 일정 아이템 synthetic 데이터로 성능 회귀 테스트 자동화
