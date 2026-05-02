# TripPilot 모노레포

TripPilot은 모바일/웹/어드민/워커 앱과 공통 패키지를 하나의 모노레포에서 관리합니다.

## 워크스페이스
- `apps/mobile`: Expo 기반 모바일 앱
- `apps/web`: Next.js 웹 앱
- `apps/admin`: 운영/모니터링 도구
- `apps/worker`: 비동기 작업 처리 런타임
- `packages/*`: 공통 스키마, API 클라이언트, AI/DB 유틸

## 로컬 실행
> 현재 환경에 따라 `pnpm` bootstrap이 필요합니다.

```bash
pnpm install
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

## 로컬 테스트 방법
1. 의존성 설치: `pnpm install`
2. 정적 검증: `pnpm lint && pnpm typecheck`
3. 단위 테스트: `pnpm test`
4. 빌드 검증: `pnpm build`

### 네트워크 제한으로 pnpm이 실패할 때
- 사내 프록시/registry 허용 설정 확인
- CI runner에서 `pnpm@10` 다운로드 가능 여부 확인
- 임시로는 코드 정적 점검 + 문서 리허설로 위험을 줄이고, 최종 배포 전 반드시 CI 통과
