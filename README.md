# Algo Scope

알고리즘 문제 풀이 학습을 위한 자료구조/알고리즘 시각화 프로젝트입니다.  
사용자 입력 기반 연산을 실행하고, 내부 상태 변화를 Step 단위로 재생하는 것을 목표로 합니다.

## 프로젝트 목표

- 연산 결과만 보여주는 것이 아니라 **연산 과정**을 시각적으로 설명
- 각 연산에 대한 **시간/공간 복잡도**를 함께 표시
- 문제풀이 관점에서 왜 해당 연산이 필요한지 학습 가능한 UI 제공

자세한 기획/로드맵은 `docs/TODO.md`를 참고합니다.

## MVP 범위

현재 MVP(1차) 기준 핵심 범위는 아래와 같습니다.

- 자료구조: Circular Doubly Linked List
- 연산: `insertHead`, `insertTail`, `removeHead`, `removeTail`, `searchValue`
- 공통 UI:
  - Operation / Value 입력 및 Execute
  - Step 컨트롤(`next`, `prev`, `play`, `pause`, `reset`, `jump`)
  - Complexity 패널(Time/Space)
  - 상태 패널(head/tail/size/error)

## 기술 스택

- Next.js (App Router)
- React + TypeScript
- Tailwind CSS v4
- ESLint (`eslint-config-next`)

## 프로젝트 구조

현재 기본 구조:

- `app`: 라우팅 및 UI 진입점
- `public`: 정적 리소스
- `docs`: 기획/정책/작업 로그 문서
- `.codex/rules`: Codex 실행 정책

예정 구조(구현 진행 시 확장):

- `features/visualizer`: 공통 Step 엔진 및 시각화 로직
- `features/ds`: 자료구조별 모델/연산/step generator
- `components/ui`: 공통 UI 컴포넌트
- `lib/complexity`: 복잡도 메타데이터

## 로컬 실행

```bash
npm install
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 접속.

## 주요 스크립트

```bash
npm run dev     # 개발 서버
npm run lint    # 정적 분석
npm run build   # 프로덕션 빌드
npm run start   # 프로덕션 실행
```

## 개발 규칙 요약

- 작업 시작 전 `docs/task/TASK-XXX.md` 생성
- 작업 상태 변경 시 `docs/task/INDEX.md` 동기화
- 상세 규칙 허브: `AGENTS.md`
- 세부 정책: `docs/agent/*.md`

## 참고 문서

- 제품 기획/범위: `docs/TODO.md`
- 작업 로그 인덱스: `docs/task/INDEX.md`
- 작업 템플릿: `docs/task/README.md`

## 배포

배포 타겟은 Vercel입니다.

```bash
npm run build
```

빌드 성공 후 Vercel 연동으로 배포합니다.
