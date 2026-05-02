# Privacy Rights (Export / Deletion)

## 사용자 기능
- Profile > Privacy에서 데이터 내보내기(JSON) 요청
- Profile > Privacy에서 계정 삭제 요청(위험 작업 2단계 확인)

## Data Export 범위
- profile
- trips
- itinerary
- saved links
- booking tasks
- votes
- calendar events

`packages/api-client/src/privacy.ts`의 `buildUserDataExport`가 본인 userId 범위로만 조회하며, 민감키(access token/secret 계열)는 제거합니다.

## Export 보안
- export 요청 audit log 기록
- export URL TTL은 기본 600초(짧은 만료)
- zip 준비를 위한 파일 리스트 구조(`zipReady.files`) 포함

## Account Deletion
- 요청 시 audit log에 `account_deletion_requested` 기록
- profile에 `deletion_requested_at` 표시(soft delete/scheduled deletion 준비)
- 실제 Supabase auth user 삭제는 `adminDeleteSupabaseAuthUser`로 service-role client에서만 수행
- 기본 scheduled deletion window: 7일

## Admin
- `apps/admin/src/ops/admin-ops.ts`의 `listDeletionRequests`로 요청 조회 가능

## 규정/심사 대응 포인트
- 본인 데이터만 export
- 민감 정보 export 금지
- 파괴적 작업 확인 UX 제공
