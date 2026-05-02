# AI Evaluation Dataset & Runner

## 목적
코드 변경 전후 AI 일정 품질(정합성/제약 준수/예산/밀도)을 비교 가능하게 유지.

## 구성
- 입력 데이터셋: `packages/ai/src/eval/inputs.ts` (10개 케이스)
  - 기간/예산/인원/스타일 다양성
  - saved links 포함 케이스
  - must/avoid 제약 포함 케이스
- 실행기: `packages/ai/src/eval/runner.ts`
  - mock mode 기본
  - `OPENAI_API_KEY` 존재 시 real-ai mode 표시
  - 결과 JSON: `packages/ai/reports/latest.json`
  - baseline 비교: `packages/ai/reports/baseline.json`

## 평가 기준
- schema validation 통과
- 날짜 누락 없음
- 식사 포함
- 일정 밀도(일 평균 아이템 과밀 여부)
- 예산 초과 여부
- 예약 task 존재

## 회귀 기준
- 최신 passed 케이스 수가 baseline보다 작으면 실패 처리.

## 실행
- `pnpm --filter @trippilot/ai eval:ai`
