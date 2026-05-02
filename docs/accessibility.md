# Accessibility Improvements

## Mobile
- Button에 `accessibilityLabel` 지원 및 최소 터치 타겟(44px) 적용.
- Input에 시각 라벨(`label`) + 스크린리더 라벨 연동.
- ErrorState를 `accessibilityLiveRegion="polite"`로 설정하고 안내 메시지 announce 처리.
- 상태 구분 시 색상 외 텍스트(배지 라벨, 상태 문구) 유지.

## Web
- `lang="ko"` 지정.
- Skip link(본문으로 건너뛰기) 추가.
- 메인 랜딩에 `main` landmark, `nav aria-label`, 버튼 `aria-label` 적용.
- OpenGraph 이미지 alt 메타 추가.

## Contrast / token
- 기존 다크 토큰에서 텍스트 대비를 유지하는 `textPrimary/textSecondary` 체계를 사용.
- 상태 색상은 텍스트 라벨과 함께 사용하도록 권장.

## Next steps
- eslint-plugin-jsx-a11y를 웹 워크스페이스 lint에 도입.
- 모바일 스크린별 E2E 접근성 검증 시나리오(VoiceOver/TalkBack) 추가.
