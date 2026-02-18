# Task Files

작업 로그는 `docs/task/` 하위의 개별 파일로 관리합니다.

## 파일 규칙
- 파일명: `TASK-XXX.md` (예: `TASK-001.md`)
- 각 파일은 하나의 작업 목표만 포함
- 상태 변경은 파일 내부 필드(`status`)를 갱신
- 경로는 상대경로로 작성하고 절대경로(`/Users/...`)는 사용하지 않음

## INDEX 규칙
- 작업 파일 생성/상태 변경/완료 시 `docs/task/INDEX.md`를 같은 커밋에서 갱신합니다.
- `INDEX.md` 컬럼: `id`, `title`, `status`, `owner`, `created_at`, `completed_at`, `path`
- 정렬: `id` 내림차순(최신이 위)
- `path`는 상대경로(`docs/task/TASK-XXX.md`)로 기록합니다.

## 템플릿
```md
# TASK-000

- id: TASK-000
- title: (작업 제목)
- owner: codex
- created_at: YYYY-MM-DD
- completed_at:
- status: planned

## Scope
- (변경 파일/기능 범위)

## Definition of Done
- (완료 기준 1)
- (완료 기준 2)

## Verification
- (예: npm run lint 통과)
- (예: npm run build 통과)

## Notes
- (의사결정/변경 사유/블로커)
```
