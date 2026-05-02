# 테스트 가이드

## 표준 명령
```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

## 권장 순서
1. lint
2. typecheck
3. test
4. build

## 네트워크 이슈 대응
- pnpm bootstrap 실패 시 registry/proxy 설정 확인
- CI에서 동일 명령 재실행
- 최종 배포 전 4단계 통과 필수
