# Monetization

## 플랜
- Free: 월 AI 2회, saved links 20개, offline pack 제한
- Pro Monthly: 고급 기능 + 사실상 제한 해제
- Trip Pack: 특정 trip 고급 생성 1회 구매

## Entitlement Service
- `subscriptions` 기반 active entitlement 계산
- RevenueCat webhook payload 반영 가능한 구조

## Usage Meter
- `ai_runs` 월간 카운트
- `saved_links` 총량
- `trips` 총량
- 서버에서 `enforceUsageLimit`로 강제

## Paywall
- 모바일 Profile 탭에 현재 플랜/사용량 표시
- 초과 시 제한 메시지 + 업그레이드 CTA

## Adapters
- RevenueCat: offerings/purchase/restore mock 가능
- Stripe: checkout adapter + webhook skeleton

## 보안
- RevenueCat/Stripe secret은 서버 env에만 저장
- 모바일 앱에는 공개 가능한 키만 사용
