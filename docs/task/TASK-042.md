# TASK-042

- id: TASK-042
- title: Badge 범위 확장(스텝 리스트/캔버스 범례) + 모바일 테마 외부 클릭 닫힘 + Field 공통화
- owner: codex
- created_at: 2026-02-18
- completed_at: 2026-02-18
- status: done

## Scope
- `features/ui/components/field.tsx`
- `features/ui/components/badge.tsx`
- `features/navigation/components/theme-toggle.tsx`
- `features/visualizer/components/visualizer-shell.tsx`
- `features/trace/components/trace-shell.tsx`
- `features/problem/grid-bfs/canvas.tsx`
- `features/problem/grid-dfs/canvas.tsx`
- `features/problem/dp/components/dp-table-canvas.tsx`
- `app/globals.css`
- `docs/task/TASK-042.md`
- `docs/task/INDEX.md`

## Definition of Done
- Shell에 Step List가 추가되고 상태 Badge가 적용되어야 함
- 주요 캔버스 legend가 Badge 기반으로 통일되어야 함
- 모바일 테마 드롭다운에 외부 클릭 시 닫힘이 적용되어야 함
- Shell의 select/input/textarea가 공통 Field 컴포넌트로 통일되어야 함
- lint/test/build가 통과해야 함

## Verification
- `npm run lint` 통과
- `npm run test` 통과 (48 passed)
- `npm run build` 통과
