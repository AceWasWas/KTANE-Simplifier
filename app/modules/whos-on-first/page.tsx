"use client";

import { useState } from "react";
import Link from "next/link";
import { modules } from "@/app/data/modules";

// ─── Types ────────────────────────────────────────────────────────────────────

type Tab = "manual" | "solver";

// ─── Constants ────────────────────────────────────────────────────────────────

const DISPLAY_OPTIONS: string[] = [
  "YES", "FIRST", "DISPLAY", "OKAY", "SAYS", "NOTHING",
  "", "BLANK", "NO", "LED", "LEAD", "READ",
  "RED", "REED", "LEED", "HOLD ON", "YOU", "YOU ARE",
  "YOUR", "YOU'RE", "UR", "THERE", "THEY'RE", "THEIR",
  "THEY ARE", "SEE", "C", "CEE",
];

const BUTTON_OPTIONS: string[] = [
  "READY", "FIRST", "NO", "BLANK", "NOTHING", "YES",
  "WHAT", "UHHH", "LEFT", "RIGHT", "MIDDLE", "OKAY",
  "WAIT", "PRESS", "YOU", "YOU ARE", "YOUR", "YOU'RE",
  "UR", "U", "UH HUH", "UH UH", "WHAT?", "DONE",
  "NEXT", "HOLD", "SURE", "LIKE",
];

// Step 1: display text (trimmed, uppercase) → button index
// 0=top-left  1=top-right  2=mid-left  3=mid-right  4=bot-left  5=bot-right
const STEP1: Record<string, number> = {
  "YES": 0, "FIRST": 1, "DISPLAY": 4, "OKAY": 1, "SAYS": 5,
  "NOTHING": 4, "": 4, "BLANK": 4, "NO": 5, "LED": 0,
  "LEAD": 5, "READ": 1, "RED": 3, "REED": 4, "LEED": 4,
  "HOLD ON": 5, "YOU": 3, "YOU ARE": 5, "YOUR": 3, "YOU'RE": 3,
  "UR": 0, "THERE": 5, "THEY'RE": 4, "THEIR": 5, "THEY ARE": 4,
  "SEE": 5, "C": 1, "CEE": 5,
};

// Step 2: label at referenced button → priority order of labels to press
const STEP2: Record<string, string[]> = {
  "READY":   ["YES","OKAY","WHAT","MIDDLE","LEFT","PRESS","RIGHT","BLANK","READY","NO","FIRST","UHHH","NOTHING","WAIT"],
  "FIRST":   ["LEFT","OKAY","YES","MIDDLE","NO","RIGHT","NOTHING","UHHH","WAIT","READY","BLANK","WHAT","PRESS","FIRST"],
  "NO":      ["BLANK","UHHH","WAIT","FIRST","WHAT","READY","RIGHT","YES","NOTHING","LEFT","PRESS","OKAY","NO","MIDDLE"],
  "BLANK":   ["WAIT","RIGHT","OKAY","MIDDLE","BLANK","PRESS","READY","NOTHING","NO","WHAT","LEFT","UHHH","YES","FIRST"],
  "NOTHING": ["UHHH","RIGHT","OKAY","MIDDLE","YES","BLANK","NO","PRESS","LEFT","WHAT","WAIT","FIRST","NOTHING","READY"],
  "YES":     ["OKAY","RIGHT","UHHH","MIDDLE","FIRST","WHAT","PRESS","READY","NOTHING","YES","LEFT","BLANK","NO","WAIT"],
  "WHAT":    ["UHHH","WHAT","LEFT","NOTHING","READY","BLANK","MIDDLE","NO","OKAY","FIRST","WAIT","YES","PRESS","RIGHT"],
  "UHHH":    ["READY","NOTHING","LEFT","WHAT","OKAY","YES","RIGHT","NO","PRESS","BLANK","UHHH","MIDDLE","WAIT","FIRST"],
  "LEFT":    ["RIGHT","LEFT","FIRST","NO","MIDDLE","YES","BLANK","WHAT","UHHH","WAIT","PRESS","READY","OKAY","NOTHING"],
  "RIGHT":   ["YES","NOTHING","READY","PRESS","NO","WAIT","WHAT","RIGHT","MIDDLE","LEFT","UHHH","BLANK","OKAY","FIRST"],
  "MIDDLE":  ["BLANK","READY","OKAY","WHAT","NOTHING","PRESS","NO","WAIT","LEFT","MIDDLE","RIGHT","FIRST","UHHH","YES"],
  "OKAY":    ["MIDDLE","NO","FIRST","YES","UHHH","NOTHING","WAIT","OKAY","LEFT","READY","BLANK","PRESS","WHAT","RIGHT"],
  "WAIT":    ["UHHH","NO","BLANK","OKAY","YES","LEFT","FIRST","PRESS","WHAT","WAIT","NOTHING","READY","RIGHT","MIDDLE"],
  "PRESS":   ["RIGHT","MIDDLE","YES","READY","PRESS","OKAY","NOTHING","UHHH","BLANK","LEFT","FIRST","WHAT","NO","WAIT"],
  "YOU":     ["SURE","YOU ARE","YOUR","YOU'RE","NEXT","UH HUH","UR","HOLD","WHAT?","YOU","UH UH","LIKE","DONE","U"],
  "YOU ARE": ["YOUR","NEXT","LIKE","UH HUH","WHAT?","DONE","UH UH","HOLD","YOU","U","YOU'RE","SURE","UR","YOU ARE"],
  "YOUR":    ["UH UH","YOU ARE","UH HUH","YOUR","NEXT","UR","SURE","U","YOU'RE","YOU","WHAT?","HOLD","LIKE","DONE"],
  "YOU'RE":  ["YOU","YOU'RE","UR","NEXT","UH UH","YOU ARE","U","YOUR","WHAT?","UH HUH","SURE","DONE","LIKE","HOLD"],
  "UR":      ["DONE","U","UR","UH HUH","WHAT?","SURE","YOUR","HOLD","YOU'RE","LIKE","NEXT","UH UH","YOU ARE","YOU"],
  "U":       ["UH HUH","SURE","NEXT","WHAT?","YOU'RE","UR","UH UH","DONE","U","YOU","LIKE","HOLD","YOU ARE","YOUR"],
  "UH HUH":  ["UH HUH","YOUR","YOU ARE","YOU","DONE","HOLD","UH UH","NEXT","SURE","LIKE","YOU'RE","UR","U","WHAT?"],
  "UH UH":   ["UR","U","YOU ARE","YOU'RE","NEXT","UH UH","DONE","YOU","UH HUH","LIKE","YOUR","SURE","HOLD","WHAT?"],
  "WHAT?":   ["YOU","HOLD","YOU'RE","YOUR","U","DONE","UH UH","LIKE","YOU ARE","UH HUH","UR","NEXT","WHAT?","SURE"],
  "DONE":    ["SURE","UH HUH","NEXT","WHAT?","YOUR","UR","YOU'RE","HOLD","LIKE","YOU","U","YOU ARE","UH UH","DONE"],
  "NEXT":    ["WHAT?","UH HUH","UH UH","YOUR","HOLD","SURE","NEXT","LIKE","DONE","YOU ARE","UR","YOU'RE","U","YOU"],
  "HOLD":    ["YOU ARE","U","DONE","UH UH","YOU","UR","SURE","WHAT?","YOU'RE","NEXT","HOLD","UH HUH","YOUR","LIKE"],
  "SURE":    ["YOU ARE","DONE","LIKE","YOU'RE","YOU","HOLD","UH HUH","UR","SURE","U","WHAT?","NEXT","YOUR","UH UH"],
  "LIKE":    ["YOU'RE","NEXT","U","UR","HOLD","DONE","UH UH","WHAT?","UH HUH","YOU","LIKE","SURE","YOU ARE","YOUR"],
};

const POSITION_NAME = [
  "top-left", "top-right", "middle-left", "middle-right", "bottom-left", "bottom-right",
];

// ─── Solver logic ─────────────────────────────────────────────────────────────

type SolveResult = { refIndex: number; pressIndex: number } | null;

function solve(display: string, buttons: string[]): SolveResult {
  const d = display.trim().toUpperCase();
  const refIndex = STEP1[d];
  if (refIndex === undefined) return null;

  const refLabel = (buttons[refIndex] ?? "").trim().toUpperCase();
  if (!refLabel) return null;

  const priority = STEP2[refLabel];
  if (!priority) return null;

  const norm = buttons.map((b) => (b ?? "").trim().toUpperCase());
  for (const item of priority) {
    const idx = norm.indexOf(item);
    if (idx !== -1) return { refIndex, pressIndex: idx };
  }
  return null;
}

// ─── WhosOnFirstSolver ────────────────────────────────────────────────────────

function WhosOnFirstSolver() {
  const [display, setDisplay] = useState<string | null>(null);
  const [buttons, setButtons] = useState<(string | null)[]>(Array(6).fill(null));
  const [openPicker, setOpenPicker] = useState<"display" | number | null>(null);
  const [inputVal, setInputVal] = useState("");

  const normDisplay = (display ?? "").trim().toUpperCase();
  const refIndex = display !== null ? STEP1[normDisplay] : undefined;
  const result = display !== null ? solve(display, buttons.map((b) => b ?? "")) : null;

  const openFor = (target: "display" | number) => {
    setInputVal(target === "display" ? (display ?? "") : (buttons[target as number] ?? ""));
    setOpenPicker(target);
  };

  const commitDisplay = (val: string) => {
    setDisplay(val);
    setOpenPicker(null);
  };

  const commitButton = (i: number, val: string) => {
    setButtons((prev) => {
      const n = [...prev];
      n[i] = val;
      return n;
    });
    setOpenPicker(null);
  };

  const handleReset = () => {
    setDisplay(null);
    setButtons(Array(6).fill(null));
    setOpenPicker(null);
  };

  const filteredDisplay = inputVal
    ? DISPLAY_OPTIONS.filter((o) => o.toUpperCase().includes(inputVal.toUpperCase()))
    : DISPLAY_OPTIONS;

  const filteredButtons = inputVal
    ? BUTTON_OPTIONS.filter((o) => o.toUpperCase().includes(inputVal.toUpperCase()))
    : BUTTON_OPTIONS;

  const btnClass = (i: number) => {
    if (result?.pressIndex === i)
      return "border-green-500 bg-green-950/50 text-green-300";
    if (refIndex === i && display !== null)
      return "border-indigo-500 bg-indigo-950/40 text-indigo-300";
    return "border-gray-600 bg-gray-900 text-gray-300 hover:bg-gray-800";
  };

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Module visual */}
      <div className="relative rounded-lg border-2 border-gray-700 bg-gray-950 w-72">
        {/* LED */}
        <div className="absolute top-3 right-3 w-3 h-3 rounded-full bg-gray-400 border-2 border-gray-300" />

        {/* Display */}
        <div className="relative mx-3 mt-8 mb-3">
          <button
            onClick={() => openFor("display")}
            className="w-full bg-black rounded px-3 py-3 font-mono text-sm text-white hover:bg-gray-900 transition-colors text-center tracking-wide"
          >
            {display !== null ? (display || "(blank)") : "[ DISPLAY ]"}
          </button>
          {openPicker === "display" && (
            <div className="absolute left-0 right-0 top-full z-30 mt-1 bg-gray-900 border border-gray-700 rounded-lg shadow-xl overflow-hidden">
              <input
                autoFocus
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter")
                    commitDisplay(inputVal.trim().toUpperCase() || inputVal);
                }}
                placeholder="Type and press Enter..."
                className="w-full px-3 py-2 text-xs bg-gray-800 text-white border-b border-gray-700 outline-none font-mono"
              />
              <div className="max-h-52 overflow-y-auto">
                {filteredDisplay.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => commitDisplay(opt)}
                    className={`w-full text-left px-3 py-1.5 text-xs font-mono transition-colors ${
                      display === opt
                        ? "bg-gray-700 text-white"
                        : "text-gray-300 hover:bg-gray-800"
                    }`}
                  >
                    {opt === "" ? "(blank)" : opt}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Buttons + right strip */}
        <div className="flex gap-2 mx-3 mb-3">
          {/* 2x3 grid */}
          <div className="grid grid-cols-2 gap-2 flex-1">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="relative">
                <button
                  onClick={() => openFor(i)}
                  className={`w-full h-10 rounded border font-mono text-xs transition-colors truncate px-1 ${btnClass(i)}`}
                >
                  {buttons[i] !== null ? buttons[i] : "[ TEXT ]"}
                </button>
                {openPicker === i && (
                  <div
                    className={[
                      "absolute z-30 bg-gray-900 border border-gray-700 rounded-lg shadow-xl overflow-hidden w-44",
                      i >= 4 ? "bottom-full mb-1" : "top-full mt-1",
                      i % 2 === 0 ? "left-0" : "right-0",
                    ].join(" ")}
                  >
                    <input
                      autoFocus
                      type="text"
                      value={inputVal}
                      onChange={(e) => setInputVal(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter")
                          commitButton(i, inputVal.trim().toUpperCase() || inputVal);
                      }}
                      placeholder="Type and press Enter..."
                      className="w-full px-2 py-1.5 text-xs bg-gray-800 text-white border-b border-gray-700 outline-none font-mono"
                    />
                    <div className="max-h-52 overflow-y-auto">
                      {filteredButtons.map((opt, idx) => (
                        <button
                          key={idx}
                          onClick={() => commitButton(i, opt)}
                          className={`w-full text-left px-2 py-1 text-xs font-mono transition-colors ${
                            buttons[i] === opt
                              ? "bg-gray-700 text-white"
                              : "text-gray-300 hover:bg-gray-800"
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Right indicator strip */}
          <div className="w-7 bg-gray-800 rounded flex flex-col items-center justify-evenly py-3">
            {[0, 1, 2].map((j) => (
              <div key={j} className="w-4 h-2.5 bg-gray-500 rounded-sm" />
            ))}
          </div>
        </div>
      </div>

      {/* Reset */}
      <button
        onClick={handleReset}
        className="px-4 py-2 rounded bg-gray-800 hover:bg-gray-700 text-gray-400 text-xs transition-colors"
      >
        Reset
      </button>

      {/* Result */}
      {display !== null && (
        <div className="w-full max-w-xs rounded-lg p-3 bg-gray-900 border border-gray-800 space-y-2 text-xs">
          {refIndex === undefined ? (
            <p className="text-yellow-400">Display text not recognized.</p>
          ) : (
            <>
              {/* Step 1 */}
              <div className="space-y-0.5">
                <p className="text-gray-600 uppercase tracking-widest font-semibold text-[10px]">Step 1</p>
                <p className="text-gray-400">
                  Display{" "}
                  <span className="text-white font-mono">{display || "(blank)"}</span>
                  {" "}→ read the{" "}
                  <span className="text-indigo-400">{POSITION_NAME[refIndex]}</span>
                  {" "}button
                  {buttons[refIndex] !== null && (
                    <span className="text-gray-400">
                      {" "}(label:{" "}
                      <span className="text-white font-mono">{buttons[refIndex]}</span>
                      )
                    </span>
                  )}
                </p>
              </div>

              {/* Step 2 */}
              {buttons[refIndex] !== null && (
                <div className="space-y-0.5 pt-1 border-t border-gray-800">
                  <p className="text-gray-600 uppercase tracking-widest font-semibold text-[10px]">Step 2</p>
                  {result ? (
                    <p className="text-gray-400">
                      Using{" "}
                      <span className="text-white font-mono">{buttons[refIndex]}</span>
                      {" "}list → press{" "}
                      <span className="font-bold text-green-400 font-mono">
                        {buttons[result.pressIndex]}
                      </span>
                      {" "}
                      <span className="text-gray-500">({POSITION_NAME[result.pressIndex]})</span>
                    </p>
                  ) : (
                    <p className="text-yellow-400">
                      Set all 6 button labels to find a match.
                    </p>
                  )}
                </div>
              )}

              {buttons[refIndex] === null && (
                <p className="text-gray-500">
                  Set the {POSITION_NAME[refIndex]} button label to continue.
                </p>
              )}
            </>
          )}
        </div>
      )}

      {/* Backdrop */}
      {openPicker !== null && (
        <div className="fixed inset-0 z-20" onClick={() => setOpenPicker(null)} />
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function WhosOnFirstPage() {
  const [tab, setTab] = useState<Tab>("manual");
  const mod = modules.find((m) => m.slug === "whos-on-first")!;

  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      <nav className="mb-8">
        <Link href="/" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">
          ← Back to modules
        </Link>
      </nav>

      <h1 className="text-3xl font-bold text-red-500 mb-6">{"Who's on First"}</h1>

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

      {tab === "solver" && <WhosOnFirstSolver />}

      <nav className="mt-10 flex justify-between text-sm">
        <Link
          href="/modules/simon-says"
          className="text-gray-500 hover:text-gray-300 transition-colors"
        >
          ← Simon Says
        </Link>
        <Link
          href="/modules/memory"
          className="text-gray-500 hover:text-gray-300 transition-colors"
        >
          Memory →
        </Link>
      </nav>
    </main>
  );
}
