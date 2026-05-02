# Place Normalization & Deduplication

## 목표
- AI/Google Places/SNS 링크 분석에서 들어온 장소 후보 중복 저장 방지
- 같은 장소의 다양한 표기(현지어/영문/한국어) 통합

## 구현 위치
- `packages/db/src/place-normalization.ts`

## Normalization
- 이름 `trim + lowercase`
- 괄호 표현 제거
- 특수문자 제거
- alias 집합 관리(원본명 + 별칭)
- 주소 normalize

## Deduplication
1. `google_place_id` 일치 시 즉시 동일 장소
2. 없으면 `name(alias) + city + lat/lng proximity` 점수 계산
3. confidence >= 0.7: merge
4. confidence >= 0.5: possible duplicate로 기록

## Merge 정책
- source payload 병합
- categories union
- rating/price_level 최신값 우선
- 좌표/주소 최신값 보강

## Saved Link Integration
- `reconcileSavedLinkPlaces`로 saved_link_places를 기존 places와 매칭
- 매칭 성공 시 place_id / linked_place_name 보정

## 테스트
- 같은 장소 다른 표기
- 같은 이름 다른 도시
- place_id 없는 후보
- 좌표 근접 후보 + possible duplicate 기록
