# Known Risks Before Release

| Risk | Severity | Owner | Suggested Fix | Release Blocker |
|---|---|---|---|---|
| pnpm bootstrap network failure로 CI 품질게이트 미완료 | High | DevOps | registry/proxy 수정 후 전체 파이프라인 재실행 | Yes |
| 실서비스 외부 연동(OpenAI/RevenueCat/Supabase) 스테이징 E2E 미완료 | High | Backend/Mobile | staging end-to-end 시나리오 수행 | Yes |
| 일부 운영 기능은 helper만 있고 admin UI 연동 미완료 | Medium | Admin | UI 연동 + 권한 테스트 | No |
| 문서와 실제 운영 절차 일부 갭 가능성 | Low | PM/QA | 릴리즈 리허설 결과 반영 | No |
