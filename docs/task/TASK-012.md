# TASK-012

- id: TASK-012
- title: 테스트 코드 타입 단언 제거(assert 타입 가드 적용)
- owner: codex
- created_at: 2026-02-18
- completed_at: 2026-02-18
- status: done

## Scope
- `features/ds/cdll/operations.test.ts`
- `docs/task/TASK-012.md`
- `docs/task/INDEX.md`

## Definition of Done
- 테스트 코드의 `as number` 단언이 제거되어야 함
- `assert.notEqual` 대신 타입 가드가 가능한 `assert.ok` 기반 체크가 적용되어야 함
- 테스트/린트가 통과해야 함

## Verification
- `npm run test` 통과 (7 passed)
- `npm run lint` 통과
- `features/ds/cdll/operations.test.ts`의 `as number` 단언 제거 확인

## Notes
- 리뷰 코멘트 반영: 테스트에서 타입 안전성 강화
