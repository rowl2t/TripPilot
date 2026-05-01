# Engineering Standards

## 코드 스타일
- TypeScript strict 모드 기본
- 함수는 단일 책임 원칙 준수
- 도메인 로직과 UI/IO 분리

## 폴더 규칙
- apps: 사용자 접점/실행 앱
- packages: 재사용 가능한 도메인/인프라 모듈
- docs: ADR, 스펙, 운영 문서

## 네이밍 규칙
- 파일: kebab-case
- 타입/클래스: PascalCase
- 함수/변수: camelCase
- 환경변수: SCREAMING_SNAKE_CASE

## 테스트 규칙
- 단위: Vitest
- 핵심 플로우는 통합 테스트 추가
- AI 출력 파서는 반드시 스키마 테스트 포함

## API 에러 포맷
```json
{ "error": { "code": "STRING", "message": "STRING", "details": {} } }
```

## 로깅 규칙
- JSON 구조 로그
- traceId, userId, route, latency 포함
- 민감정보 마스킹

## 환경변수 규칙
- `.env.example`에 키 목록/설명 유지
- 런타임 시작 시 Zod로 필수값 검증
- 비밀값 하드코딩 금지
