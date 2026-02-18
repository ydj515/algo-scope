# TASK-006

- id: TASK-006
- title: TODO 기반 MVP 1차 개발 착수(CDLL 시각화 + Step 엔진)
- owner: codex
- created_at: 2026-02-18
- completed_at: 2026-02-18
- status: done

## Scope
- `app/page.tsx`
- `app/ds/circular-doubly-linked-list/page.tsx`
- `app/layout.tsx`
- `app/globals.css`
- `features/visualizer/types.ts`
- `features/visualizer/use-stepper.ts`
- `features/visualizer/components/cdll-canvas.tsx`
- `features/ds/cdll/operations.ts`
- `docs/task/TASK-006.md`
- `docs/task/INDEX.md`

## Definition of Done
- 홈 페이지에 DS 진입 링크가 있어야 함
- CDLL 페이지에서 주요 연산 실행 및 Step 재생이 동작해야 함
- 연산 단위 복잡도(Time/Space)가 표시되어야 함
- 작업 파일/INDEX가 동기화되어야 함

## Verification
- `npm run lint` 통과
- `npm run build` 통과
- `/` 및 `/ds/circular-doubly-linked-list` 라우트 정적 생성 확인

## Notes
- MVP 우선: React state 기반 Stepper + SVG 렌더러 최소 구현
