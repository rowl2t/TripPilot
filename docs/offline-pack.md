# Offline Travel Pack

## 목적
인터넷 불안정 상황에서도 여행 핵심 정보(일정/예약/비상연락/체크리스트/예산)를 오프라인 조회 가능하게 제공.

## 구성
- trip summary
- 날짜별 일정
- 예약 task
- 비상 연락처(mock provider)
- 준비물 체크리스트
- 예산/메모

## 모바일 저장
- AsyncStorage 우선, 사용 불가 시 메모리 fallback
- 마지막 생성 시각 표시
- 수동 갱신 버튼 제공

## Export
- HTML export 제공
- 추후 PDF 변환 파이프라인 연결 가능
- Share sheet 연동은 플랫폼 API 연결 단계에서 확장

## 보안/주의
- 오프라인 팩은 민감정보 최소화
- 최신 가격/재고/예약상태는 온라인 재검증 필요
