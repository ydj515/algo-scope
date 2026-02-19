# TASK-045

- id: TASK-045
- title: 잔여 6개 캔버스 CanvasFrame+색상 토큰 통일 및 Field(Number/Checkbox) 확장
- owner: codex
- created_at: 2026-02-19
- completed_at: 2026-02-19
- status: done

## Scope
- `app/globals.css`
- `features/ui/components/field.tsx`
- `features/trace/adapter.ts`
- `features/trace/components/trace-shell.tsx`
- `features/visualizer/components/cdll-canvas.tsx`
- `features/visualizer/components/stack-canvas.tsx`
- `features/visualizer/components/queue-canvas.tsx`
- `features/visualizer/components/tree-canvas.tsx`
- `features/problem/backtracking/components/backtracking-canvas.tsx`
- `features/problem/backtracking-n-queens/canvas.tsx`
- `docs/task/TASK-045.md`
- `docs/task/INDEX.md`

## Definition of Done
- 잔여 6개 캔버스가 `CanvasFrame` 기반으로 렌더링되어야 함
- 잔여 6개 캔버스의 주요 SVG/UI 색상이 토큰 변수 기반으로 치환되어야 함
- `Field`에 `NumberField`, `CheckboxField`가 추가되어야 함
- `TraceShell` 폼 렌더 분기에서 `NumberField/CheckboxField`를 사용해 조건 분기를 단순화해야 함
- lint/test/build가 통과해야 함

## Verification
- `npm run lint` 통과
- `npm run test` 통과
- `npm run build` 통과
