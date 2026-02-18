# TASK-016

- id: TASK-016
- title: insertHead 초기 step 하이라이트가 실제 노드를 가리키도록 보정
- owner: codex
- created_at: 2026-02-18
- completed_at: 2026-02-18
- status: done

## Scope
- `features/ds/cdll/operations.ts`
- `docs/task/TASK-016.md`
- `docs/task/INDEX.md`

## Definition of Done
- `insertHead`의 초기 step에서 하이라이트 대상 노드가 실제 `nodes`/순회 경로에 포함되어 시각화되어야 함
- step 설명과 링크 갱신 순서가 구현과 일치해야 함
- lint/test/build가 통과해야 함

## Verification
- `npm run test` 통과 (7 passed)
- `npm run lint` 통과
- `npm run build` 통과
- non-empty insertHead에서 step 1부터 새 노드가 순회 경로(next)에 포함되도록 수정 확인

## Notes
- 리뷰 코멘트 반영: 존재하지 않는 노드 ID 하이라이트 제거
