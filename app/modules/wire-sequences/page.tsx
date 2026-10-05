"use client";

import { useState } from "react";
import Link from "next/link";
import { modules } from "@/app/data/modules";

type Tab = "manual" | "solver";
type WColor = "red" | "blue" | "black";
type Dest = "A" | "B" | "C";

interface PanelWire {
  color: WColor | null;
  dest: Dest | null;
}

const CUT_RULES: Record<WColor, string[]> = {
  red:   ["C", "B", "A", "AC", "B", "AC", "ABC", "AB", "B"],
  blue:  ["B", "AC", "B", "A", "B", "BC", "C", "AC", "A"],
  black: ["ABC", "AC", "B", "AC", "B", "BC", "AB", "C", "C"],
};

function shouldCut(color: WColor, occurrence: number, dest: Dest): boolean {
  if (occurrence > 9) return false;
  return CUT_RULES[color][occurrence - 1].includes(dest);
}

const COLOR_STYLE: Record<WColor, { line: string; badge: string; text: string }> = {
  red:   { line: "bg-red-500",   badge: "bg-red-700 text-white",   text: "Red" },
  blue:  { line: "bg-blue-500",  badge: "bg-blue-700 text-white",  text: "Blue" },
  black: { line: "bg-gray-300",  badge: "bg-gray-700 text-white",  text: "Black" },
};

function emptyPanel(): PanelWire[] {
  return [
    { color: null, dest: null },
    { color: null, dest: null },
    { color: null, dest: null },
  ];
}

function WireSeqSolver() {
  const [counts, setCounts] = useState<Record<WColor, number>>({ red: 0, blue: 0, black: 0 });
  const [panel, setPanel] = useState<PanelWire[]>(emptyPanel());
  const [panelNum, setPanelNum] = useState(1);
  const [openPicker, setOpenPicker] = useState<number | null>(null);

  const setColor = (i: number, color: WColor | null) => {
    setPanel((p) => { const n = [...p]; n[i] = { color, dest: null }; return n; });
    setOpenPicker(null);
  };

  const setDest = (i: number, dest: Dest) => {
    setPanel((p) => { const n = [...p]; n[i] = { ...n[i], dest }; return n; });
  };

  const computeOccurrence = (wireIndex: number): number => {
    const color = panel[wireIndex].color;
    if (!color) return 0;
    let local = 0;
    for (let j = 0; j <= wireIndex; j++) {
      if (panel[j].color === color) local++;
    }
    return counts[color] + local;
  };

  const nextPanel = () => {
    const newCounts = { ...counts };
    for (const w of panel) {
      if (w.color) newCounts[w.color]++;
    }
    setCounts(newCounts);
    setPanel(emptyPanel());
    setPanelNum((n) => n + 1);
    setOpenPicker(null);
  };

  const reset = () => {
    setCounts({ red: 0, blue: 0, black: 0 });
    setPanel(emptyPanel());
    setPanelNum(1);
    setOpenPicker(null);
  };

  const anyWire = panel.some((w) => w.color !== null);

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Module visual */}
      <div className="relative rounded-lg border-2 border-gray-700 bg-gray-950 p-3 w-64">
        <div className="absolute top-2 right-2 w-3 h-3 rounded-full bg-gray-400 border-2 border-gray-300" />
        <div className="flex items-center gap-2 mt-5">
          {/* Up/down panel arrows */}
          <div className="flex flex-col gap-1">
            <div className="w-5 h-4 bg-gray-800 rounded text-[8px] text-gray-600 flex items-center justify-center">▲</div>
            <div className="w-5 h-4 bg-gray-800 rounded text-[8px] text-gray-600 flex items-center justify-center">▼</div>
          </div>
          {/* Wire lines */}
          <div className="flex-1 space-y-2.5 py-1">
            {panel.map((w, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <div className={`flex-1 h-1.5 rounded-full ${w.color ? COLOR_STYLE[w.color].line : "bg-gray-700"}`} />
              </div>
            ))}
          </div>
          {/* A/B/C labels */}
          <div className="flex flex-col gap-2 text-xs font-mono font-bold text-gray-500 text-right">
            {(["A", "B", "C"] as Dest[]).map((d) => (
              <span key={d}>{d}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Panel header */}
      <div className="flex items-center gap-4">
        <p className="text-sm font-semibold text-white">Panel {panelNum}</p>
        <div className="flex gap-3 text-xs text-gray-600 font-mono">
          <span>R: {counts.red}</span>
          <span>B: {counts.blue}</span>
          <span>K: {counts.black}</span>
        </div>
      </div>

      {/* Wire rows */}
      <div className="w-full max-w-sm space-y-2">
        {panel.map((w, i) => {
          const occ = w.color ? computeOccurrence(i) : 0;
          const cut = w.color && w.dest ? shouldCut(w.color, occ, w.dest) : null;
          const maxed = w.color ? occ > 9 : false;

          return (
            <div
              key={i}
              className="flex items-center gap-2 bg-gray-900 border border-gray-800 rounded-lg px-3 py-2"
            >
              <span className="text-xs text-gray-600 font-mono w-4 shrink-0">{i + 1}</span>

              {/* Color picker */}
              <div className="relative">
                <button
                  onClick={() => setOpenPicker(openPicker === i ? null : i)}
                  className={[
                    "px-2.5 py-1 rounded text-xs font-semibold transition-colors w-14 text-center",
                    w.color
                      ? COLOR_STYLE[w.color].badge
                      : "bg-gray-800 text-gray-500 hover:bg-gray-700",
                  ].join(" ")}
                >
                  {w.color ? COLOR_STYLE[w.color].text : "Color"}
                </button>
                {openPicker === i && (
                  <div className="absolute left-0 top-full mt-1 z-30 bg-gray-900 border border-gray-700 rounded-lg p-1.5 flex flex-col gap-1 shadow-xl w-20">
                    {(["red", "blue", "black"] as WColor[]).map((c) => (
                      <button
                        key={c}
                        onClick={() => setColor(i, c)}
                        className={`w-full py-1 rounded text-xs font-semibold transition-colors ${COLOR_STYLE[c].badge}`}
                      >
                        {COLOR_STYLE[c].text}
                      </button>
                    ))}
                    {w.color && (
                      <button
                        onClick={() => setColor(i, null)}
                        className="w-full py-1 rounded text-xs text-gray-600 hover:text-gray-400 transition-colors"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Dest picker */}
              <div className="flex gap-1">
                {(["A", "B", "C"] as Dest[]).map((d) => (
                  <button
                    key={d}
                    onClick={() => w.color && setDest(i, d)}
                    disabled={!w.color}
                    className={[
                      "w-7 h-7 rounded text-xs font-mono font-bold transition-colors",
                      w.dest === d
                        ? "bg-indigo-600 text-white"
                        : w.color
                        ? "bg-gray-800 text-gray-400 hover:bg-gray-700"
                        : "bg-gray-900 text-gray-700 cursor-not-allowed",
                    ].join(" ")}
                  >
                    {d}
                  </button>
                ))}
              </div>

              <span className="flex-1" />

              {/* Occurrence */}
              {w.color && (
                <span className="text-[10px] text-gray-600 font-mono">
                  {maxed ? "max" : `#${occ}`}
                </span>
              )}

              {/* Result */}
              {cut === true && (
                <span className="text-xs font-bold text-green-400 w-10 text-right">CUT</span>
              )}
              {cut === false && (
                <span className="text-xs font-bold text-red-400 w-10 text-right">SKIP</span>
              )}
              {cut === null && w.color && (
                <span className="text-xs text-gray-600 w-10 text-right">set dest</span>
              )}
              {!w.color && <span className="w-10" />}
            </div>
          );
        })}
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={nextPanel}
          disabled={!anyWire}
          className="px-4 py-2 rounded bg-indigo-700 hover:bg-indigo-600 disabled:bg-gray-800 disabled:text-gray-600 text-white text-sm font-semibold transition-colors"
        >
          Next Panel
        </button>
        <button
          onClick={reset}
          className="px-4 py-2 rounded bg-gray-800 hover:bg-gray-700 text-gray-400 text-xs transition-colors"
        >
          Reset
        </button>
      </div>

      {/* Backdrop */}
      {openPicker !== null && (
        <div className="fixed inset-0 z-20" onClick={() => setOpenPicker(null)} />
      )}
    </div>
  );
}

export default function WireSequencesPage() {
  const [tab, setTab] = useState<Tab>("manual");
  const mod = modules.find((m) => m.slug === "wire-sequences")!;

  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      <nav className="mb-8">
        <Link href="/" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">
          Back to modules
        </Link>
      </nav>

      <h1 className="text-3xl font-bold text-red-500 mb-6">Wire Sequences</h1>

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

      {tab === "solver" && <WireSeqSolver />}

      <nav className="mt-10 flex justify-between text-sm">
        <Link href="/modules/complicated-wires" className="text-gray-500 hover:text-gray-300 transition-colors">
          Complicated Wires
        </Link>
        <Link href="/modules/mazes" className="text-gray-500 hover:text-gray-300 transition-colors">
          Mazes →
        </Link>
      </nav>
    </main>
  );
}
