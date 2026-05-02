# Collaboration (Companion Planning)

## 기능
- owner가 이메일 초대 생성 (`trip_members.invite_email`, `invite_status=pending`)
- role 모델: owner/editor/viewer
- 장소 후보 투표: must/like/neutral/dislike

## 권한 모델
- owner: 초대/전체 수정/삭제
- editor: 일정 수정 + 투표
- viewer: 읽기 + 투표

## 투표 집계 규칙
- must 우선순위 가중치 +2
- like +1
- dislike -1
- dislike 다수(2+) & must 없음이면 avoid 후보

## AI 재생성 반영
- vote summary -> `must_include`, `avoid_places` 제약으로 변환
- regenerate 요청 payload에 포함해 worker로 전달

## 이메일 어댑터
- `apps/worker/src/collaboration/resend-adapter.ts`
- RESEND API key 없으면 mock id 반환
- key 있으면 실제 발송 adapter로 교체 가능
