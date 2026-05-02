# Recovery Report (2026-05-02)

## 수행 방식
1. 레포 전반 정적 점검(화면/훅/클라이언트/문서)
2. 런타임 위험 코드 우선 수정
3. 재점검 후 blocker/non-blocker 분류

## 수정한 항목

### 1) 런타임 안정성
- `Profile` 화면의 임시 mock-client 직접 호출 제거
- 서버 연동 필수 액션(문의/피드백/데이터 export/계정 삭제)은 로그인+서버 연결 필요 안내로 가드 처리
- 목적: production에서 타입 불일치/비정상 mutation 호출로 인한 화면 깨짐 방지

### 2) 출시 리허설 문서화
- `docs/launch-rehearsal-report.md` 작성
- 15개 주요 유저 플로우 점검 결과, blocker/non-blocker, 권고 액션 정리

### 3) 성능 개선(기존 작업 검증)
- Trip Detail/Saved/Calendar의 list virtualization 및 query key/staleTime 정리 상태 재확인

## 점검 결과 (현재)

### 보안/운영 위험
- **Mock/Production 혼재 위험 완화**: UI에서 임시 mock client 주입 패턴 제거 완료
- 민감정보 직접 노출 코드는 이번 점검 범위에서 추가 발견 없음

### 타입/의존성/중복 구현
- 공통 API contract/schema 도입 상태 유지
- support request/response 타입 중복 제거 상태 유지
- 일부 테스트 코드의 `as any`는 테스트 목적으로만 존재 (프로덕션 코드 경로 아님)

## 남은 리스크

### Blocker
1. `pnpm` bootstrap 네트워크 오류(403)로 `pnpm lint/typecheck/test/build` 실행 불가
2. 실제 외부 연동(OpenAI/RevenueCat/Supabase/Resend) staging 통합 검증 미완료

### Non-blocker
1. 일부 화면은 여전히 scaffold 성격(UI 고도화 필요)
2. admin helper는 존재하나 운영 UI 연동은 후속 필요

## 테스트 실행/대체 검토
- 시도: `pnpm lint` → 실패(환경 네트워크/registry 제한)
- 동일 원인으로 `pnpm typecheck/test/build` 실행 불가
- 대체안 검토:
  - 정적 코드 리뷰 + 경로 점검 + 런타임 리스크 패턴 제거 수행
  - 문서 기반 릴리즈 리허설 체크리스트 보강
- 권장: CI runner 또는 로컬 개발망에서 pnpm bootstrap 가능 환경으로 재실행 필수

## 결론
- 코드상 즉시 위험한 런타임 패턴(mock client 주입)은 제거되어 안정성은 개선됨.
- 다만 자동 품질 게이트(`lint/typecheck/test/build`) 미통과 상태는 환경 이슈로 남아 있어, **배포 전 CI 환경에서 반드시 재검증 필요**.
