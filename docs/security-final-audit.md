# 보안 최종 감사 보고서

## 범위
- Secret Exposure
- Supabase RLS
- API Validation
- AI Security
- Payments
- Booking/Affiliate

## 핵심 결론
- **즉시 수정 완료(critical/high)**
  1. 웹훅 검증이 `signature 존재 여부`만 보던 취약점 수정(서명 HMAC 검증 추가).
  2. 모바일 클라이언트에서 서버 전용 키 이름(`GOOGLE_PLACES_API_KEY`)를 참조하던 경로 제거.
- **출시 차단(blocker)로 남김**
  1. Stripe webhook replay 방지(이벤트 ID 저장/중복 차단) 부재.
  2. 결제 entitlement 서버 강제(enforcement) 경로 불충분(클라이언트 UX 중심).
  3. AI 산출 장소의 실재성 검증(places verify 강제) 미완료.

## 1) Secret Exposure 점검
- client 코드에서 service role 직접 사용: 현재 발견 없음(워커 서버 측 사용).
- OpenAI/Stripe/RevenueCat secret client 노출: 직접 노출 코드는 미발견.
- 보완: 모바일 지도 provider 감지에서 서버 키 이름 참조 제거 완료.

## 2) Supabase RLS 점검
- 마이그레이션에 RLS/정책 정의가 있으나, 전체 테이블 커버리지 재검증 필요.
- owner/member/admin 경로 분리 설계는 있으나 운영 전 SQL 정책 테스트 필수.

## 3) API Validation 점검
- 다수 mutation에서 zod `safeParse` 사용 확인.
- 보완: Stripe webhook은 서명 검증 로직 추가 완료.
- 미해결: webhook replay 방지 구조(이벤트 저장+idempotency) 필요.

## 4) AI Security 점검
- 입력/출력 스키마는 일부 사용 중.
- 미해결:
  - prompt injection 하드닝 규칙(링크 메타데이터를 instruction으로 취급 금지) 명시적 강제 부족
  - hallucinated place 검증 강제 부족
  - 민감정보 로그 마스킹 기준 문서화 필요

## 5) Payments 점검
- paywall/entitlement 조회 흐름은 존재.
- 미해결:
  - entitlement server-side enforcement 부족
  - webhook replay 방지 없음
  - subscription cache 만료/무효화 정책 명확화 필요

## 6) Booking/Affiliate 점검
- 제휴 링크 생성/추적 구조 존재.
- 미해결:
  - outbound tracking에서 개인정보 최소화 원칙 점검 자동화 필요
  - 가격/재고 변동 안내 문구의 강제 노출 점검 필요

## 수정 내역
1. `packages/api-client/src/stripe.ts`
   - Stripe-Signature 헤더 파싱
   - `t.payload` 기반 HMAC-SHA256 검증
   - `timingSafeEqual`로 서명 비교
2. `apps/web/src/stripe-webhook.ts`
   - `STRIPE_WEBHOOK_SECRET`를 검증 함수에 전달
3. `apps/mobile/src/maps/provider.ts`
   - 클라이언트에서 서버 키명 참조 제거 (`EXPO_PUBLIC_GOOGLE_MAPS_API_KEY`만 사용)
