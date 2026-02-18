# TASK-037

- id: TASK-037
- title: 글로벌 네비에 Problems 서브 탭(Graph/DP/Backtracking) 추가
- owner: codex
- created_at: 2026-02-18
- completed_at: 2026-02-18
- status: done

## Scope
- `features/navigation/components/global-nav.tsx`
- `app/problems/page.tsx`
- `docs/task/TASK-037.md`
- `docs/task/INDEX.md`

## Definition of Done
- 글로벌 네비에서 Problems 활성 시 Graph/DP/Backtracking 서브 탭이 노출되어야 함
- `/problems` 허브의 각 섹션으로 이동 가능해야 함
- 문제 상세 페이지에서도 해당 서브 탭이 유지되어 허브 섹션으로 빠르게 이동 가능해야 함
- lint/test/build가 통과해야 함

## Verification
- `npm run lint` 통과
- `npm run test` 통과 (48 passed)
- `npm run build` 통과
