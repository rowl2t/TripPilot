# Saved Links & Place Analysis

## 정책
- 공개 메타데이터(oEmbed/OG) 및 사용자 제공 텍스트 기반 분석만 수행
- 로그인 우회/DRM 우회/비공개 접근/대량 무단 스크래핑 미구현

## 기능
- Saved 탭에서 링크 저장/목록/분석상태/후보 확정·거절
- Worker ingestion:
  - URL 정규화/플랫폼 감지
  - metadata fallback
  - 텍스트 기반 장소 후보 추출
  - `pending -> processing -> completed/failed` 상태 전이

## 저장소
- `saved_links`
- `saved_link_places`
- (확정 후) `places` 매핑 확장 가능

## 실패 복구
- 분석 실패 시 앱 중단 없이 상태만 `failed`로 표시
- 사용자가 직접 장소명 추가 UX로 보완 가능

## Trip Planning 연동
- 신규 여행 생성 시 destination 관련 saved places 제안
- 선택된 후보를 planner 입력 우선순위로 반영(다음 단계 확장)
