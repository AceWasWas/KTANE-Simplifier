"use client";

import { useState } from "react";
import Link from "next/link";
import { modules } from "@/app/data/modules";

// ─── Types ────────────────────────────────────────────────────────────────────

type FlashColor = "red" | "blue" | "green" | "yellow";
type StrikeCount = 0 | 1 | 2;
type Tab = "manual" | "solver";

// ─── Constants ────────────────────────────────────────────────────────────────

const COLOR_BG: Record<FlashColor, string> = {
  red: "bg-red-600",
  blue: "bg-blue-600",
  green: "bg-green-600",
  yellow: "bg-yellow-400",
};

const COLOR_TEXT: Record<FlashColor, string> = {
  red: "text-white",
  blue: "text-white",
  green: "text-white",
  yellow: "text-yellow-900",
};

// Source: Simon Says manual table (vowel / no-vowel, 0/1/2 strikes)
const TRANSLATE: Record<
  "vowel" | "noVowel",
  Record<StrikeCount, Record<FlashColor, FlashColor>>
> = {
  vowel: {
    0: { red: "blue",   blue: "red",   green: "yellow", yellow: "green" },
    1: { red: "yellow", blue: "green", green: "blue",   yellow: "red"   },
    2: { red: "green",  blue: "red",   green: "yellow", yellow: "blue"  },
  },
  noVowel: {
    0: { red: "blue",   blue: "yellow", green: "green",  yellow: "red"   },
    1: { red: "red",    blue: "blue",   green: "yellow", yellow: "green" },
    2: { red: "yellow", blue: "green",  green: "blue",   yellow: "red"   },
  },
};

// ─── SimonSaysSolver ──────────────────────────────────────────────────────────

function SimonSaysSolver() {
  const [hasVowel, setHasVowel] = useState<boolean | null>(null);
  const [strikes, setStrikes] = useState<StrikeCount | null>(null);
  const [sequence, setSequence] = useState<FlashColor[]>([]);

  const canAdd = sequence.length < 5;
  const tableKey = hasVowel === null ? null : hasVowel ? "vowel" : "noVowel";
  const ready = tableKey !== null && strikes !== null;

  const addFlash = (color: FlashColor) => {
    if (!canAdd) return;
    setSequence((prev) => [...prev, color]);
  };

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Module visual: 2x2 grid rotated 45deg — Blue top, Yellow right, Red left, Green bottom */}
      <div className="relative rounded-lg border-2 border-gray-700 bg-gray-950 p-4 w-52 h-52 flex items-center justify-center">
        <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-gray-800 border border-gray-600" />
        <div className="rotate-45 grid grid-cols-2 gap-1.5 w-28 h-28">
          {/* top-left → Blue (top of diamond) */}
          <button
            onClick={() => addFlash("blue")}
            disabled={!canAdd}
            title="Blue"
            className={`rounded-sm transition-all ${COLOR_BG.blue} ${
              canAdd ? "hover:opacity-80 active:scale-95 cursor-pointer" : "opacity-40 cursor-not-allowed"
            }`}
          />
          {/* top-right → Yellow (right of diamond) */}
          <button
            onClick={() => addFlash("yellow")}
            disabled={!canAdd}
            title="Yellow"
            className={`rounded-sm transition-all ${COLOR_BG.yellow} ${
              canAdd ? "hover:opacity-80 active:scale-95 cursor-pointer" : "opacity-40 cursor-not-allowed"
            }`}
          />
          {/* bottom-left → Red (left of diamond) */}
          <button
            onClick={() => addFlash("red")}
            disabled={!canAdd}
            title="Red"
            className={`rounded-sm transition-all ${COLOR_BG.red} ${
              canAdd ? "hover:opacity-80 active:scale-95 cursor-pointer" : "opacity-40 cursor-not-allowed"
            }`}
          />
          {/* bottom-right → Green (bottom of diamond) */}
          <button
            onClick={() => addFlash("green")}
            disabled={!canAdd}
            title="Green"
            className={`rounded-sm transition-all ${COLOR_BG.green} ${
              canAdd ? "hover:opacity-80 active:scale-95 cursor-pointer" : "opacity-40 cursor-not-allowed"
            }`}
          />
        </div>
      </div>

      {/* Settings */}
      <div className="w-full max-w-xs space-y-3">
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400 w-14 shrink-0">Serial</span>
          <div className="flex gap-2">
            {([true, false] as const).map((v) => (
              <button
                key={String(v)}
                onClick={() => setHasVowel(v)}
                className={[
                  "px-3 py-1.5 rounded text-xs font-medium transition-colors",
                  hasVowel === v
                    ? "bg-red-700 text-white"
                    : "bg-gray-800 text-gray-400 hover:bg-gray-700",
                ].join(" ")}
              >
                {v ? "Vowel" : "No Vowel"}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400 w-14 shrink-0">Strikes</span>
          <div className="flex gap-2">
            {([0, 1, 2] as StrikeCount[]).map((s) => (
              <button
                key={s}
                onClick={() => setStrikes(s)}
                className={[
                  "px-3 py-1.5 rounded text-xs font-medium transition-colors",
                  strikes === s
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-800 text-gray-400 hover:bg-gray-700",
                ].join(" ")}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Sequence */}
      <div className="w-full max-w-xs">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">
            Sequence{sequence.length > 0 ? ` (${sequence.length}/5)` : ""}
          </p>
          <button
            onClick={() => setSequence([])}
            className="px-3 py-1 rounded bg-gray-800 hover:bg-gray-700 text-gray-400 text-xs transition-colors"
          >
            Reset
          </button>
        </div>

        {sequence.length === 0 ? (
          <p className="text-xs text-gray-600 text-center py-4">
            Tap the color that flashes on the module
          </p>
        ) : (
          <div className="space-y-1.5">
            {sequence.map((flash, i) => {
              const press = ready ? TRANSLATE[tableKey!][strikes!][flash] : null;
              return (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-xs text-gray-600 font-mono w-4 shrink-0">{i + 1}</span>
                  <span
                    className={`px-2.5 py-1 rounded text-xs font-bold capitalize ${COLOR_BG[flash]} ${COLOR_TEXT[flash]}`}
                  >
                    {flash}
                  </span>
                  <span className="text-gray-600 text-sm">→</span>
                  {press ? (
                    <span
                      className={`px-2.5 py-1 rounded text-xs font-bold capitalize ${COLOR_BG[press]} ${COLOR_TEXT[press]}`}
                    >
                      {press}
                    </span>
                  ) : (
                    <span className="text-xs text-gray-600 italic">set serial and strikes</span>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {sequence.length === 5 && (
          <p className="text-xs text-gray-600 mt-3 text-center">Maximum reached</p>
        )}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SimonSaysPage() {
  const [tab, setTab] = useState<Tab>("manual");
  const mod = modules.find((m) => m.slug === "simon-says")!;

  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      <nav className="mb-8">
        <Link href="/" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">
          ← Back to modules
        </Link>
      </nav>

      <h1 className="text-3xl font-bold text-red-500 mb-6">Simon Says</h1>

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

      {tab === "solver" && <SimonSaysSolver />}

      <nav className="mt-10 flex justify-between text-sm">
        <Link
          href="/modules/keypads"
          className="text-gray-500 hover:text-gray-300 transition-colors"
        >
          ← Keypads
        </Link>
        <Link
          href="/modules/whos-on-first"
          className="text-gray-500 hover:text-gray-300 transition-colors"
        >
          {"Who's on First →"}
        </Link>
      </nav>
    </main>
  );
}
