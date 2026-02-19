# TASK-040

- id: TASK-040
- title: 테마 드롭다운 전환 + semantic tone 확장 + VisualizerShell/TraceShell 공통 UI 전면 적용
- owner: codex
- created_at: 2026-02-18
- completed_at: 2026-02-18
- status: done

## Scope
- `app/globals.css`
- `features/ui/components/button.tsx`
- `features/navigation/types.ts`
- `features/navigation/catalog-ds.ts`
- `features/navigation/catalog-problems.ts`
- `features/navigation/components/catalog-grid.tsx`
- `features/navigation/components/theme-toggle.tsx`
- `features/visualizer/components/visualizer-shell.tsx`
- `features/trace/components/trace-shell.tsx`
- `docs/task/TASK-040.md`
- `docs/task/INDEX.md`

## Definition of Done
- 테마 토글이 드롭다운 UI로 동작해야 함
- semantic tone(`success`, `warning`, `danger`) 토큰과 버튼 tone이 추가되어야 함
- VisualizerShell/TraceShell의 버튼/카드 영역이 공통 `Button`/`Card`로 전환되어야 함
- lint/test/build가 통과해야 함

## Verification
- `npm run lint` 통과
- `npm run test` 통과 (48 passed)
- `npm run build` 통과
