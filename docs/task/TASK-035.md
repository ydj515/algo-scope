# TASK-035

- id: TASK-035
- title: Backtracking Generic 트리형 SVG 시각화 및 depth lane/phase 강조/샘플링 추가
- owner: codex
- created_at: 2026-02-18
- completed_at: 2026-02-18
- status: done

## Scope
- `features/problem/backtracking/types.ts`
- `features/problem/backtracking/engine.ts`
- `features/trace/components/trace-shell.tsx`
- `features/problem/backtracking/components/backtracking-canvas.tsx`
- `docs/task/TASK-035.md`
- `docs/task/INDEX.md`

## Definition of Done
- Generic Backtracking 캔버스가 트리형 SVG를 렌더링해야 함
- depth lane에 현재 candidates/currentChoice를 표시해야 함
- `prune` 단계는 빨강, `solution(exit)` 단계는 초록으로 강조해야 함
- detail/summary 모드에 맞춰 노드 샘플링이 동작해야 함
- 화면 최대 노드 수 200 제한이 적용되어야 함
- lint/test/build가 통과해야 함

## Verification
- `npm run lint` 통과
- `npm run test` 통과 (48 passed)
- `npm run build` 통과
