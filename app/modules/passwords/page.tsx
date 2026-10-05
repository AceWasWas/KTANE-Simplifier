"use client";

import { useState } from "react";
import Link from "next/link";
import { modules } from "@/app/data/modules";

type Tab = "manual" | "solver";

const WORDS = [
  "about","after","again","below","could",
  "every","first","found","great","house",
  "large","learn","never","other","place",
  "plant","point","right","small","sound",
  "spell","still","study","their","there",
  "these","thing","think","three","water",
  "where","which","world","would","write",
];

function PasswordsSolver() {
  const [positions, setPositions] = useState(["", "", "", "", ""]);

  const setPos = (i: number, val: string) => {
    const next = [...positions];
    next[i] = val.toUpperCase().replace(/[^A-Z]/g, "");
    setPositions(next);
  };

  const matches = WORDS.filter((word) =>
    positions.every((letters, i) => !letters || letters.includes(word[i].toUpperCase()))
  );

  const solved = matches.length === 1;

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Module visual */}
      <div className="relative rounded-lg border-2 border-gray-700 bg-gray-950 p-3 w-64">
        <div className="absolute top-2 right-2 w-3 h-3 rounded-full bg-gray-400 border-2 border-gray-300" />
        <div className="flex gap-1.5 mt-4">
          {positions.map((letters, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div className="text-[8px] text-gray-700">▲</div>
              <div className="w-full h-9 bg-black rounded flex items-center justify-center font-mono text-base font-bold text-white">
                {letters ? letters[0] : "?"}
              </div>
              <div className="text-[8px] text-gray-700">▼</div>
            </div>
          ))}
        </div>
        <button className="w-full mt-2 h-7 bg-gray-800 rounded text-[10px] font-semibold text-gray-500 tracking-wider">
          SUBMIT
        </button>
      </div>

      {/* Inputs */}
      <div className="w-full max-w-xs">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-3">
          Available Letters Per Position
        </p>
        <div className="flex gap-1.5">
          {positions.map((letters, i) => (
            <div key={i} className="flex-1 flex flex-col gap-1">
              <span className="text-[10px] text-gray-600 text-center font-mono">{i + 1}</span>
              <input
                type="text"
                value={letters}
                onChange={(e) => setPos(i, e.target.value)}
                maxLength={26}
                placeholder="?"
                className="w-full h-9 bg-gray-900 border border-gray-700 rounded text-center text-xs font-mono text-white focus:outline-none focus:border-indigo-500 uppercase"
              />
            </div>
          ))}
        </div>
        <p className="text-[10px] text-gray-600 mt-2 text-center">
          Type all letters available at each position as you cycle through
        </p>
      </div>

      {/* Matches */}
      {positions.some((p) => p) && (
        <div className="w-full max-w-xs">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2">
            Matches ({matches.length})
          </p>
          {matches.length === 0 ? (
            <p className="text-xs text-red-400">No matches. Check your letters.</p>
          ) : solved ? (
            <div className="rounded-lg p-3 bg-green-950/40 border border-green-700 text-center">
              <p className="font-mono font-bold text-green-400 text-xl tracking-widest">
                {matches[0]}
              </p>
            </div>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {matches.map((word) => (
                <span
                  key={word}
                  className="px-2 py-1 rounded text-xs font-mono bg-gray-800 text-gray-300"
                >
                  {word}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      <button
        onClick={() => setPositions(["", "", "", "", ""])}
        className="px-4 py-2 rounded bg-gray-800 hover:bg-gray-700 text-gray-400 text-xs transition-colors"
      >
        Reset
      </button>
    </div>
  );
}

export default function PasswordsPage() {
  const [tab, setTab] = useState<Tab>("manual");
  const mod = modules.find((m) => m.slug === "passwords")!;

  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      <nav className="mb-8">
        <Link href="/" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">
          Back to modules
        </Link>
      </nav>

      <h1 className="text-3xl font-bold text-red-500 mb-6">Passwords</h1>

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

      {tab === "solver" && <PasswordsSolver />}

      <nav className="mt-10 flex justify-between text-sm">
        <Link href="/modules/mazes" className="text-gray-500 hover:text-gray-300 transition-colors">
          Mazes
        </Link>
        <span />
      </nav>
    </main>
  );
}
