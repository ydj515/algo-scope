# TASK-010

- id: TASK-010
- title: CDLL ID 발급을 전역 상태에서 인스턴스 상태로 전환
- owner: codex
- created_at: 2026-02-18
- completed_at: 2026-02-18
- status: done

## Scope
- `features/visualizer/types.ts`
- `features/ds/cdll/operations.ts`
- `features/ds/cdll/operations.test.ts`
- `docs/task/TASK-010.md`
- `docs/task/INDEX.md`

## Definition of Done
- 모듈 스코프 mutable 카운터가 제거되어야 함
- ID 발급 카운터가 `ListSnapshot` 상태에 포함되어야 함
- 동일 런타임에서 여러 리스트 인스턴스가 독립적으로 ID를 발급해야 함

## Verification
- `npm run test` 통과 (7 passed)
- `npm run lint` 통과
- `npm run build` 통과

## Notes
- PR 리뷰 코멘트 반영: 전역 `nodeIdCounter` 제거
