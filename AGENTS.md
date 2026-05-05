# Repository Guidelines (Hub)

This document is a summary hub. For detailed rules, refer to `docs/agent/*.md`.

## Mandatory Rules
- Create `docs/task/TASK-XXX.md` before starting any task.
- Whenever a task file is created or its status changes, update `docs/task/INDEX.md` in the same commit.
- Codex execution policies are managed in `.codex/rules/*.rules`.
- Do not use repository-local absolute paths such as `/Users/...` in `docs/*.md` or `docs/task/*.md`; use relative paths only.

## Detailed Policy Documents
- Project structure: `docs/agent/project-structure.md`
- Development commands: `docs/agent/dev-commands.md`
- Coding style: `docs/agent/coding-style.md`
- Testing: `docs/agent/testing.md`
- Commits and pull requests: `docs/agent/commit-pr.md`
- Security and configuration: `docs/agent/security.md`
- Task tracking: `docs/agent/task-tracking.md`
- Codex execution policy: `docs/agent/codex-rules-policy.md`

## Maintenance Principles
- When changing an existing policy, update the relevant detailed document and, if needed, update this hub's links as well.
- When moving documentation paths, update all related references, including `AGENTS.md`, `docs/task/INDEX.md`, and task file notes.
