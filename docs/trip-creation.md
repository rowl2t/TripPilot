# Trip Creation Flow (Step 5)

## 개요
모바일의 `app/trips/new.tsx`에서 7단계 입력으로 여행 계획 생성을 시작한다.

## 단계
1. 목적지
2. 날짜
3. 동행/인원
4. 예산
5. 여행 스타일
6. 회피/제약
7. 출발지 + 생성

## 동작
- Zustand store(`trip-draft-store`)에 단계별 임시 저장
- 제출 시 `packages/api-client:createTripPlanning` 호출
- 서버(Supabase RLS 컨텍스트)에서 `trips` + `trip_inputs` insert
- 즉시 `planning` 상태와 mock job id 반환

## 실패 복구 UX
- 제출 실패 시 에러 메시지 노출
- draft는 store에 남아 재시도 가능

## 다음 단계
- worker가 `planningJobId` 기준 AI 생성 파이프라인 실행
- saved links 선택 UI 및 후보 merge UX 고도화
