# Codex Rules Policy

## 역할 분리
- `AGENTS.md`:
  - 코딩 스타일, 문서화, 테스트, 협업 절차 같은 행동 규칙
- `.codex/rules/*.rules`:
  - 명령 실행 승인 정책(allow/prompt/forbidden)

## 기본 정책 파일
- `.codex/rules/default.rules`

## 정책 원칙
- 파괴적 명령은 `forbidden`
- 네트워크/원격 변경 가능 명령은 `prompt`
- 반복적이고 안전한 검증 명령은 `allow`

## 검증 원칙
- 규칙 변경 후 최소 1회 `codex execpolicy check` 수행
- 대표 명령 3종을 확인하는 것을 권장
  - 안전 검증 명령(allow)
  - 파괴적 명령(forbidden)
  - 네트워크/원격 명령(prompt)
