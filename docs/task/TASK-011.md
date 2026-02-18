# TASK-011

- id: TASK-011
- title: CDLL 노드 조회 타입 단언 제거 및 방어 로직 추가
- owner: codex
- created_at: 2026-02-18
- completed_at: 2026-02-18
- status: done

## Scope
- `features/ds/cdll/operations.ts`
- `docs/task/TASK-011.md`
- `docs/task/INDEX.md`

## Definition of Done
- `insertHead`의 `oldHead`/`oldTail` 타입 단언이 제거되어야 함
- 노드 누락 시 런타임 방어 처리가 추가되어야 함
- 연관 경로(`insertTail`, `randomInit`)도 동일한 안전성 기준을 만족해야 함

## Verification
- `npm run test` 통과 (7 passed)
- `npm run lint` 통과
- `npm run build` 통과

## Notes
- 리뷰 코멘트 반영: 타입 단언 대신 명시적 존재 검증 적용
