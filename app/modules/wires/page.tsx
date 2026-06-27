"use client";

import { useState } from "react";
import Link from "next/link";
import { modules } from "@/app/data/modules";

// ─── Types ────────────────────────────────────────────────────────────────────

type WireColor = "blank" | "red" | "yellow" | "blue" | "white" | "black";
type WireCount = 3 | 4 | 5 | 6;
type Tab = "manual" | "solver";

// ─── Constants ────────────────────────────────────────────────────────────────

const COLORS: WireColor[] = ["blank", "red", "yellow", "blue", "white", "black"];
const WIRE_COUNTS: WireCount[] = [3, 4, 5, 6];
const ORDINALS = ["1st", "2nd", "3rd", "4th", "5th", "6th"];

const WIRE_BG: Record<WireColor, string> = {
  blank: "bg-gray-800 border-2 border-dashed border-gray-600",
  red: "bg-red-500",
  yellow: "bg-yellow-400",
  blue: "bg-blue-600",
  white: "bg-gray-100",
  black: "bg-black border border-zinc-600",
};

const WIRE_TEXT: Record<WireColor, string> = {
  blank: "text-gray-500",
  red: "text-red-100",
  yellow: "text-yellow-900",
  blue: "text-blue-100",
  white: "text-gray-700",
  black: "text-zinc-400",
};


// ─── Helpers ──────────────────────────────────────────────────────────────────

function needsSerial(wires: WireColor[]): boolean {
  const count = (c: WireColor) => wires.filter((w) => w === c).length;
  const n = wires.length;
  const last = wires[n - 1];
  if (n === 4 && count("red") > 1) return true;
  if (n === 5 && last === "black") return true;
  if (n === 6 && count("yellow") === 0) return true;
  return false;
}

function solveWires(wires: WireColor[], serialOdd: boolean | null): number {
  const count = (c: WireColor) => wires.filter((w) => w === c).length;
  const last = wires[wires.length - 1];
  const n = wires.length;

  if (n === 3) {
    if (count("red") === 0) return 1;
    if (last === "white") return 2;
    if (count("blue") > 1) {
      for (let i = 2; i >= 0; i--) if (wires[i] === "blue") return i;
    }
    return 2;
  }

  if (n === 4) {
    if (count("red") > 1 && serialOdd) {
      for (let i = 3; i >= 0; i--) if (wires[i] === "red") return i;
    }
    if (last === "yellow" && count("red") === 0) return 0;
    if (count("blue") === 1) return 0;
    if (count("yellow") > 1) return 3;
    return 1;
  }

  if (n === 5) {
    if (last === "black" && serialOdd) return 3;
    if (count("red") === 1 && count("yellow") > 1) return 0;
    if (count("black") === 0) return 1;
    return 0;
  }

  // n === 6
  if (count("yellow") === 0 && serialOdd) return 2;
  if (count("yellow") === 1 && count("white") > 1) return 3;
  if (count("red") === 0) return 5;
  return 3;
}

// ─── WireSolver ───────────────────────────────────────────────────────────────

function WireSolver() {
  const [wireCount, setWireCount] = useState<WireCount>(3);
  const [wires, setWires] = useState<WireColor[]>(Array(3).fill("blank"));
  const [serialOdd, setSerialOdd] = useState<boolean | null>(null);
  const [cutIndex, setCutIndex] = useState<number | null>(null);
  const [attempted, setAttempted] = useState(false);
  const [openPicker, setOpenPicker] = useState<number | null>(null);

  const switchCount = (n: WireCount) => {
    setWireCount(n);
    setWires(Array(n).fill("blank"));
    setSerialOdd(null);
    setCutIndex(null);
    setAttempted(false);
    setOpenPicker(null);
  };

  const pickColor = (i: number, color: WireColor) => {
    const next = [...wires];
    next[i] = color;
    setWires(next);
    setCutIndex(null);
    setOpenPicker(null);
  };

  const setSerial = (val: boolean) => {
    setSerialOdd(val);
    setCutIndex(null);
  };

  const handleReset = () => {
    setWires(Array(wireCount).fill("blank"));
    setSerialOdd(null);
    setCutIndex(null);
    setAttempted(false);
    setOpenPicker(null);
  };

  // ── Validation ──
  const hasBlank = wires.some((w) => w === "blank");
  const allSet = !hasBlank;
  const serialRequired = allSet && needsSerial(wires);
  const serialMissing = serialRequired && serialOdd === null;

  const handleSolve = () => {
    setOpenPicker(null);
    setAttempted(true);
    if (hasBlank || serialMissing) {
      setCutIndex(null);
      return;
    }
    setCutIndex(solveWires(wires, serialOdd));
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Wire count selector */}
      <div className="flex gap-2">
        {WIRE_COUNTS.map((n) => (
          <button
            key={n}
            onClick={() => switchCount(n)}
            className={[
              "px-4 py-2 rounded text-sm font-semibold transition-colors",
              wireCount === n
                ? "bg-red-700 text-white"
                : "bg-gray-800 text-gray-400 hover:bg-gray-700",
            ].join(" ")}
          >
            {n} Wires
          </button>
        ))}
      </div>

      {/* Module panel */}
      <div className="relative w-72 rounded-lg border-2 border-gray-700 bg-gray-950 p-3 space-y-2">
        {/* LED */}
        <div className="absolute top-2.5 right-2.5 w-2.5 h-2.5 rounded-full bg-gray-800 border border-gray-600" />

        {wires.map((color, i) => {
          const isBlankError = attempted && color === "blank";
          const isCut = cutIndex === i;
          const isOpen = openPicker === i;

          return (
            <div key={i} className="relative">
              {/* Wire row */}
              <button
                onClick={() => setOpenPicker(isOpen ? null : i)}
                className={[
                  "w-full h-10 rounded flex items-center gap-2 px-3 transition-all select-none cursor-pointer",
                  WIRE_BG[color],
                  isCut
                    ? "ring-2 ring-green-500 ring-offset-2 ring-offset-gray-950"
                    : isBlankError
                    ? "ring-2 ring-red-500 ring-offset-1 ring-offset-gray-950"
                    : isOpen
                    ? "ring-2 ring-indigo-500 ring-offset-1 ring-offset-gray-950"
                    : "hover:opacity-80",
                ].join(" ")}
              >
                <span className={`font-mono text-xs font-bold w-4 shrink-0 ${WIRE_TEXT[color]}`}>
                  {i + 1}
                </span>
                <span className={`flex-1 text-xs font-semibold uppercase text-center ${WIRE_TEXT[color]}`}>
                  {color === "blank" ? "tap to set" : color}
                </span>
                {isCut ? (
                  <span className="text-xs font-bold text-green-300 shrink-0">CUT</span>
                ) : (
                  <span className="w-10 shrink-0" />
                )}
              </button>

              {/* Color picker dropdown */}
              {isOpen && (
                <div className="absolute left-0 right-0 z-20 mt-1 rounded-lg border border-gray-700 bg-gray-900 p-2 flex gap-1.5 shadow-xl">
                  {COLORS.map((c) => (
                    <button
                      key={c}
                      onClick={() => pickColor(i, c)}
                      title={c}
                      className={[
                        "flex-1 h-8 rounded transition-all",
                        WIRE_BG[c],
                        color === c
                          ? "ring-2 ring-white ring-offset-1 ring-offset-gray-900 scale-105"
                          : "hover:opacity-80",
                      ].join(" ")}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <p className="text-xs text-gray-600">Click a wire to choose its color</p>

      {/* Blank wire error */}
      {attempted && hasBlank && (
        <p className="text-xs text-red-400 text-center">
          All wires must be set before solving.
        </p>
      )}

      {/* Serial parity for 4/5/6 */}
      {wireCount > 3 && (
        <div
          className={[
            "flex items-center gap-2 rounded-md px-3 py-2 transition-colors",
            attempted && serialMissing
              ? "bg-red-950/40 ring-1 ring-red-600"
              : "bg-gray-900",
          ].join(" ")}
        >
          <span className="text-xs text-gray-400 shrink-0">Serial last digit:</span>
          {(["Odd", "Even"] as const).map((label) => (
            <button
              key={label}
              onClick={() => setSerial(label === "Odd")}
              className={[
                "px-3 py-1 rounded text-xs font-medium transition-colors",
                serialOdd === (label === "Odd")
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700",
              ].join(" ")}
            >
              {label}
            </button>
          ))}
          {attempted && serialMissing && (
            <span className="text-xs text-red-400 ml-auto shrink-0">Required</span>
          )}
        </div>
      )}

      {/* Serial missing error */}
      {attempted && serialMissing && (
        <p className="text-xs text-red-400 text-center">
          This configuration requires knowing the serial number&apos;s last digit.
        </p>
      )}

      {/* Action buttons */}
      <div className="flex gap-2 w-72">
        <button
          onClick={handleSolve}
          className="flex-1 py-2 rounded bg-green-700 hover:bg-green-600 text-white text-sm font-semibold transition-colors"
        >
          Solve
        </button>
        <button
          onClick={handleReset}
          className="px-4 py-2 rounded bg-gray-800 hover:bg-gray-700 text-gray-400 text-xs transition-colors"
        >
          Reset
        </button>
      </div>

      {/* Result */}
      {cutIndex !== null && (
        <p className="text-sm font-semibold text-green-400 text-center">
          Cut the {ORDINALS[cutIndex]} wire
          <span className="font-normal text-gray-400"> ({wires[cutIndex]})</span>
        </p>
      )}

      {/* Backdrop to close picker */}
      {openPicker !== null && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => setOpenPicker(null)}
        />
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function WiresPage() {
  const [tab, setTab] = useState<Tab>("manual");
  const mod = modules.find((m) => m.slug === "wires")!;

  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      <nav className="mb-8">
        <Link
          href="/"
          className="text-sm text-gray-500 hover:text-gray-300 transition-colors"
        >
          ← Back to modules
        </Link>
      </nav>

      <h1 className="text-3xl font-bold text-red-500 mb-6">Wires</h1>

      {/* Tabs */}
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

      {tab === "solver" && <WireSolver />}

      <nav className="mt-10 flex justify-between text-sm">
        <span />
        <Link
          href="/modules/the-button"
          className="text-gray-500 hover:text-gray-300 transition-colors"
        >
          The Button →
        </Link>
      </nav>
    </main>
  );
}
