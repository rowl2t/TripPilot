# UX Writing Guide (TripPilot)

## 원칙
1. 다음 행동을 명확히 안내한다.
2. 실패 시 복구 방법을 함께 제시한다.
3. 기술적/내부 에러를 그대로 노출하지 않는다.
4. 가격/예약/영업시간 변동 가능성을 자연스럽게 고지한다.
5. 사용량 제한은 압박 없이 부드럽게 안내한다.

## 구현
- `packages/config/src/copy.ts`에 copy registry 추가.
- `toSafeErrorMessage`로 내부 에러 메시지 노출 최소화.
- `ErrorState`, `LoadingState`, `EmptyState`를 CTA 포함 구조로 개선.
- 저장 링크/여행 생성 화면의 하드코딩 문구를 registry 기반 문구로 교체.

## 다국어 확장
- 현재 ko 기본값 구조이며, 동일 키 구조로 `en` 번들을 추가하면 확장 가능.
