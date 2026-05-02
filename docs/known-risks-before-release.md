# 출시 전 알려진 리스크

| 리스크 | 심각도 | 담당 | 권장 조치 | 출시 차단 여부 |
| --- | --- | --- | --- | --- |
| pnpm 부트스트랩 네트워크 실패로 CI 품질 게이트 미완료 | 높음 | DevOps | registry/proxy 수정 후 전체 파이프라인 재실행 | 예 |
| 실서비스 외부 연동(OpenAI/RevenueCat/Supabase) 스테이징 E2E 미완료 | 높음 | Backend/Mobile | 스테이징 엔드투엔드 시나리오 수행 및 증적 첨부 | 예 |
| 일부 운영 기능은 helper만 있고 admin UI 연동 미완료 | 중간 | Admin | UI 연동 및 권한 테스트 추가 | 아니오 |
