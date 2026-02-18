# TASK-008

- id: TASK-008
- title: CDLL 로직 유닛 테스트 추가
- owner: codex
- created_at: 2026-02-18
- completed_at: 2026-02-18
- status: done

## Scope
- `package.json`
- `vitest.config.ts`
- `features/ds/cdll/operations.test.ts`
- `docs/TODO.md`
- `docs/task/TASK-008.md`
- `docs/task/INDEX.md`

## Definition of Done
- 테스트 러너가 설정되어 `npm run test`로 실행 가능해야 함
- CDLL 핵심 연산의 불변식/엣지케이스 테스트가 포함되어야 함
- 작업 파일과 INDEX가 동기화되어야 함

## Verification
- `npm run test` 통과 (6 passed)
- `npm run lint` 통과

## Notes
- 우선 순수 로직 유닛 테스트부터 추가
