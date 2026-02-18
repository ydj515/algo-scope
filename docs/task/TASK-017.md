# TASK-017

- id: TASK-017
- title: searchValue 노드 조회 타입 단언 제거 및 corrupted state 방어 추가
- owner: codex
- created_at: 2026-02-18
- completed_at: 2026-02-18
- status: done

## Scope
- `features/ds/cdll/operations.ts`
- `docs/task/TASK-017.md`
- `docs/task/INDEX.md`

## Definition of Done
- `searchValue`에서 `as VisualNode` 단언이 제거되어야 함
- 손상된 링크/누락 노드 감지 시 런타임 에러 대신 에러 step으로 종료되어야 함
- lint/test/build가 통과해야 함

## Verification
- `npm run test` 통과 (7 passed)
- `npm run lint` 통과
- `npm run build` 통과

## Notes
- 리뷰 코멘트 반영: unsafe assertion 제거
