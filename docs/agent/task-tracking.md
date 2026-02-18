# Task Tracking Rules

모든 작업은 `docs/task/` 하위 개별 파일로 관리합니다.

## 파일 규칙
- 파일명: `TASK-XXX.md` (예: `TASK-002.md`)
- 하나의 파일은 하나의 작업 목표만 포함
- 경로 표기는 저장소 상대경로만 사용하고, 로컬 절대경로(`/Users/...`)는 사용하지 않음
- 최소 필드:
  - `id`, `title`, `owner`, `created_at`, `status`, `scope`, `definition_of_done`

## 상태 정의
- `planned`: 착수 전, 요구사항 정리 완료
- `in_progress`: 구현/검증 진행 중
- `blocked`: 외부 의존성 또는 의사결정 대기
- `done`: 완료 및 검증 기록 완료

## 자동 INDEX 갱신 규칙 (필수)
- 아래 이벤트가 발생하면 같은 커밋에서 `docs/task/INDEX.md`를 반드시 갱신합니다.
  - 새 `TASK-XXX.md` 생성
  - `status` 변경
  - `title` 변경
  - `completed_at` 변경
- `INDEX.md` 필수 컬럼:
  - `id`, `title`, `status`, `owner`, `created_at`, `completed_at`, `path`
- `path` 컬럼은 상대경로(`docs/task/TASK-XXX.md`)로 작성
- 정렬 규칙:
  - `id` 내림차순(최신 TASK가 위)

## 운영 원칙
- 작업 시작 전 `TASK-XXX.md`를 만들고 `status: planned`로 시작합니다.
- 구현 시작 시 `in_progress`로 변경합니다.
- 완료 시 `status: done`, `completed_at`, `verification`을 채웁니다.
- 작업 파일과 실제 코드 상태가 불일치하면 즉시 동기화합니다.
