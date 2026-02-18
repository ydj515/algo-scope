# TASK-001

- id: TASK-001
- title: Codex 규칙 체계 도입(AGENTS + .codex/rules/default.rules)
- owner: codex
- created_at: 2026-02-18
- completed_at: 2026-02-18
- status: done

## Scope
- `AGENTS.md`
- `.codex/rules/default.rules`
- `docs/task/TASK-001.md`

## Definition of Done
- AGENTS에 Codex 규칙 역할 분리가 문서화되어야 함
- `.codex/rules`에 allow/prompt/forbidden 정책이 정의되어야 함
- `codex execpolicy check`로 대표 명령의 판정이 확인되어야 함

## Verification
- `codex execpolicy check --rules .codex/rules/default.rules npm run lint` => allow
- `codex execpolicy check --rules .codex/rules/default.rules git reset --hard` => forbidden
- `codex execpolicy check --rules .codex/rules/default.rules npm install` => prompt
- `npm run lint` 통과
- `npm run build` 실패(네트워크 차단으로 Google Fonts fetch 불가)

## Notes
- 작업 로그를 `docs/task/` 하위 개별 파일 구조로 전환
- build 실패 원인은 코드 결함이 아니라 오프라인 환경의 외부 폰트 다운로드 제약
