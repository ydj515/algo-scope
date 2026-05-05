# TASK-059

- id: TASK-059
- title: PR 커버리지 코멘트/Step Summary에 이전 실행 대비 증감 정보 단일 메트릭 표로 정리
- owner: codex
- created_at: 2026-05-06
- completed_at: 2026-05-06
- status: done

## 작업 범위
- `.github/workflows/ci.yml`
- `docs/task/TASK-059.md`
- `docs/task/INDEX.md`

## 완료 기준
- PR 커버리지 sticky comment가 이전 실행 수치를 읽어 현재값/이전값/증감/상태를 한 개의 메트릭 표로 표시한다.
- GitHub Step Summary에도 동일한 델타 정보가 노출된다.
- 첫 실행처럼 비교 대상이 없을 때는 적절한 안내를 표시한다.
- `npm run lint`, `npm run typecheck`, `npm run build`, `npm run test`가 모두 성공한다.

## 검증
- `npm run lint` 통과
- `npm run typecheck` 통과
- `npm run build` 통과
- `npm run test` 통과
- PR 커버리지 sticky comment에 현재값/이전값/증감/상태를 한 개의 메트릭 표로 표시함
- GitHub Step Summary에 동일한 단일 메트릭 표가 함께 노출되도록 반영함
