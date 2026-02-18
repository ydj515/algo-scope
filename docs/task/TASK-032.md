# TASK-032

- id: TASK-032
- title: Knapsack 1D 최적화 모드 추가 + dp-recurrence 경계조건 입력 확장
- owner: codex
- created_at: 2026-02-18
- completed_at: 2026-02-18
- status: done

## Scope
- `features/problem/dp-knapsack/adapter.ts`
- `features/problem/dp-knapsack/adapter.test.ts`
- `features/problem/dp-recurrence/adapter.ts`
- `features/problem/dp-recurrence/adapter.test.ts`
- `docs/task/TASK-032.md`
- `docs/task/INDEX.md`

## Definition of Done
- Knapsack에 1D 최적화 모드(O(W))가 추가되어야 함
- dp-recurrence에 dp[0][j], dp[i][0] 사용자 정의 초기 조건 입력이 추가되어야 함
- 관련 테스트가 추가/갱신되어야 함
- lint/test/build가 통과해야 함

## Verification
- `npm run test` 통과 (42 passed)
- `npm run lint` 통과
- `npm run build` 통과
