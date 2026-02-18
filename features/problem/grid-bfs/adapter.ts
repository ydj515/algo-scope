import type { ProblemTraceAdapter } from "@/features/trace/adapter";
import type { TraceComplexity, TraceResult, TraceStep } from "@/features/trace/types";

export type Coord = { row: number; col: number };

export type GridBfsInput = {
  rows: string;
  cols: string;
  startRow: string;
  startCol: string;
  goalRow: string;
  goalCol: string;
  walls: string;
  map: string;
  mapMode: string;
  blockedValues: string;
  showCellValues: string;
};

export type GridBfsSnapshot = {
  rows: number;
  cols: number;
  start: Coord;
  goal: Coord;
  walls: Coord[];
  matrixValues?: number[][];
  showCellValues: boolean;
  visited: Coord[];
  frontier: Coord[];
  current: Coord | null;
  path: Coord[];
  expanded: number;
  queueSize: number;
  message?: string;
};

type ParsedInput = {
  rows: number;
  cols: number;
  start: Coord;
  goal: Coord;
  walls: Coord[];
  matrixValues?: number[][];
  showCellValues: boolean;
};

type MutableState = {
  rows: number;
  cols: number;
  start: Coord;
  goal: Coord;
  walls: Coord[];
  matrixValues?: number[][];
  showCellValues: boolean;
  wallSet: Set<string>;
  visitedSet: Set<string>;
  frontier: Coord[];
  queue: Coord[];
  parent: Record<string, string | null>;
  current: Coord | null;
  path: Coord[];
  expanded: number;
  message?: string;
};

const BFS_COMPLEXITY: TraceComplexity = {
  timeWorst: "O(R*C)",
  spaceWorst: "O(R*C)",
};

const DIRECTIONS: Array<[number, number]> = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
];

function keyOf(coord: Coord): string {
  return `${coord.row},${coord.col}`;
}

function parseCoordKey(key: string): Coord {
  const [row, col] = key.split(",").map((value) => Number(value));
  return { row, col };
}

function parsePositiveInt(label: string, value: string): number {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new Error(`${label}는 1 이상의 정수여야 합니다.`);
  }
  return parsed;
}

function parseIntInRange(label: string, value: string, min: number, max: number): number {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < min || parsed > max) {
    throw new Error(`${label}는 ${min} 이상 ${max} 이하 정수여야 합니다.`);
  }
  return parsed;
}

function parseWallsText(wallsText: string): Coord[] {
  const trimmed = wallsText.trim();
  if (trimmed === "") {
    return [];
  }

  return trimmed
    .split(";")
    .map((token) => token.trim())
    .filter((token) => token.length > 0)
    .map((token) => {
      const [row, col] = token.split(",").map((value) => Number(value.trim()));
      if (!Number.isInteger(row) || !Number.isInteger(col)) {
        throw new Error("walls는 'r,c;r,c' 형식이어야 합니다.");
      }
      return { row, col };
    });
}

function stringifyWalls(walls: Coord[]): string {
  return walls.map((wall) => `${wall.row},${wall.col}`).join(";");
}

function parseBlockedValueMatchers(blockedValuesText: string): Array<(value: number) => boolean> {
  const tokens = blockedValuesText
    .split(",")
    .map((token) => token.trim())
    .filter((token) => token.length > 0);

  if (tokens.length === 0) {
    return [];
  }

  return tokens.map((token) => {
    const match = token.match(/^(<=|>=|<|>|==|!=)?\s*(-?\d+(?:\.\d+)?)$/);
    if (!match) {
      throw new Error("blockedValues는 숫자 또는 비교식이어야 합니다. 예: 0,-1,<=2,>5");
    }

    const operator = match[1] ?? "==";
    const threshold = Number(match[2]);

    switch (operator) {
      case "<":
        return (value: number) => value < threshold;
      case "<=":
        return (value: number) => value <= threshold;
      case ">":
        return (value: number) => value > threshold;
      case ">=":
        return (value: number) => value >= threshold;
      case "!=":
        return (value: number) => value !== threshold;
      case "==":
      default:
        return (value: number) => value === threshold;
    }
  });
}

function parseBinaryGridMap(mapText: string): { rows: number; cols: number; walls: Coord[] } {
  const lines = mapText
    .trim()
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  if (lines.length === 0) {
    throw new Error("map이 비어 있습니다.");
  }

  const cols = lines[0].length;
  if (cols === 0) {
    throw new Error("map의 각 줄은 최소 1글자 이상이어야 합니다.");
  }

  const walls: Coord[] = [];

  lines.forEach((line, row) => {
    if (line.length !== cols) {
      throw new Error("map의 모든 줄 길이는 같아야 합니다.");
    }

    for (let col = 0; col < cols; col += 1) {
      const cell = line[col];
      if (cell !== "0" && cell !== "1") {
        throw new Error("map은 0과 1로만 구성되어야 합니다.");
      }

      if (cell === "0") {
        walls.push({ row, col });
      }
    }
  });

  return {
    rows: lines.length,
    cols,
    walls,
  };
}

function parseMatrixGridMap(
  mapText: string,
  blockedValuesText: string,
): { rows: number; cols: number; walls: Coord[]; matrixValues: number[][] } {
  const lines = mapText
    .trim()
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  if (lines.length === 0) {
    throw new Error("map이 비어 있습니다.");
  }

  const rowsData = lines.map((line) =>
    line
      .split(/\s+/)
      .map((token) => {
        const value = Number(token);
        if (!Number.isFinite(value)) {
          throw new Error("matrix 모드에서는 공백 구분 숫자만 입력 가능합니다.");
        }
        return value;
      }),
  );

  const cols = rowsData[0].length;
  if (cols === 0) {
    throw new Error("matrix map의 각 줄은 최소 1개 숫자가 필요합니다.");
  }

  rowsData.forEach((row) => {
    if (row.length !== cols) {
      throw new Error("matrix map의 모든 줄 길이는 같아야 합니다.");
    }
  });

  const matchers = parseBlockedValueMatchers(blockedValuesText);
  const walls: Coord[] = [];

  for (let row = 0; row < rowsData.length; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      if (matchers.some((matcher) => matcher(rowsData[row][col]))) {
        walls.push({ row, col });
      }
    }
  }

  return {
    rows: rowsData.length,
    cols,
    walls,
    matrixValues: rowsData,
  };
}

function parseMapByMode(
  mapText: string,
  mapMode: string,
  blockedValuesText: string,
): { rows: number; cols: number; walls: Coord[]; matrixValues?: number[][] } {
  if (mapMode === "matrix") {
    return parseMatrixGridMap(mapText, blockedValuesText);
  }
  return parseBinaryGridMap(mapText);
}

function parseGridBfsInput(input: GridBfsInput): ParsedInput {
  const hasMap = input.map.trim().length > 0;
  const inferred = hasMap
    ? parseMapByMode(input.map, input.mapMode, input.blockedValues)
    : null;

  const rows = inferred ? inferred.rows : parsePositiveInt("rows", input.rows);
  const cols = inferred ? inferred.cols : parsePositiveInt("cols", input.cols);
  const start = {
    row: parseIntInRange("startRow", input.startRow, 0, rows - 1),
    col: parseIntInRange("startCol", input.startCol, 0, cols - 1),
  };
  const goal = inferred
    ? { row: rows - 1, col: cols - 1 }
    : {
        row: parseIntInRange("goalRow", input.goalRow, 0, rows - 1),
        col: parseIntInRange("goalCol", input.goalCol, 0, cols - 1),
      };

  const walls = inferred ? inferred.walls : parseWallsText(input.walls);
  const showCellValues = input.showCellValues === "true";
  const uniqueWallKeys = new Set<string>();
  const dedupedWalls: Coord[] = [];

  for (const wall of walls) {
    if (wall.row < 0 || wall.row >= rows || wall.col < 0 || wall.col >= cols) {
      throw new Error("walls 좌표가 grid 범위를 벗어났습니다.");
    }

    const wallKey = keyOf(wall);

    // map 기반 자동 추론에서는 start/goal이 조건식에 걸려도 탐색 가능해야 하므로 제외한다.
    if (wallKey === keyOf(start) || wallKey === keyOf(goal)) {
      continue;
    }

    if (!uniqueWallKeys.has(wallKey)) {
      uniqueWallKeys.add(wallKey);
      dedupedWalls.push(wall);
    }
  }

  return {
    rows,
    cols,
    start,
    goal,
    walls: dedupedWalls,
    matrixValues: inferred?.matrixValues,
    showCellValues,
  };
}

function serializeInput(input: GridBfsInput): string {
  const parsed = parseGridBfsInput(input);
  const map = input.map.trim();
  const json = {
    rows: parsed.rows,
    cols: parsed.cols,
    start: [parsed.start.row, parsed.start.col],
    goal: [parsed.goal.row, parsed.goal.col],
    mapMode: input.mapMode,
    blockedValues: input.mapMode === "matrix" ? input.blockedValues : undefined,
    map: map === "" ? undefined : map,
    walls: parsed.walls.map((wall) => [wall.row, wall.col]),
  };

  return JSON.stringify(json, null, 2);
}

function parseInputText(text: string): GridBfsInput {
  const parsed = JSON.parse(text) as {
    rows?: number;
    cols?: number;
    start?: [number, number];
    goal?: [number, number];
    map?: string | string[];
    mapMode?: string;
    blockedValues?: string | number[];
    showCellValues?: string | boolean;
    walls?: Array<[number, number]>;
  };

  if (!Array.isArray(parsed.start) || parsed.start.length !== 2) {
    throw new Error("start는 [row, col] 배열이어야 합니다.");
  }

  const map =
    typeof parsed.map === "string"
      ? parsed.map
      : Array.isArray(parsed.map)
        ? parsed.map.join("\n")
        : "";

  if (!Array.isArray(parsed.goal) && map.trim() === "") {
    throw new Error("goal는 [row, col] 배열이어야 합니다.");
  }

  const walls = Array.isArray(parsed.walls)
    ? parsed.walls.map((wall) => {
        if (!Array.isArray(wall) || wall.length !== 2) {
          throw new Error("walls는 [[row,col], ...] 형식이어야 합니다.");
        }
        return `${wall[0]},${wall[1]}`;
      }).join(";")
    : "";

  const goal = Array.isArray(parsed.goal) ? parsed.goal : [0, 0];
  const blockedValues = Array.isArray(parsed.blockedValues)
    ? parsed.blockedValues.join(",")
    : String(parsed.blockedValues ?? "");
  const showCellValues = String(parsed.showCellValues ?? "false");

  return {
    rows: String(parsed.rows ?? ""),
    cols: String(parsed.cols ?? ""),
    startRow: String(parsed.start[0]),
    startCol: String(parsed.start[1]),
    goalRow: String(goal[0]),
    goalCol: String(goal[1]),
    walls,
    map,
    mapMode: parsed.mapMode === "matrix" ? "matrix" : "binary",
    blockedValues,
    showCellValues: showCellValues === "true" ? "true" : "false",
  };
}

function snapshotFrom(state: MutableState): GridBfsSnapshot {
  return {
    rows: state.rows,
    cols: state.cols,
    start: state.start,
    goal: state.goal,
    walls: [...state.walls],
    matrixValues: state.matrixValues ? state.matrixValues.map((row) => [...row]) : undefined,
    showCellValues: state.showCellValues,
    visited: Array.from(state.visitedSet).map(parseCoordKey),
    frontier: [...state.frontier],
    current: state.current,
    path: [...state.path],
    expanded: state.expanded,
    queueSize: state.queue.length,
    message: state.message,
  };
}

function makeStep(
  id: string,
  title: string,
  description: string,
  phase: TraceStep<GridBfsSnapshot>["phase"],
  state: MutableState,
  isError = false,
): TraceStep<GridBfsSnapshot> {
  return {
    id,
    title,
    description,
    phase,
    snapshot: snapshotFrom(state),
    complexity: BFS_COMPLEXITY,
    isError,
  };
}

function inBounds(row: number, col: number, rows: number, cols: number): boolean {
  return row >= 0 && row < rows && col >= 0 && col < cols;
}

function reconstructPath(parent: Record<string, string | null>, goalKey: string): Coord[] {
  const path: Coord[] = [];
  let cursor: string | null = goalKey;

  while (cursor) {
    path.push(parseCoordKey(cursor));
    cursor = parent[cursor] ?? null;
  }

  path.reverse();
  return path;
}

function runBfs(parsed: ParsedInput): TraceResult<GridBfsSnapshot> {
  const startKey = keyOf(parsed.start);
  const goalKey = keyOf(parsed.goal);

  const state: MutableState = {
    rows: parsed.rows,
    cols: parsed.cols,
    start: parsed.start,
    goal: parsed.goal,
    walls: parsed.walls,
    matrixValues: parsed.matrixValues,
    showCellValues: parsed.showCellValues,
    wallSet: new Set(parsed.walls.map(keyOf)),
    visitedSet: new Set([startKey]),
    frontier: [parsed.start],
    queue: [parsed.start],
    parent: { [startKey]: null },
    current: null,
    path: [],
    expanded: 0,
  };

  const steps: Array<TraceStep<GridBfsSnapshot>> = [
    makeStep(
      "bfs-init",
      "초기화",
      "시작 노드를 frontier에 넣고 BFS를 시작합니다.",
      "enter",
      state,
    ),
  ];

  let stepCount = 1;

  while (state.queue.length > 0) {
    const current = state.queue.shift();
    if (!current) {
      break;
    }

    state.current = current;
    state.frontier = state.queue.slice();
    state.expanded += 1;

    steps.push(
      makeStep(
        `bfs-enter-${stepCount}`,
        "노드 확장",
        `(${current.row}, ${current.col})를 큐에서 꺼내 확장합니다.`,
        "enter",
        state,
      ),
    );
    stepCount += 1;

    const currentKey = keyOf(current);
    if (currentKey === goalKey) {
      state.path = reconstructPath(state.parent, goalKey);
      state.message = `목표 도달: 경로 길이 ${state.path.length - 1}`;

      steps.push(
        makeStep(
          `bfs-exit-success-${stepCount}`,
          "탐색 성공",
          "목표 지점에 도달해 최단 경로를 복원했습니다.",
          "exit",
          state,
        ),
      );

      return {
        steps,
        finalSnapshot: snapshotFrom(state),
      };
    }

    for (const [dr, dc] of DIRECTIONS) {
      const nr = current.row + dr;
      const nc = current.col + dc;

      if (!inBounds(nr, nc, state.rows, state.cols)) {
        steps.push(
          makeStep(
            `bfs-prune-oob-${stepCount}`,
            "가지치기",
            `(${nr}, ${nc})는 grid 밖이라 제외합니다.`,
            "prune",
            state,
          ),
        );
        stepCount += 1;
        continue;
      }

      const next: Coord = { row: nr, col: nc };
      const nextKey = keyOf(next);

      if (state.wallSet.has(nextKey)) {
        steps.push(
          makeStep(
            `bfs-prune-wall-${stepCount}`,
            "가지치기",
            `(${nr}, ${nc})는 벽이라 제외합니다.`,
            "prune",
            state,
          ),
        );
        stepCount += 1;
        continue;
      }

      if (state.visitedSet.has(nextKey)) {
        steps.push(
          makeStep(
            `bfs-prune-visited-${stepCount}`,
            "가지치기",
            `(${nr}, ${nc})는 이미 방문해서 제외합니다.`,
            "prune",
            state,
          ),
        );
        stepCount += 1;
        continue;
      }

      state.visitedSet.add(nextKey);
      state.parent[nextKey] = currentKey;
      state.queue.push(next);
      state.frontier = state.queue.slice();

      steps.push(
        makeStep(
          `bfs-update-enqueue-${stepCount}`,
          "이웃 추가",
          `(${nr}, ${nc})를 frontier에 추가합니다.`,
          "update",
          state,
        ),
      );
      stepCount += 1;
    }
  }

  state.current = null;
  state.path = [];
  state.message = "목표 지점에 도달하지 못했습니다.";
  steps.push(
    makeStep(
      `bfs-exit-fail-${stepCount}`,
      "탐색 실패",
      "frontier를 모두 소진했지만 목표를 찾지 못했습니다.",
      "exit",
      state,
      true,
    ),
  );

  return {
    steps,
    finalSnapshot: snapshotFrom(state),
  };
}

export const gridBfsAdapter: ProblemTraceAdapter<GridBfsInput, GridBfsSnapshot> = {
  id: "grid-bfs",
  title: "Grid BFS Trace",
  description:
    "문제를 그래프(grid)로 보고 BFS 탐색/가지치기/경로 복원을 step 단위로 시각화합니다.",
  inputFields: [
    {
      key: "mapMode",
      label: "mapMode",
      type: "select",
      options: [
        { label: "binary (101011)", value: "binary" },
        { label: "matrix (공백 숫자)", value: "matrix" },
      ],
      helperText: "입력 map의 형식을 선택합니다.",
      group: "Map 입력(권장)",
    },
    {
      key: "blockedValues",
      label: "blockedValues (matrix 전용)",
      type: "text",
      placeholder: "예: 0,-1",
      helperText: "숫자 목록/조건식(예: 0,-1,<=2,>5)",
      group: "Map 입력(권장)",
      visible: (input) => input.mapMode === "matrix",
    },
    {
      key: "showCellValues",
      label: "showCellValues",
      type: "select",
      options: [
        { label: "표시 안함", value: "false" },
        { label: "숫자 표시", value: "true" },
      ],
      helperText: "matrix 모드에서 셀 숫자 오버레이 표시 여부",
      group: "Map 입력(권장)",
      visible: (input) => input.mapMode === "matrix",
    },
    {
      key: "map",
      label: "map",
      type: "textarea",
      placeholder:
        "binary 예:\n101111\n101010\n\nmatrix 예:\n6 8 2 6 2\n3 2 3 4 6",
      helperText:
        "map을 입력하면 rows/cols/walls는 자동 추론됩니다. matrix 모드는 blockedValues를 사용합니다.",
      group: "Map 입력(권장)",
    },
    {
      key: "startRow",
      label: "startRow",
      type: "number",
      required: true,
      helperText: "시작 행 인덱스(0-based)",
      group: "시작/목표 좌표",
    },
    {
      key: "startCol",
      label: "startCol",
      type: "number",
      required: true,
      helperText: "시작 열 인덱스(0-based)",
      group: "시작/목표 좌표",
    },
    {
      key: "goalRow",
      label: "goalRow",
      type: "number",
      required: true,
      helperText: "목표 행 인덱스(0-based, map 사용 시 자동 세팅)",
      group: "시작/목표 좌표",
    },
    {
      key: "goalCol",
      label: "goalCol",
      type: "number",
      required: true,
      helperText: "목표 열 인덱스(0-based, map 사용 시 자동 세팅)",
      group: "시작/목표 좌표",
    },
    {
      key: "rows",
      label: "행(rows)",
      type: "number",
      required: true,
      helperText: "grid 행 개수(map 사용 시 자동 세팅)",
      group: "수동 설정(map 미사용 시)",
    },
    {
      key: "cols",
      label: "열(cols)",
      type: "number",
      required: true,
      helperText: "grid 열 개수(map 사용 시 자동 세팅)",
      group: "수동 설정(map 미사용 시)",
    },
    {
      key: "walls",
      label: "walls (r,c;r,c)",
      type: "textarea",
      placeholder: "예: 1,1;1,2;2,2",
      helperText: "수동 벽 좌표 목록(map 사용 시 자동 세팅)",
      group: "수동 설정(map 미사용 시)",
    },
  ],
  createDefaultInput: () => ({
    rows: "6",
    cols: "8",
    startRow: "0",
    startCol: "0",
    goalRow: "5",
    goalCol: "7",
    walls: "1,1;1,2;2,2;3,2;4,4;4,5",
    map: "",
    mapMode: "binary",
    blockedValues: "0",
    showCellValues: "false",
  }),
  normalizeFormInput: (input) => {
    const trimmedMap = input.map.trim();
    if (trimmedMap === "") {
      return input;
    }

    try {
      const inferred = parseMapByMode(trimmedMap, input.mapMode, input.blockedValues);
      return {
        ...input,
        rows: String(inferred.rows),
        cols: String(inferred.cols),
        goalRow: String(inferred.rows - 1),
        goalCol: String(inferred.cols - 1),
        walls: stringifyWalls(inferred.walls),
      };
    } catch {
      return input;
    }
  },
  serializeInput: (input) => {
    try {
      return serializeInput(input);
    } catch {
      return JSON.stringify(
        {
          rows: Number(input.rows) || 0,
          cols: Number(input.cols) || 0,
          start: [Number(input.startRow) || 0, Number(input.startCol) || 0],
          goal: [Number(input.goalRow) || 0, Number(input.goalCol) || 0],
          mapMode: input.mapMode,
          blockedValues: input.blockedValues || undefined,
          showCellValues: input.showCellValues,
          map: input.map.trim() || undefined,
          walls: input.walls
            .split(";")
            .map((token) => token.trim())
            .filter((token) => token.length > 0)
            .map((token) => token.split(",").map((v) => Number(v.trim()))),
        },
        null,
        2,
      );
    }
  },
  parseInputText: (text) => {
    try {
      const parsed = parseInputText(text);
      parseGridBfsInput(parsed);
      return { ok: true, value: parsed };
    } catch (error) {
      return {
        ok: false,
        error: error instanceof Error ? error.message : "입력 파싱에 실패했습니다.",
      };
    }
  },
  run: (input) => {
    try {
      return runBfs(parseGridBfsInput(input));
    } catch (error) {
      const message = error instanceof Error ? error.message : "입력 검증에 실패했습니다.";
      const fallback: GridBfsSnapshot = {
        rows: 1,
        cols: 1,
        start: { row: 0, col: 0 },
        goal: { row: 0, col: 0 },
        walls: [],
        showCellValues: false,
        visited: [],
        frontier: [],
        current: null,
        path: [],
        expanded: 0,
        queueSize: 0,
        message,
      };

      return {
        steps: [
          {
            id: "grid-bfs-invalid-input",
            title: "입력 오류",
            description: message,
            phase: "prune",
            snapshot: fallback,
            complexity: BFS_COMPLEXITY,
            isError: true,
          },
        ],
        finalSnapshot: fallback,
      };
    }
  },
  getSnapshotSummary: (snapshot) => ({
    rows: snapshot.rows,
    cols: snapshot.cols,
    visited: snapshot.visited.length,
    frontier: snapshot.frontier.length,
    expanded: snapshot.expanded,
    path: snapshot.path.length,
  }),
};
