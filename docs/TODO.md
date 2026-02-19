# TODO — DS/Algorithm GUI Visualizer (Vercel Project)

목표: 알고리즘 문제 풀이에 도움이 되는 **자료구조/알고리즘 시각화 GUI**를 만든다.  
사용자가 값을 직접 입력하고 연산을 실행하면, **과정이 Step-by-step로 재생**되고 **각 Step/연산의 시간·공간 복잡도**가 표시된다.  

---

## 0) 제품 범위 정의 (MVP → 확장)

### MVP (1차 목표)
- 자료구조 1~2개만 완성도 높게
  - 예: **원형 이중 연결 리스트**, 스택(또는 큐)
- 공통 UI 패턴 확립
  - Operation / Value / Position / Execute
  - Step 컨트롤 (Next/Prev/Play/Pause/Reset)
  - Complexity 패널 (Time/Space)
  - 상태 패널 (현재 head/tail/size, 에러 메시지)
- “연산 → 내부 포인터/연결 변화 → Step 로그”가 일관되게 재생

### 2차 목표(확장)
- 선형 자료구조 전반 + 탐색/정렬 알고리즘
- 문제풀이 관점 “패턴 설명(왜 이런 복잡도/왜 이 연산이 필요한지)”
- 실행 기록(연산 시퀀스) 저장/공유

---

## 1) 기술 스택/프로젝트 셋업

- [x] Next.js (App Router) + TypeScript
- [x] Styling: Tailwind
- [ ] 상태관리: 최소는 React state, 확장 대비면 Zustand 고려
- [ ] 애니메이션: 기본 CSS transition + requestAnimationFrame 기반(필요 시) / or Framer Motion(선호 시)
- [x] SVG 기반 렌더링(추천) 또는 Canvas(추후)
- [ ] 배포: Vercel

프로젝트 구조(권장)
- [x] `app/` : 라우팅
- [x] `features/visualizer/` : 공통 시각화 엔진 + UI
- [x] `features/ds/` : 자료구조별 구현(모델 + step generator)
- [ ] `components/ui/` : Button, Select, Input, Badge 등
- [ ] `lib/complexity/` : 복잡도 메타데이터/표시 로직

---

## 2) 핵심 설계: “Step 엔진” 먼저 만들기

### 2.1 Step 데이터 모델 정의
- [x] Step 타입 설계
  - 예시
    - `id`, `title`, `description`
    - `highlights` (노드/엣지 강조)
    - `beforeState` / `afterState` (또는 `snapshot`)
    - `pseudoLine` (의사코드 라인 하이라이트)
    - `complexity` (해당 step 또는 전체 연산 기준)
- [x] Snapshot 규칙
  - “렌더에 필요한 최소 상태”만 포함 (노드/링크/포인터)
  - 순환 구조는 무한 반복 방지용으로 **최대 노드 수 / 방문 체크** 포함

### 2.2 Step 실행/재생 컨트롤
- [x] Stepper Store
  - `steps[]`, `currentIndex`, `isPlaying`, `speed`
  - actions: `loadSteps`, `next`, `prev`, `play`, `pause`, `reset`, `jumpTo(i)`
- [x] Play 모드 구현 (interval + pause 안전 처리)
- [x] Undo/Redo를 “steps index 이동”으로 해결

### 2.3 복잡도 표시 정책
- [x] “연산 단위” 복잡도: Insert/Remove/Search 등
- [ ] “Step 단위”는 보조(선택): 보통은 연산 기준으로 보여주고, step마다 강조만 다르게
- [x] 표준 포맷 통일
  - Time: `O(1)`, `O(n)`, `O(log n)` …
  - Space: `O(1)`, `O(n)` …
- [x] worst/avg/best 표시 옵션(추후) → MVP는 worst만

---

## 3) 공통 UI 레이아웃 (레퍼런스 느낌)

### 3.1 상단 컨트롤 바
- [x] Operation Select (Insert/Remove/Search/…)
- [x] Value Input
- [ ] Position Select (At Head / At Tail / At Index / After Value 등 DS별)
- [x] Execute 버튼
- [x] Random init(n) / Reset

### 3.2 상태/정보 카드
- [x] Data Structure 이름 카드
- [x] Current Step (i / total)
- [x] Time Complexity
- [x] Space Complexity

### 3.3 메인 캔버스(시각화)
- [x] 노드/포인터/링크 렌더링
- [x] 강조(highlight): 현재 작업 대상 노드, 이동 중 포인터 등
- [x] 순환 구조 화살표 표시(원형임을 명확히)

### 3.4 하단 설명 패널
- [x] Step 설명(현재 step title + description)
- [ ] (선택) 의사코드 + 라인 하이라이트
- [ ] (선택) Invariant/주의사항(예: head/tail 연결 유지)

---

## 4) 1호 자료구조: 원형 이중 연결 리스트 (MVP의 중심)

### 4.1 모델(순수 로직)
- [x] Node: `{ id, value, prevId, nextId }`
- [x] List State:
  - `headId`, `tailId`, `size`
  - `nodes: Record<id, Node>`
- [x] Helper:
  - `createNode(value)`
  - `link(a, b)` / `unlink(a, b)` 같은 유틸(권장)

### 4.2 연산별 Step Generator (중요)
각 연산은 “최종 결과”만 내지 말고 **Step 배열을 만들어 반환**해야 함.

- [x] Insert at Head — O(1) time, O(1) extra space(노드 1개)
  - steps 예:
    1) 새 노드 생성
    2) 빈 리스트 처리( head=tail=self-loop )
    3) 기존 head와 연결(prev/next 갱신)
    4) head 포인터 갱신
    5) tail↔head 원형 연결 확인
- [x] Insert at Tail — O(1)
- [x] Remove at Head — O(1)
- [x] Remove at Tail — O(1)
- [x] Search by Value — O(n)
  - step마다 현재 비교 노드 강조 + “n번까지 순회(원형)”
  - 종료 조건: 찾음 / 한 바퀴 돌고 실패

엣지 케이스 Step 포함
- [x] size=0, size=1, size=2
- [ ] remove 시 값 미존재
- [x] search에서 원형 무한루프 방지(visited 카운트)

### 4.3 시각화 규칙(원형/이중)
- [x] next 화살표와 prev 화살표를 방향/스타일로 구분
- [x] head/tail 배지 표시
- [x] 원형 연결( tail.next=head, head.prev=tail )을 시각적으로 명확히

---

## 5) 렌더러: “State → 그래프 레이아웃 → SVG”

### 5.1 레이아웃(간단 버전부터)
- [x] 노드들을 원형(또는 타원)으로 배치
- [ ] size가 커지면 간격 자동 조절
- [x] 노드 좌표 계산: `angle = 2π * i / n`

### 5.2 SVG 렌더
- [x] Node circle + value text
- [x] Arrow marker 정의(next/prev 각각)
- [x] Edge path (곡선/직선)
- [x] Highlight 처리(두께/광택/외곽선 등) — 스타일 통일

### 5.3 애니메이션(최소)
- [ ] step 전환 시 강조/텍스트만 부드럽게 변경
- [ ] (추후) 노드 이동/링크 재배치 트랜지션

---

## 6) 공통 기능 (MVP 품질을 올려주는 것들)

- [x] 입력 검증
  - value가 비었을 때, index 범위 밖일 때 등
- [ ] 에러/경고 토스트 또는 패널
- [x] Random init(n)
  - n개의 랜덤 값으로 리스트 생성 + “초기화 step”은 1step으로 간단히
- [x] Reset (빈 상태로)
- [x] 스피드 조절(0.5x / 1x / 2x)

---

## 7) 문서/학습 요소 (짧아도 효과 큼)

- [ ] 각 DS 페이지에:
  - 정의/특징/장단점
  - 주요 연산 복잡도 표(최악 기준)
  - 흔한 버그 포인트(원형 연결, size=1 삭제 등)
- [ ] “의사코드”는 실제 step generator와 라인 매칭 가능하게

---

## 8) 테스트/품질 체크

- [x] 로직 유닛 테스트(가능하면)
  - size 변동, head/tail 유지, 원형 링크 유지
  - remove/search edge case
- [ ] 시각화 스냅샷 테스트(선택)
- [ ] 성능 체크
  - 노드 수 50~200에서 렌더 느려지지 않게

---

## 9) 라우팅/페이지 구성

- [x] `/` 홈: 자료구조 목록 + 소개
- [x] `/ds/circular-doubly-linked-list` MVP 메인
- [ ] (추후) `/ds/stack`, `/ds/queue`, `/algo/sort/...`

---

## 10) 배포/운영

- [ ] Vercel 배포
- [ ] 기본 SEO (title/description)
- [ ] GitHub README에 데모 GIF/스크린샷 + 사용법

---

## 11) “바이브 코딩”용 구현 순서 추천 (실행 플랜)

1) [ ] Next.js + 기본 레이아웃 + 공통 UI 컴포넌트
2) [ ] Stepper Store + Step Panel + Next/Prev 동작
3) [ ] 원형 이중 연결 리스트 모델 + InsertHead Step Generator
4) [ ] SVG 렌더러(원형 배치)로 steps snapshot을 그리기
5) [ ] InsertTail / RemoveHead / RemoveTail 추가
6) [ ] Search(Value) 추가 + 무한루프 방지
7) [ ] Random init / 입력 검증 / 에러 처리
8) [ ] 문서/의사코드/복잡도 표기 정리 후 배포

---

## 부록 A — 복잡도 메타데이터 예시(구조만)

- Circular Doubly Linked List
  - Insert at Head: Time O(1), Space O(1)
  - Insert at Tail: Time O(1), Space O(1)
  - Remove at Head: Time O(1), Space O(1)
  - Remove at Tail: Time O(1), Space O(1)
  - Search by Value: Time O(n), Space O(1)

(추후 avg/best를 추가하려면 `{ worst, average, best }` 구조로 확장)

---

## 부록 B — Step 아이디어(예: Insert at Head)

Step 1: 새 노드 생성  
Step 2: (빈 리스트면) new.prev=new, new.next=new  
Step 3: (비어있지 않으면) new.next=head, new.prev=tail  
Step 4: head.prev=new, tail.next=new  
Step 5: head=new, size++

각 step에 강조:
- new 노드
- head/tail 포인터
- 갱신되는 링크(화살표)만 강조 표시

---

## 12) 구현 가능성 검토 결과 (Feasibility)

### 12.1 결론
- 현재 TODO 범위는 **기술적으로 구현 가능**하다.
- 다만 MVP 성공을 위해 아래 3가지를 먼저 고정해야 한다.
  1) 상태 표현 방식(참조형 포인터 대신 id 기반 정규화)
  2) Step 생성 계약(입력/출력 타입 및 불변성 원칙)
  3) “완료”의 기준(연산별 수용 기준 + 테스트 기준)

### 12.2 리스크/선결정 항목
- [ ] 상태관리 선택 고정: `React state`로 시작(필요 시 `Zustand`로 승격)
- [x] 스타일링 선택 고정: `Tailwind`
- [ ] Step 데이터의 단일 진실 공급원(SSOT) 고정:
  - 렌더러는 `snapshot`만 읽고, 로직 객체를 직접 참조하지 않음
- [x] 노드 id 정책 고정:
  - MVP 권장: 증가 정수 카운터(`1,2,3...`), 타입은 `number`
- [ ] 플레이 타이머 정책 고정:
  - `setInterval` + `useEffect cleanup` + `pause 시 즉시 clear`

---

## 13) MVP 구체화 스펙 (바로 구현 가능한 기준)

### 13.1 범위 고정 (MVP)
- 포함:
  - DS 1개: `Circular Doubly Linked List`
  - 연산 5개: `insertHead`, `insertTail`, `removeHead`, `removeTail`, `searchValue`
  - Stepper: `next/prev/play/pause/reset/jump`
  - 복잡도 패널: **worst case만**
- 제외(2차로 이관):
  - Stack/Queue
  - 의사코드 라인 하이라이트(선택 기능)
  - 기록 공유/저장

### 13.2 타입 계약 (권장 초안)
- [ ] `features/visualizer/types.ts`
  - `ComplexityMeta`
    - `timeWorst: string`
    - `spaceWorst: string`
  - `VisualNode`
    - `id: string`
    - `value: number | string`
    - `nextId: string`
    - `prevId: string`
  - `ListSnapshot`
    - `nodes: Record<string, VisualNode>`
    - `order: string[]` (렌더 순서, 원형 순회 1바퀴 기준)
    - `headId: string | null`
    - `tailId: string | null`
    - `size: number`
    - `highlights?: { nodeIds?: string[]; edgePairs?: Array<[string, string]>; pointers?: Array<"head"|"tail"|"cursor"> }`
  - `Step`
    - `id: string`
    - `title: string`
    - `description: string`
    - `snapshot: ListSnapshot`
    - `complexity: ComplexityMeta`
    - `isError?: boolean`
  - `OperationResult`
    - `steps: Step[]`
    - `finalState: ListSnapshot`

### 13.3 연산 함수 시그니처
- [ ] `features/ds/cdll/operations.ts`
  - `insertHead(state, value): OperationResult`
  - `insertTail(state, value): OperationResult`
  - `removeHead(state): OperationResult`
  - `removeTail(state): OperationResult`
  - `searchValue(state, value): OperationResult`
- 공통 규칙:
  - 입력 `state`는 불변으로 취급하고 내부에서 복사 후 수정
  - 반환 `steps`의 마지막 `snapshot`은 반드시 `finalState`와 동일
  - 에러 상황도 `steps` 1개 이상 반환(사용자에게 시각적으로 이유 전달)

### 13.4 Stepper Store 수용 기준 (DoD)
- [ ] 초기 상태: `steps=[]`, `currentIndex=0`, `isPlaying=false`
- [ ] `loadSteps` 호출 시:
  - `steps` 교체
  - `currentIndex=0`
  - `isPlaying=false`
- [ ] `next/prev` 범위 보호:
  - 음수 인덱스 및 마지막 초과 이동 금지
- [ ] `play` 동작:
  - 마지막 step 도달 시 자동 `pause`
  - `pause/reset/loadSteps/unmount`에서 타이머 누수 없음

### 13.5 시각화(렌더러) 수용 기준
- [ ] `size=0`: 빈 상태 메시지 노출, 엣지 미표시
- [ ] `size=1`: self-loop를 명시적으로 렌더(원형 확인 가능)
- [ ] `size>=2`: next/prev 화살표 스타일이 서로 구분됨
- [ ] head/tail 배지가 항상 정확한 노드에 표시됨
- [ ] 하이라이트된 노드/엣지는 기본 스타일 대비 명확히 구분됨

### 13.6 입력/에러 정책
- [ ] 공통 검증:
  - value 필수 연산에서 빈 값이면 실행 차단
  - 숫자 모드에서는 숫자 변환 실패 시 차단
- [ ] 에러 표출:
  - 비어있는 리스트에서 remove 시 에러 step 1개 생성
  - search miss는 에러가 아닌 정상 종료(step title: `Not Found`)

### 13.7 테스트 최소 기준
- [ ] 유닛 테스트(필수)
  - `size` 증감 정확성
  - `head/tail` 갱신 정확성
  - `tail.next=head`, `head.prev=tail` 불변식 검증
  - `searchValue`의 최대 순회 횟수는 `size` 이하여야 함
- [ ] 컴포넌트 테스트(선택)
  - Stepper 버튼 상호작용
  - 상태 카드의 step index/complexity 표시

### 13.8 구현 마일스톤 (1주 스프린트 예시)
- Day 1:
  - Next.js 초기화
  - 공통 레이아웃/컨트롤 바/상태 카드
- Day 2:
  - Step 타입/Store 구현 + Step 패널 연결
- Day 3:
  - CDLL 모델 + `insertHead`/`insertTail`
- Day 4:
  - `removeHead`/`removeTail` + 엣지 케이스
- Day 5:
  - `searchValue` + 무한 루프 방지 + 테스트
- Day 6:
  - SVG 렌더 polish + 입력 검증 + 에러 UX
- Day 7:
  - README/문서/배포
