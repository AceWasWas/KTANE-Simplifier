"use client";

import { useState } from "react";
import Link from "next/link";
import { modules } from "@/app/data/modules";

type Tab = "manual" | "solver";
type HistoryEntry = { position: number; label: number };
type SolveResult = { buttonIndex: number; position: number; label: number };

function solveMemory(
  stage: number,
  display: number,
  btns: number[],
  history: (HistoryEntry | null)[]
): SolveResult | null {
  const pressPos = (pos: number): SolveResult => ({
    buttonIndex: pos - 1,
    position: pos,
    label: btns[pos - 1],
  });

  const pressLabel = (label: number): SolveResult | null => {
    const idx = btns.indexOf(label);
    return idx === -1 ? null : { buttonIndex: idx, position: idx + 1, label };
  };

  const h = (i: number) => history[i - 1];

  switch (stage) {
    case 1:
      if (display === 3) return pressPos(3);
      if (display === 4) return pressPos(4);
      return pressPos(2);

    case 2:
      if (display === 1) return pressLabel(4);
      if (display === 2) return h(1) ? pressPos(h(1)!.position) : null;
      if (display === 3) return pressPos(1);
      if (display === 4) return h(1) ? pressPos(h(1)!.position) : null;
      break;

    case 3:
      if (display === 1) return h(2) ? pressLabel(h(2)!.label) : null;
      if (display === 2) return h(1) ? pressLabel(h(1)!.label) : null;
      if (display === 3) return pressPos(3);
      if (display === 4) return pressLabel(4);
      break;

    case 4:
      if (display === 1) return h(1) ? pressPos(h(1)!.position) : null;
      if (display === 2) return pressPos(1);
      if (display === 3) return h(2) ? pressPos(h(2)!.position) : null;
      if (display === 4) return h(2) ? pressPos(h(2)!.position) : null;
      break;

    case 5:
      if (display === 1) return h(1) ? pressLabel(h(1)!.label) : null;
      if (display === 2) return h(2) ? pressLabel(h(2)!.label) : null;
      if (display === 3) return h(4) ? pressLabel(h(4)!.label) : null;
      if (display === 4) return h(3) ? pressLabel(h(3)!.label) : null;
      break;
  }
  return null;
}

function MemorySolver() {
  const [stage, setStage] = useState(1);
  const [display, setDisplay] = useState<number | null>(null);
  const [btns, setBtns] = useState<(number | null)[]>([null, null, null, null]);
  const [history, setHistory] = useState<(HistoryEntry | null)[]>([null, null, null, null]);
  const [openPicker, setOpenPicker] = useState<"display" | number | null>(null);
  const [complete, setComplete] = useState(false);

  const allSet = btns.every((b) => b !== null);
  const result =
    display !== null && allSet
      ? solveMemory(stage, display, btns as number[], history)
      : null;

  const availableFor = (i: number) =>
    [1, 2, 3, 4].filter((n) => !btns.some((b, j) => j !== i && b === n));

  const selectDisplay = (n: number) => {
    setDisplay(n);
    setOpenPicker(null);
  };

  const selectBtn = (i: number, n: number) => {
    setBtns((prev) => {
      const next = [...prev];
      next[i] = n;
      return next;
    });
    setOpenPicker(null);
  };

  const handleConfirm = () => {
    if (!result) return;
    const newHistory = [...history];
    newHistory[stage - 1] = { position: result.position, label: result.label };
    setHistory(newHistory);
    if (stage === 5) {
      setComplete(true);
    } else {
      setStage((s) => s + 1);
      setDisplay(null);
      setBtns([null, null, null, null]);
    }
    setOpenPicker(null);
  };

  const handleReset = () => {
    setStage(1);
    setDisplay(null);
    setBtns([null, null, null, null]);
    setHistory([null, null, null, null]);
    setOpenPicker(null);
    setComplete(false);
  };

  const btnBorder = (i: number) =>
    result?.buttonIndex === i
      ? "border-green-500 bg-green-950/50 text-green-300"
      : "border-gray-600 bg-gray-900 text-gray-300 hover:bg-gray-800";

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex gap-4 items-start">
        {/* Module */}
        <div className="relative rounded-lg border-2 border-gray-700 bg-gray-950 w-60">
          {/* LED */}
          <div className="absolute top-2 right-2 w-3 h-3 rounded-full bg-gray-400 border-2 border-gray-300" />
          {/* Stage indicator */}
          <div className="absolute top-2.5 left-3 text-[10px] text-gray-600 font-mono">
            {complete ? "DONE" : `${stage}/5`}
          </div>

          <div className="flex gap-2 p-3 pt-7">
            <div className="flex-1 space-y-2">
              {/* Display */}
              <div className="relative">
                <button
                  onClick={() => !complete && setOpenPicker("display")}
                  disabled={complete}
                  className="w-full h-24 bg-black rounded flex items-center justify-center font-mono text-5xl font-bold text-white hover:bg-gray-900 transition-colors disabled:cursor-not-allowed"
                >
                  {display ?? ""}
                </button>
                {openPicker === "display" && (
                  <div className="absolute left-0 right-0 top-full z-30 mt-1 bg-gray-900 border border-gray-700 rounded-lg p-2 flex gap-1.5 shadow-xl">
                    {[1, 2, 3, 4].map((n) => (
                      <button
                        key={n}
                        onClick={() => selectDisplay(n)}
                        className={`flex-1 h-9 rounded text-sm font-mono font-bold transition-colors ${
                          display === n
                            ? "bg-indigo-600 text-white"
                            : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                        }`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* 4 buttons */}
              <div className="flex gap-1">
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className="relative flex-1">
                    <button
                      onClick={() => !complete && setOpenPicker(i)}
                      disabled={complete}
                      className={`w-full h-10 rounded border text-sm font-mono font-bold transition-colors ${btnBorder(i)}`}
                    >
                      {btns[i] ?? "-"}
                    </button>
                    {openPicker === i && (
                      <div
                        className={`absolute top-full mt-1 z-30 bg-gray-900 border border-gray-700 rounded-lg p-1.5 flex gap-1 shadow-xl ${
                          i >= 2 ? "right-0" : "left-0"
                        }`}
                      >
                        {availableFor(i).map((n) => (
                          <button
                            key={n}
                            onClick={() => selectBtn(i, n)}
                            className={`w-8 h-8 rounded text-xs font-mono font-bold transition-colors ${
                              btns[i] === n
                                ? "bg-indigo-600 text-white"
                                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                            }`}
                          >
                            {n}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Right strip */}
            <div className="w-6 bg-gray-800 rounded flex flex-col items-center justify-evenly py-3">
              {[0, 1, 2].map((j) => (
                <div key={j} className="w-3.5 h-2.5 bg-gray-600 rounded-sm" />
              ))}
            </div>
          </div>
        </div>

        {/* Notepad */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-3 min-w-[9rem]">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-500 mb-2">
            Notepad
          </p>
          <div className="grid grid-cols-3 pb-1 border-b border-gray-700">
            <span className="text-[10px] text-gray-600 text-center font-mono">St.</span>
            <span className="text-[10px] text-gray-500 text-center font-semibold">Pos</span>
            <span className="text-[10px] text-gray-500 text-center font-semibold">Label</span>
          </div>
          {[0, 1, 2, 3].map((i) => {
            const isActive = !complete && stage === i + 1;
            return (
              <div
                key={i}
                className={`grid grid-cols-3 py-1.5 ${i < 3 ? "border-b border-gray-800" : ""} ${
                  isActive ? "bg-indigo-950/30 -mx-1 px-1 rounded" : ""
                }`}
              >
                <span
                  className={`text-xs font-mono text-center ${
                    isActive ? "text-indigo-400" : "text-gray-600"
                  }`}
                >
                  {i + 1}
                </span>
                <span
                  className={`text-sm font-mono font-bold text-center ${
                    history[i] ? "text-white" : "text-gray-700"
                  }`}
                >
                  {history[i]?.position ?? "-"}
                </span>
                <span
                  className={`text-sm font-mono font-bold text-center ${
                    history[i] ? "text-white" : "text-gray-700"
                  }`}
                >
                  {history[i]?.label ?? "-"}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Result + actions */}
      <div className="w-full max-w-xs space-y-3">
        {complete ? (
          <div className="rounded-lg p-3 bg-green-950/40 border border-green-700 text-sm text-center">
            <p className="font-semibold text-green-400">Module disarmed!</p>
          </div>
        ) : result ? (
          <>
            <div className="rounded-lg p-3 bg-green-950/40 border border-green-700 text-xs text-center">
              <p className="font-semibold text-green-400">
                Press position {result.position} (label {result.label})
              </p>
            </div>
            <button
              onClick={handleConfirm}
              className="w-full py-2 rounded bg-indigo-700 hover:bg-indigo-600 text-white text-sm font-semibold transition-colors"
            >
              Confirm{stage < 5 ? ` → Stage ${stage + 1}` : " → Complete"}
            </button>
          </>
        ) : (
          <p className="text-xs text-gray-600 text-center">
            {display === null
              ? "Click the display to set the number."
              : !allSet
              ? "Set all 4 button labels."
              : "Waiting for history from previous stages."}
          </p>
        )}

        <button
          onClick={handleReset}
          className="w-full py-1.5 rounded bg-gray-800 hover:bg-gray-700 text-gray-400 text-xs transition-colors"
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

export default function MemoryPage() {
  const [tab, setTab] = useState<Tab>("manual");
  const mod = modules.find((m) => m.slug === "memory")!;

  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      <nav className="mb-8">
        <Link href="/" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">
          Back to modules
        </Link>
      </nav>

      <h1 className="text-3xl font-bold text-red-500 mb-6">Memory</h1>

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

      {tab === "solver" && <MemorySolver />}

      <nav className="mt-10 flex justify-between text-sm">
        <Link
          href="/modules/whos-on-first"
          className="text-gray-500 hover:text-gray-300 transition-colors"
        >
          {"← Who's on First"}
        </Link>
        <Link
          href="/modules/morse-code"
          className="text-gray-500 hover:text-gray-300 transition-colors"
        >
          Morse Code →
        </Link>
      </nav>
    </main>
  );
}
