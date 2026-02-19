# TASK-038

- id: TASK-038
- title: 디자인 시스템 점검(토큰/애니메이션/컴포넌트 일관성) Audit
- owner: codex
- created_at: 2026-02-18
- completed_at: 2026-02-18
- status: done

## Scope
- `app/globals.css`
- `features/navigation/components/*.tsx`
- `features/visualizer/components/*.tsx`
- `features/trace/components/*.tsx`
- `app/*.tsx`
- `app/ds/*.tsx`
- `app/problems/*.tsx`
- `docs/task/TASK-038.md`
- `docs/task/INDEX.md`

## Definition of Done
- 전역 토큰 구조(색/간격/반경/모션) 존재 여부를 점검해야 함
- 애니메이션/트랜지션 사용 분포와 누락 지점을 점검해야 함
- 공통 컴포넌트(버튼/카드/패널) 재사용 수준을 점검해야 함
- 개선 우선순위(단기/중기)를 제시해야 함

## Verification
- `rg` 기반 코드 스캔으로 스타일/애니메이션 사용 지점 확인
- `app/globals.css` 전역 토큰 정의 범위 확인
- Shell/Navigation/Home/Hub 페이지 클래스 중복 패턴 확인
