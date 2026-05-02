# 아키텍처 감사 메모

## 구조
- apps: mobile/web/admin/worker
- packages: schemas/api-client/ai/db/config/ui/types

## 리스크
- 외부 의존성 장애 전파
- mock/provider 혼재
- 계약 변경 시 하위 앱 영향

## 완화
- API 계약 버전 관리
- reliability helper(타임아웃/재시도)
- 릴리즈 리허설 및 문서화
