# TripPilot Mobile UI System

## 디자인 원칙
- 프리미엄 여행 어시스턴트 톤(딥 블루 + 민트)
- 카드형 정보 구조, 큰 CTA, 단계 유도
- 초보 사용자 중심의 명확한 다음 행동

## 화면 구조 (Expo Router)
- `app/(tabs)/index.tsx`: Home Dashboard
- `app/(tabs)/trips.tsx`: 내 여행 목록
- `app/(tabs)/saved.tsx`: 저장 링크
- `app/(tabs)/calendar.tsx`: 캘린더
- `app/(tabs)/profile.tsx`: 프로필/구독
- `app/auth/login.tsx`: 로그인
- `app/onboarding.tsx`: 온보딩

## 공통 컴포넌트
- Button, Card, Input, Badge
- EmptyState, LoadingState, ErrorState, Skeleton
- 접근성: `accessibilityLabel` 기본 적용

## 상태 관리
- 서버 상태: TanStack Query (`src/state/query-client.ts`)
- UI 로컬 상태: Zustand (`src/state/ui-store.ts`)

## 다크모드/토큰
- `src/theme/tokens.ts`에 light/dark 토큰 분리
- 이후 ThemeProvider로 시스템 테마 자동 동기화 확장 예정

## Preview
- `src/components/preview.tsx` 에 컴포넌트 프리뷰 조합 제공

## 다음 단계
1. Expo Router 실제 네비게이션/딥링크 구성
2. Supabase Auth 세션과 라우트 가드 연결
3. 홈/여행/저장/예약/캘린더 API 연동
4. Skeleton 애니메이션 및 디자인 QA
