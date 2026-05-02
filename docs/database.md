# TripPilot Database Design (Supabase Postgres)

## 개요
이 문서는 TripPilot의 운영용 데이터 모델과 RLS(Row Level Security) 정책을 설명한다. 목표는 **사용자 데이터 격리**, **AI 실행 추적 가능성**, **여행 협업/예약/링크 분석 지원**이다.

## 스키마 범위
- Migration: `supabase/migrations/20260501090000_init_trippilot_schema.sql`
- Seed: `supabase/seed.sql` (공개 참조 데이터만)

## 핵심 엔터티

### 사용자/권한
- `profiles`: `auth.users`와 1:1 확장 프로필
- `subscriptions`: RevenueCat/Stripe/수동 부여 상태

### 여행 계획
- `trips`: 여행 마스터
- `trip_members`: 협업 멤버/초대
- `trip_inputs`: 원본 입력 + 정규화 입력 + AI 요약
- `itinerary_days` / `itinerary_items`: 일자/아이템 단위 일정
- `booking_tasks`: 예약/준비 태스크
- `calendar_events`: 외부 캘린더 싱크 엔터티

### 장소/투표/SNS
- `places`: 검증 가능한 장소 저장소(Places API 원본 payload 포함)
- `trip_place_options`: 여행별 장소 후보
- `votes`: 동행자 투표
- `saved_links`: 사용자가 저장한 SNS 링크
- `saved_link_places`: 링크 분석에서 추출된 장소 후보

### AI/감사
- `ai_runs`: 프롬프트 버전, 토큰 사용량, 비용 추정, 결과/에러 기록
- `audit_logs`: 민감 이벤트 감사 로그(관리자 전용)

## 관계(ERD 수준 설명)
- `profiles (1) -> (N) trips.owner_id`
- `trips (1) -> (N) trip_members`
- `trips (1) -> (N) trip_inputs / itinerary_days / itinerary_items / trip_place_options / booking_tasks / calendar_events / votes / ai_runs`
- `places (1) -> (N) itinerary_items / trip_place_options / saved_link_places`
- `saved_links (1) -> (N) saved_link_places`
- `trip_place_options (1) -> (N) votes`

## RLS 정책 요약
- `profiles`: 본인만 조회/수정/삽입
- `trips` 및 하위 도메인(`itinerary_*`, `trip_inputs`, `booking_tasks`, `votes`, `trip_place_options`): owner/member 접근
- `saved_links`, `saved_link_places`: 본인 데이터만 접근
- `places`: 전체 읽기 허용, 쓰기는 admin/service_role만
- `ai_runs`: 본인 run 조회 + 본인 run 생성, 수정은 admin/service_role
- `audit_logs`: admin/service_role만 접근
- 확장용 함수 `app.is_admin()`으로 `admin`/`service_role` JWT role 대응

## 무결성/성능 포인트
- `updated_at` 자동 갱신 트리거 (`app.set_updated_at`)
- 주요 조회 경로 인덱스 추가(소유자, trip_id, user_id, 생성시각)
- FK 삭제 정책:
  - 핵심 소유 데이터는 `cascade`
  - 참조 보존이 필요한 항목은 `set null` 또는 `restrict`

## 운영 지침
1. 클라이언트 키(anon)는 RLS 기반 읽기/쓰기만 수행.
2. 장소 upsert, 구독 웹훅 반영, AI 런 상태 업데이트는 서버에서 service role로 실행.
3. `audit_logs`는 서버에서만 기록하고 일반 사용자 API로 노출하지 않음.
