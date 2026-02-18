# TASK-023

- id: TASK-023
- title: Grid BFS map(0/1 문자열) 입력 자동 크기/벽 추론 지원
- owner: codex
- created_at: 2026-02-18
- completed_at: 2026-02-18
- status: done

## Scope
- `features/problem/grid-bfs/adapter.ts`
- `features/problem/grid-bfs/adapter.test.ts`
- `docs/task/TASK-023.md`
- `docs/task/INDEX.md`

## Definition of Done
- map 문자열 입력(`1=이동 가능`, `0=벽`)을 파싱해 `rows/cols/walls`를 자동 추론해야 함
- map 입력이 존재하면 rows/cols/walls 수동 입력보다 우선 적용되어야 함
- map 형식 검증(직사각형, 0/1 only) 오류 메시지를 제공해야 함
- lint/test/build가 통과해야 함

## Verification
- `npm run test` 통과 (23 passed)
- `npm run lint` 통과
- `npm run build` 통과

## Notes
- 텍스트 JSON 입력에서도 `map` 필드(string 또는 string[])를 지원
