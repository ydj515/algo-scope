# TASK-015

- id: TASK-015
- title: 테스트 산출물 자동 정리 및 git ignore 반영
- owner: codex
- created_at: 2026-02-18
- completed_at: 2026-02-18
- status: done

## Scope
- `.gitignore`
- `package.json`
- `docs/task/TASK-015.md`
- `docs/task/INDEX.md`

## Definition of Done
- `.gitignore`에 `.tmp-test/`가 추가되어야 함
- `npm run test:clean` 스크립트가 추가되어야 함
- `npm run test` 실행 후 `.tmp-test`가 자동 정리되어야 함

## Verification
- `.gitignore`에 `.tmp-test/` 추가 확인
- `npm run test` 통과 및 `test:clean` 자동 실행 확인
- `npm run test:clean` 후 `.tmp-test` 디렉토리 미존재 확인
- `npm run lint` 통과

## Notes
- 사용자 요청: 테스트 후 임시 디렉토리 자동 정리
