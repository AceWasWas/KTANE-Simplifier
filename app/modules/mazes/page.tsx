"use client";

import { useState } from "react";
import Link from "next/link";
import { modules } from "@/app/data/modules";

type Tab = "manual" | "solver";
type PlaceMode = "c1" | "c2" | "start" | "end";

// hWalls[r][c] = wall between row r and r+1 at column c  (5 rows × 6 cols)
// vWalls[r][c] = wall between col c and c+1 at row r     (6 rows × 5 cols)
interface MazeDef {
  c1: [number, number];
  c2: [number, number];
  h: boolean[][];
  v: boolean[][];
}

// prettier-ignore
const MAZES: MazeDef[] = [
  // Maze 1  circles (1,1) (4,4)
  { c1:[1,1], c2:[4,4],
    h:[[0,1,0,0,1,0],[0,0,1,0,0,0],[1,0,0,1,0,0],[0,0,1,0,0,1],[0,1,0,0,0,0]].map(r=>r.map(Boolean)),
    v:[[1,0,0,1,0],[0,1,0,0,1],[0,0,1,0,0],[1,0,0,0,1],[0,1,0,1,0],[0,0,1,0,0]].map(r=>r.map(Boolean)) },
  // Maze 2  circles (0,1) (3,4)
  { c1:[0,1], c2:[3,4],
    h:[[1,0,0,1,0,0],[0,0,1,0,0,1],[0,1,0,0,1,0],[0,0,0,1,0,0],[1,0,1,0,0,1]].map(r=>r.map(Boolean)),
    v:[[0,0,1,0,0],[1,0,0,0,1],[0,1,0,1,0],[0,0,1,0,0],[1,0,0,1,0],[0,1,0,0,1]].map(r=>r.map(Boolean)) },
  // Maze 3  circles (1,4) (4,1)
  { c1:[1,4], c2:[4,1],
    h:[[0,1,0,0,1,0],[1,0,0,1,0,0],[0,0,1,0,0,1],[0,1,0,0,1,0],[1,0,0,1,0,0]].map(r=>r.map(Boolean)),
    v:[[0,0,1,0,1],[0,1,0,0,0],[1,0,0,1,0],[0,0,1,0,0],[0,1,0,0,1],[1,0,0,1,0]].map(r=>r.map(Boolean)) },
  // Maze 4  circles (3,0) (0,3)
  { c1:[3,0], c2:[0,3],
    h:[[0,0,1,0,1,0],[1,0,0,1,0,0],[0,1,0,0,0,1],[0,0,1,0,0,0],[1,0,0,1,0,1]].map(r=>r.map(Boolean)),
    v:[[1,0,0,1,0],[0,0,1,0,1],[0,1,0,0,0],[1,0,0,1,0],[0,1,0,0,1],[0,0,1,0,0]].map(r=>r.map(Boolean)) },
  // Maze 5  circles (4,0) (0,4)
  { c1:[4,0], c2:[0,4],
    h:[[1,0,0,0,1,0],[0,1,0,1,0,0],[0,0,1,0,0,1],[1,0,0,1,0,0],[0,1,0,0,1,0]].map(r=>r.map(Boolean)),
    v:[[0,1,0,1,0],[1,0,0,0,1],[0,0,1,0,0],[0,1,0,1,0],[1,0,0,0,1],[0,0,1,0,0]].map(r=>r.map(Boolean)) },
  // Maze 6  circles (1,3) (3,1)
  { c1:[1,3], c2:[3,1],
    h:[[0,1,0,1,0,0],[1,0,0,0,1,0],[0,0,1,0,0,1],[0,1,0,1,0,0],[1,0,0,0,0,1]].map(r=>r.map(Boolean)),
    v:[[1,0,1,0,0],[0,1,0,0,1],[0,0,0,1,0],[1,0,1,0,0],[0,1,0,0,1],[0,0,1,0,0]].map(r=>r.map(Boolean)) },
  // Maze 7  circles (5,1) (2,4)
  { c1:[5,1], c2:[2,4],
    h:[[0,0,1,0,0,1],[1,0,0,1,0,0],[0,1,0,0,1,0],[0,0,1,0,0,1],[1,0,0,1,0,0]].map(r=>r.map(Boolean)),
    v:[[0,1,0,0,1],[0,0,1,0,0],[1,0,0,1,0],[0,1,0,0,1],[0,0,1,0,0],[1,0,0,1,0]].map(r=>r.map(Boolean)) },
  // Maze 8  circles (0,5) (5,0)
  { c1:[0,5], c2:[5,0],
    h:[[1,0,0,1,0,0],[0,1,0,0,0,1],[0,0,1,0,1,0],[1,0,0,1,0,0],[0,1,0,0,0,1]].map(r=>r.map(Boolean)),
    v:[[0,0,1,0,1],[1,0,0,1,0],[0,1,0,0,0],[0,0,1,0,1],[1,0,0,1,0],[0,1,0,0,0]].map(r=>r.map(Boolean)) },
  // Maze 9  circles (2,2) (5,3)
  { c1:[2,2], c2:[5,3],
    h:[[0,1,0,0,0,1],[0,0,1,0,1,0],[1,0,0,1,0,0],[0,1,0,0,1,0],[0,0,1,0,0,1]].map(r=>r.map(Boolean)),
    v:[[1,0,0,1,0],[0,0,1,0,1],[0,1,0,0,0],[1,0,0,1,0],[0,1,0,0,1],[0,0,1,0,0]].map(r=>r.map(Boolean)) },
];

function cellKey(r: number, c: number) {
  return `${r},${c}`;
}

function bfs(
  start: [number, number],
  end: [number, number],
  h: boolean[][],
  v: boolean[][]
): [number, number][] | null {
  const [sr, sc] = start;
  const [er, ec] = end;
  if (sr === er && sc === ec) return [start];

  const prev = new Map<string, [number, number] | null>();
  prev.set(cellKey(sr, sc), null);
  const queue: [number, number][] = [[sr, sc]];

  const dirs: [number, number, (r: number, c: number) => boolean][] = [
    [-1, 0, (r, c) => r > 0 && !h[r - 1][c]],
    [1,  0, (r, c) => r < 5 && !h[r][c]],
    [0, -1, (r, c) => c > 0 && !v[r][c - 1]],
    [0,  1, (r, c) => c < 5 && !v[r][c]],
  ];

  while (queue.length > 0) {
    const [r, c] = queue.shift()!;
    for (const [dr, dc, canMove] of dirs) {
      if (!canMove(r, c)) continue;
      const nr = r + dr;
      const nc = c + dc;
      const k = cellKey(nr, nc);
      if (prev.has(k)) continue;
      prev.set(k, [r, c]);
      if (nr === er && nc === ec) {
        const path: [number, number][] = [];
        let cur: [number, number] | null = [nr, nc];
        while (cur) {
          path.unshift(cur);
          cur = prev.get(cellKey(cur[0], cur[1])) ?? null;
        }
        return path;
      }
      queue.push([nr, nc]);
    }
  }
  return null;
}

function identifyMaze(c1: [number, number] | null, c2: [number, number] | null): MazeDef | null {
  if (!c1 || !c2) return null;
  return (
    MAZES.find(
      (m) =>
        (m.c1[0] === c1[0] && m.c1[1] === c1[1] && m.c2[0] === c2[0] && m.c2[1] === c2[1]) ||
        (m.c1[0] === c2[0] && m.c1[1] === c2[1] && m.c2[0] === c1[0] && m.c2[1] === c1[1])
    ) ?? null
  );
}

const DIRECTION_LABEL: Record<string, string> = {
  "-1,0": "U",
  "1,0":  "D",
  "0,-1": "L",
  "0,1":  "R",
};

function MazeSolver() {
  const [mode, setMode] = useState<PlaceMode>("c1");
  const [c1, setC1] = useState<[number, number] | null>(null);
  const [c2, setC2] = useState<[number, number] | null>(null);
  const [start, setStart] = useState<[number, number] | null>(null);
  const [end, setEnd] = useState<[number, number] | null>(null);

  const maze = identifyMaze(c1, c2);

  const path = maze && start && end ? bfs(start, end, maze.h, maze.v) : null;

  const pathSet = new Set(path?.map(([r, c]) => cellKey(r, c)) ?? []);

  const handleCell = (r: number, c: number) => {
    const coord: [number, number] = [r, c];
    if (mode === "c1") { setC1(coord); setMode("c2"); }
    else if (mode === "c2") { setC2(coord); setMode("start"); }
    else if (mode === "start") { setStart(coord); setMode("end"); }
    else if (mode === "end") { setEnd(coord); }
  };

  const reset = () => {
    setC1(null); setC2(null); setStart(null); setEnd(null); setMode("c1");
  };

  const modeLabels: { key: PlaceMode; label: string; color: string }[] = [
    { key: "c1",    label: "Circle 1",   color: "bg-yellow-600" },
    { key: "c2",    label: "Circle 2",   color: "bg-yellow-600" },
    { key: "start", label: "Start",      color: "bg-blue-600" },
    { key: "end",   label: "End (Goal)", color: "bg-red-600" },
  ];

  const cellContent = (r: number, c: number) => {
    if (c1 && c1[0] === r && c1[1] === c) return { symbol: "○", style: "text-yellow-400 font-bold" };
    if (c2 && c2[0] === r && c2[1] === c) return { symbol: "○", style: "text-yellow-400 font-bold" };
    if (start && start[0] === r && start[1] === c) return { symbol: "●", style: "text-blue-400 font-bold" };
    if (end && end[0] === r && end[1] === c) return { symbol: "▲", style: "text-red-400 font-bold" };
    return null;
  };

  // Build move list from path
  const moves: string[] = [];
  if (path) {
    for (let i = 1; i < path.length; i++) {
      const dr = path[i][0] - path[i - 1][0];
      const dc = path[i][1] - path[i - 1][1];
      moves.push(DIRECTION_LABEL[`${dr},${dc}`]);
    }
  }

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Mode selector */}
      <div className="flex flex-wrap gap-2 justify-center">
        {modeLabels.map(({ key, label, color }) => {
          const isSet = key === "c1" ? !!c1 : key === "c2" ? !!c2 : key === "start" ? !!start : !!end;
          return (
            <button
              key={key}
              onClick={() => setMode(key)}
              className={[
                "px-3 py-1.5 rounded text-xs font-semibold transition-colors border",
                mode === key
                  ? `${color} text-white border-transparent`
                  : isSet
                  ? "bg-gray-800 text-gray-400 border-gray-700"
                  : "bg-gray-900 text-gray-500 border-gray-800 hover:border-gray-600",
              ].join(" ")}
            >
              {label}{isSet ? " ✓" : ""}
            </button>
          );
        })}
        <button
          onClick={reset}
          className="px-3 py-1.5 rounded text-xs text-gray-600 hover:text-gray-400 transition-colors"
        >
          Reset
        </button>
      </div>

      {/* Status */}
      {!maze && c1 && c2 && (
        <p className="text-xs text-red-400">
          No maze matches those circle positions. Check placement.
        </p>
      )}
      {maze && (
        <p className="text-xs text-yellow-500 font-mono">
          Maze {MAZES.indexOf(maze) + 1} identified
        </p>
      )}

      {/* Grid */}
      <div className="relative select-none">
        {/* Outer border */}
        <div
          className="border-2 border-white"
          style={{ display: "grid", gridTemplateColumns: `repeat(6, 44px)`, gridTemplateRows: `repeat(6, 44px)` }}
        >
          {Array.from({ length: 6 }, (_, r) =>
            Array.from({ length: 6 }, (_, c) => {
              const inPath = pathSet.has(cellKey(r, c));
              const content = cellContent(r, c);
              const wallRight  = maze ? (c < 5 && maze.v[r][c]) : false;
              const wallBottom = maze ? (r < 5 && maze.h[r][c]) : false;

              return (
                <div
                  key={`${r},${c}`}
                  onClick={() => handleCell(r, c)}
                  className={[
                    "flex items-center justify-center cursor-pointer text-sm transition-colors relative",
                    inPath ? "bg-green-900/50" : "bg-gray-950 hover:bg-gray-800",
                  ].join(" ")}
                  style={{
                    borderRight:  wallRight  ? "3px solid #e5e7eb" : "1px solid #374151",
                    borderBottom: wallBottom ? "3px solid #e5e7eb" : "1px solid #374151",
                  }}
                >
                  {content ? (
                    <span className={content.style}>{content.symbol}</span>
                  ) : inPath ? (
                    <span className="w-2 h-2 rounded-full bg-green-500 opacity-60" />
                  ) : null}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="flex gap-4 text-xs text-gray-500">
        <span className="text-yellow-400">○ circles</span>
        <span className="text-blue-400">● start</span>
        <span className="text-red-400">▲ end</span>
        <span className="text-green-400">■ path</span>
      </div>

      {/* Path result */}
      {path && (
        <div className="w-full max-w-xs space-y-3">
          <div className="rounded-lg p-3 bg-green-950/40 border border-green-700 text-center space-y-1">
            <p className="text-green-400 font-semibold text-sm">
              {moves.length} move{moves.length !== 1 ? "s" : ""}
            </p>
            <div className="flex flex-wrap gap-1 justify-center">
              {moves.map((m, i) => (
                <span
                  key={i}
                  className="w-7 h-7 rounded bg-green-800 text-green-200 text-xs font-bold font-mono flex items-center justify-center"
                >
                  {m}
                </span>
              ))}
            </div>
          </div>
          <p className="text-[10px] text-gray-600 text-center">
            U = up, D = down, L = left, R = right
          </p>
        </div>
      )}

      {start && end && maze && !path && (
        <p className="text-xs text-red-400">No path found. Maze data may not match your manual.</p>
      )}

      {maze && (!start || !end) && (
        <p className="text-xs text-gray-600">
          {!start ? "Click a cell to place the start (white light)." : "Click a cell to place the end (red triangle)."}
        </p>
      )}

      {!maze && (
        <p className="text-xs text-gray-600">
          {!c1 ? "Click a cell to place Circle 1." : !c2 ? "Click a cell to place Circle 2." : ""}
        </p>
      )}

      <p className="text-[10px] text-gray-700 text-center max-w-xs">
        Maze walls are based on the KTANE manual. Verify against your printed copy if the path seems wrong.
      </p>
    </div>
  );
}

export default function MazesPage() {
  const [tab, setTab] = useState<Tab>("manual");
  const mod = modules.find((m) => m.slug === "mazes")!;

  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      <nav className="mb-8">
        <Link href="/" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">
          Back to modules
        </Link>
      </nav>

      <h1 className="text-3xl font-bold text-red-500 mb-6">Mazes</h1>

      <div className="flex gap-1 border-b border-gray-800 mb-8">
        {(["manual", "solver"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={[
              "px-5 py-2 text-sm font-medium capitalize transition-colors border-b-2 -mb-px",
              tab === t
                ? "border-red-500 text-white"
                : "border-transparent text-gray-500 hover:text-gray-300",
            ].join(" ")}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "manual" && (
        <pre className="whitespace-pre-wrap font-mono text-sm leading-7 text-gray-300 bg-gray-900 rounded-lg border border-gray-800 p-6">
          {mod.content}
        </pre>
      )}

      {tab === "solver" && <MazeSolver />}

      <nav className="mt-10 flex justify-between text-sm">
        <Link href="/modules/wire-sequences" className="text-gray-500 hover:text-gray-300 transition-colors">
          Wire Sequences
        </Link>
        <Link href="/modules/passwords" className="text-gray-500 hover:text-gray-300 transition-colors">
          Passwords →
        </Link>
      </nav>
    </main>
  );
}
