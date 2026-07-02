"use client";

import { useState } from "react";
import Link from "next/link";
import { modules } from "@/app/data/modules";

// ─── Types ────────────────────────────────────────────────────────────────────

type ButtonColor = "unset" | "blue" | "red" | "white" | "yellow";
type ButtonText = "unset" | "Abort" | "Detonate" | "Hold" | "Press" | "Other";
type StripColor = "unset" | "blue" | "white" | "yellow" | "red";
type Batteries = "le1" | "two" | "ge3" | null;
type Tab = "manual" | "solver";

// ─── Constants ────────────────────────────────────────────────────────────────

const BUTTON_COLORS: ButtonColor[] = ["blue", "red", "white", "yellow"];
const BUTTON_TEXTS: ButtonText[] = ["Abort", "Detonate", "Hold", "Press", "Other"];
const STRIP_COLORS: StripColor[] = ["blue", "red", "white", "yellow"];

const BATTERY_OPTIONS: { value: "le1" | "two" | "ge3"; label: string }[] = [
  { value: "le1", label: "0 or 1" },
  { value: "two", label: "2" },
  { value: "ge3", label: "3+" },
];

const BTN_BG: Record<ButtonColor, string> = {
  unset: "bg-gray-700",
  blue: "bg-blue-600",
  white: "bg-gray-200",
  yellow: "bg-yellow-400",
  red: "bg-red-600",
};

const BTN_TEXT: Record<ButtonColor, string> = {
  unset: "text-gray-500",
  blue: "text-white",
  white: "text-gray-800",
  yellow: "text-yellow-900",
  red: "text-white",
};

const STRIP_BG: Record<StripColor, string> = {
  unset: "bg-gray-800",
  blue: "bg-blue-500",
  white: "bg-gray-200",
  yellow: "bg-yellow-400",
  red: "bg-red-600",
};

const STRIP_TEXT: Record<StripColor, string> = {
  unset: "text-gray-600",
  blue: "text-white",
  white: "text-gray-800",
  yellow: "text-yellow-900",
  red: "text-white",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getReleaseDigit(strip: StripColor): string {
  if (strip === "blue") return "4";
  if (strip === "yellow") return "5";
  return "1";
}

type SolveResult = null | { type: "press" } | { type: "hold" } | { type: "need_batteries" };

function solveButton(
  color: ButtonColor,
  text: ButtonText,
  batteries: Batteries,
  litCAR: boolean,
  litFRK: boolean,
): SolveResult {
  if (color === "unset" || text === "unset") return null;

  // Rule 1: blue + Abort
  if (color === "blue" && text === "Abort") return { type: "hold" };

  // Rule 2: more than 1 battery + Detonate
  if (text === "Detonate") {
    if (batteries === null) return { type: "need_batteries" };
    if (batteries !== "le1") return { type: "press" };
  }

  // Rule 3: white + lit CAR indicator
  if (color === "white" && litCAR) return { type: "hold" };

  // Rule 4: more than 2 batteries + lit FRK indicator
  if (litFRK) {
    if (batteries === null) return { type: "need_batteries" };
    if (batteries === "ge3") return { type: "press" };
  }

  // Rule 5: yellow
  if (color === "yellow") return { type: "hold" };

  // Rule 6: red + Hold
  if (color === "red" && text === "Hold") return { type: "press" };

  // Rule 7: everything else
  return { type: "hold" };
}

// ─── ButtonSolver ─────────────────────────────────────────────────────────────

function ButtonSolver() {
  const [color, setColor] = useState<ButtonColor>("unset");
  const [text, setText] = useState<ButtonText>("unset");
  const [batteries, setBatteries] = useState<Batteries>(null);
  const [litCAR, setLitCAR] = useState(false);
  const [litFRK, setLitFRK] = useState(false);
  const [strip, setStrip] = useState<StripColor>("unset");

  const result = solveButton(color, text, batteries, litCAR, litFRK);
  const showBombInfo = color !== "unset" && text !== "unset";
  const releaseDigit = strip !== "unset" ? getReleaseDigit(strip) : null;

  const handleReset = () => {
    setColor("unset");
    setText("unset");
    setBatteries(null);
    setLitCAR(false);
    setLitFRK(false);
    setStrip("unset");
  };

  const handleIndicator = (ind: "CAR" | "FRK") => {
    if (ind === "CAR") setLitCAR((v) => !v);
    else setLitFRK((v) => !v);
  };

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Module visual */}
      <div className="relative rounded-lg border-2 border-gray-700 bg-gray-950 p-3 w-56 h-44">
        <div className="absolute top-2 left-2 w-2 h-2 rounded-full bg-gray-800 border border-gray-600" />
        <div className="flex gap-2 h-full pt-2">
          <div
            className={[
              "flex-1 rounded-lg flex items-center justify-center font-bold text-sm transition-colors select-none",
              BTN_BG[color],
              BTN_TEXT[color],
            ].join(" ")}
          >
            {text !== "unset" ? text : ""}
          </div>
          <div className={`w-3 rounded transition-colors ${STRIP_BG[strip]}`} />
        </div>
      </div>

      {/* Section 1: Colour */}
      <div className="w-full max-w-xs">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2">
          Colour
        </p>
        <div className="grid grid-cols-4 gap-2">
          {BUTTON_COLORS.map((c) => (
            <button
              key={c}
              onClick={() => setColor(c)}
              className={[
                "h-9 rounded-lg capitalize text-xs font-medium transition-all",
                BTN_BG[c],
                BTN_TEXT[c],
                color === c
                  ? "ring-2 ring-white ring-offset-2 ring-offset-gray-900 scale-105"
                  : "hover:opacity-80",
              ].join(" ")}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Section 2: Text */}
      <div className="w-full max-w-xs">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2">
          Text
        </p>
        <div className="flex flex-wrap gap-2">
          {BUTTON_TEXTS.map((t) => (
            <button
              key={t}
              onClick={() => setText(t)}
              className={[
                "px-4 py-2 rounded text-sm font-medium transition-colors",
                text === t
                  ? "bg-red-700 text-white"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700",
              ].join(" ")}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Bomb info: appears once colour and text are set */}
      {showBombInfo && (
        <div className="w-full max-w-xs bg-gray-900 border border-gray-800 rounded-lg p-3 space-y-2.5">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">Bomb</p>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 w-16 shrink-0">Batteries</span>
            <div className="flex gap-1.5">
              {BATTERY_OPTIONS.map(({ value, label }) => (
                <button
                  key={label}
                  onClick={() => setBatteries(batteries === value ? null : value)}
                  className={[
                    "px-2.5 py-1 rounded text-xs font-medium transition-colors",
                    batteries === value
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-800 text-gray-400 hover:bg-gray-700",
                  ].join(" ")}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 w-16 shrink-0">Lit</span>
            <div className="flex gap-1.5">
              {(["CAR", "FRK"] as const).map((ind) => (
                <button
                  key={ind}
                  onClick={() => handleIndicator(ind)}
                  className={[
                    "px-2.5 py-1 rounded text-xs font-mono font-medium transition-colors",
                    (ind === "CAR" ? litCAR : litFRK)
                      ? "bg-yellow-600 text-white"
                      : "bg-gray-800 text-gray-400 hover:bg-gray-700",
                  ].join(" ")}
                >
                  {ind}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Section 3: Strip Colour */}
      <div className="w-full max-w-xs">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2">
          Strip Colour
        </p>
        <div className="flex gap-2">
          {STRIP_COLORS.map((s) => (
            <button
              key={s}
              onClick={() => setStrip(strip === s ? "unset" : s)}
              className={[
                "flex-1 h-10 rounded-lg capitalize text-xs font-medium transition-all",
                STRIP_BG[s],
                STRIP_TEXT[s],
                strip === s
                  ? "ring-2 ring-white ring-offset-2 ring-offset-gray-900 scale-105"
                  : "hover:opacity-80",
              ].join(" ")}
            >
              {s}
            </button>
          ))}
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
      {result !== null && (
        <div
          className={[
            "w-full max-w-xs rounded-lg p-4 text-center space-y-1",
            result.type === "press"
              ? "bg-green-950/40 border border-green-700"
              : result.type === "hold"
              ? "bg-blue-950/40 border border-blue-700"
              : "bg-yellow-950/40 border border-yellow-700",
          ].join(" ")}
        >
          {result.type === "press" && (
            <p className="font-semibold text-green-400">Press and immediately release</p>
          )}
          {result.type === "hold" && strip === "unset" && (
            <>
              <p className="font-semibold text-blue-400">Hold the button</p>
              <p className="text-xs text-gray-500">Select a strip colour to see release timing</p>
            </>
          )}
          {result.type === "hold" && strip !== "unset" && (
            <>
              <p className="font-semibold text-blue-400">Hold the button</p>
              <p className="text-sm text-blue-200">
                Release when the timer shows a{" "}
                <span className="font-bold text-white">{releaseDigit}</span> in any position
              </p>
            </>
          )}
          {result.type === "need_batteries" && (
            <p className="text-sm text-yellow-400">Set battery count above to continue</p>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function TheButtonPage() {
  const [tab, setTab] = useState<Tab>("manual");
  const mod = modules.find((m) => m.slug === "the-button")!;

  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      <nav className="mb-8">
        <Link href="/" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">
          ← Back to modules
        </Link>
      </nav>

      <h1 className="text-3xl font-bold text-red-500 mb-6">The Button</h1>

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

      {tab === "solver" && <ButtonSolver />}

      <nav className="mt-10 flex justify-between text-sm">
        <Link href="/modules/wires" className="text-gray-500 hover:text-gray-300 transition-colors">
          ← Wires
        </Link>
        <Link href="/modules/keypads" className="text-gray-500 hover:text-gray-300 transition-colors">
          Keypads →
        </Link>
      </nav>
    </main>
  );
}
