# TASK-025

- id: TASK-025
- title: Grid BFS map 입력 시 goal 좌표를 마지막 인덱스로 자동 설정
- owner: codex
- created_at: 2026-02-18
- completed_at: 2026-02-18
- status: done

## Scope
- `features/problem/grid-bfs/adapter.ts`
- `features/problem/grid-bfs/adapter.test.ts`
- `docs/task/TASK-025.md`
- `docs/task/INDEX.md`

## Definition of Done
- map 입력이 존재하면 goal 좌표를 `(rows-1, cols-1)`로 자동 설정해야 함
- map 입력 시 goalRow/goalCol 수동 입력 의존이 없어야 함
- 관련 테스트가 추가/갱신되어야 함
- lint/test/build가 통과해야 함

## Verification
- `npm run test` 통과 (23 passed)
- `npm run lint` 통과
- `npm run build` 통과

## Notes
- goal 자동화에 맞춰 입력 UI 혼동 최소화를 위해 goal 필드 가시성도 조정
