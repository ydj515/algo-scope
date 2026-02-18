# Repository Guidelines (Hub)

이 문서는 요약 허브입니다. 세부 규칙은 `docs/agent/*.md`를 참조합니다.

## 절대 규칙
- 작업 시작 전에 `docs/task/TASK-XXX.md`를 생성합니다.
- 작업 파일을 만들거나 상태를 바꿀 때마다 `docs/task/INDEX.md`를 같은 커밋에서 갱신합니다.
- Codex 실행 정책은 `.codex/rules/*.rules`에서 관리합니다.
- `docs/*.md` 및 `docs/task/*.md`에서 저장소 로컬 절대경로(`/Users/...`) 표기를 금지하고 상대경로만 사용합니다.

## 세부 정책 문서
- 프로젝트 구조: `docs/agent/project-structure.md`
- 개발 명령: `docs/agent/dev-commands.md`
- 코딩 스타일: `docs/agent/coding-style.md`
- 테스트: `docs/agent/testing.md`
- 커밋/PR: `docs/agent/commit-pr.md`
- 보안/설정: `docs/agent/security.md`
- 작업 추적: `docs/agent/task-tracking.md`
- Codex 실행 정책: `docs/agent/codex-rules-policy.md`

## 유지보수 원칙
- 기존 정책을 바꿀 때는 해당 세부 문서를 수정하고, 필요하면 이 허브 링크도 함께 갱신합니다.
- 문서 경로를 변경하면 관련 참조(`AGENTS.md`, `docs/task/INDEX.md`, 작업 파일 notes)를 함께 수정합니다.
