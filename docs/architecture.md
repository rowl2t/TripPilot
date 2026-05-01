# TripPilot Architecture

## 전체 시스템 아키텍처
- 클라이언트: Expo 모바일, Next.js 웹, Next.js 관리자
- 서버: API(BFF), Worker(비동기 파이프라인), AI orchestration
- 데이터: PostgreSQL + Redis + Object Storage
- 외부연동: Places, RevenueCat, Stripe, Calendar, Analytics

## 컴포넌트 관계
- Mobile/Web/Admin → API
- API → DB/Cache/Queue
- Worker → Queue 소비 후 AI/외부 API 호출
- AI 패키지 → 스키마 검증 및 프롬프트/툴링

## 데이터 흐름
1. 사용자 입력 수집
2. API 검증 및 저장
3. Worker 비동기 생성
4. 결과 검증 후 일정/체크리스트 반영

## AI 일정 생성 흐름
1. 사용자 선호 + 제약 수집
2. 후보 일정 생성
3. Places API 교차 검증
4. Zod 검증 후 저장

## SNS 링크 저장/분석 흐름
1. 링크 제출
2. 메타데이터/허용 API 파싱
3. 장소 후보 추출
4. 장소 정규화/중복 제거

## 예약 체크리스트 흐름
1. 일정 확정
2. 카테고리별 예약 항목 자동 생성
3. 마감일 알림 및 상태 추적

## 결제/구독 흐름
1. 모바일 구독: RevenueCat SDK + 서버 검증
2. 웹 결제: Stripe Checkout(확장형)
3. 권한/플랜 엔타이틀먼트 동기화

## 캘린더 연동 흐름
1. OAuth 연결
2. 일정 이벤트 매핑
3. 변경 동기화 및 충돌 해소
