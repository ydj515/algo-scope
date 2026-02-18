# TASK-002

- id: TASK-002
- title: AGENTS 허브화 및 정책 문서 분리 + INDEX 자동 갱신 규칙 추가
- owner: codex
- created_at: 2026-02-18
- completed_at: 2026-02-18
- status: done

## Scope
- `AGENTS.md`
- `docs/agent/*.md`
- `docs/task/README.md`
- `docs/task/INDEX.md`
- `docs/task/TASK-002.md`

## Definition of Done
- AGENTS.md가 허브 문서로 축소되어야 함
- 기존 규칙이 `docs/agent/*.md` 개별 문서로 분리되어야 함
- `docs/task/INDEX.md` 자동 갱신 규칙이 문서화되어야 함
- INDEX에 TASK-001, TASK-002가 반영되어야 함

## Verification
- `npm run lint` 통과
- `find docs/agent docs/task -maxdepth 2 -type f`로 분리 문서/작업 인덱스 파일 확인
- `rg -n "docs/TASK.md|codex/rules/default.rules" AGENTS.md docs -S`로 구 경로 참조 제거 확인

## Notes
- 요청에 따라 monolithic AGENTS에서 policy 분리 구조로 전환
