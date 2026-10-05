"use client";

import { useState } from "react";
import Link from "next/link";
import { modules } from "@/app/data/modules";

type Tab = "manual" | "solver";

const MORSE_ALPHA: Record<string, string> = {
  ".-": "A", "-...": "B", "-.-.": "C", "-..": "D", ".": "E",
  "..-.": "F", "--.": "G", "....": "H", "..": "I", ".---": "J",
  "-.-": "K", ".-..": "L", "--": "M", "-.": "N", "---": "O",
  ".--.": "P", "--.-": "Q", ".-.": "R", "...": "S", "-": "T",
  "..-": "U", "...-": "V", ".--": "W", "-..-": "X", "-.--": "Y",
  "--..": "Z",
};

const WORD_FREQ: { word: string; freq: string }[] = [
  { word: "shell",  freq: "3.505" },
  { word: "halls",  freq: "3.515" },
  { word: "slick",  freq: "3.522" },
  { word: "trick",  freq: "3.532" },
  { word: "boxes",  freq: "3.535" },
  { word: "leaks",  freq: "3.542" },
  { word: "strobe", freq: "3.545" },
  { word: "bistro", freq: "3.552" },
  { word: "flick",  freq: "3.555" },
  { word: "bombs",  freq: "3.565" },
  { word: "break",  freq: "3.572" },
  { word: "brick",  freq: "3.575" },
  { word: "steak",  freq: "3.582" },
  { word: "sting",  freq: "3.592" },
  { word: "vector", freq: "3.595" },
  { word: "beats",  freq: "3.600" },
];

function MorseCodeSolver() {
  const [current, setCurrent] = useState("");
  const [decoded, setDecoded] = useState("");

  const letter = MORSE_ALPHA[current] ?? null;
  const candidates = WORD_FREQ.filter(({ word }) => word.startsWith(decoded));
  const solved = candidates.length === 1 && decoded.length > 0;

  const addSymbol = (sym: "." | "-") => {
    if (current.length < 6) setCurrent((p) => p + sym);
  };

  const commitLetter = () => {
    if (!letter) return;
    setDecoded((p) => p + letter.toLowerCase());
    setCurrent("");
  };

  const backspaceLetter = () => {
    setDecoded((p) => p.slice(0, -1));
  };

  const reset = () => {
    setCurrent("");
    setDecoded("");
  };

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Module visual */}
      <div className="relative rounded-lg border-2 border-gray-700 bg-gray-950 p-4 w-44 flex flex-col items-center gap-3">
        <div className="absolute top-2 right-2 w-3 h-3 rounded-full bg-gray-400 border-2 border-gray-300" />
        <div className="mt-3 w-5 h-5 rounded-full bg-yellow-400 border border-yellow-300 shadow-[0_0_10px_rgba(250,204,21,0.6)]" />
        <div className="w-full h-8 bg-black rounded flex items-center justify-center font-mono text-sm text-green-400 tracking-wider">
          {solved ? `${candidates[0].freq} MHz` : "-- --- ---"}
        </div>
        <button className="w-12 h-7 bg-gray-700 rounded text-[10px] font-semibold text-gray-400 tracking-wider self-end">
          TX
        </button>
      </div>

      {/* Morse input */}
      <div className="w-full max-w-xs space-y-3">
        <div className="flex items-center gap-2">
          <div className="flex-1 h-10 bg-gray-900 border border-gray-700 rounded flex items-center justify-center font-mono text-base tracking-widest text-white min-w-0 overflow-hidden px-2">
            {current || <span className="text-gray-600 text-xs">tap dot or dash</span>}
          </div>
          <div className="w-10 h-10 bg-gray-800 rounded flex items-center justify-center font-mono text-lg font-bold text-yellow-400 shrink-0">
            {letter ?? "?"}
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => addSymbol(".")}
            className="flex-1 h-12 rounded bg-gray-800 hover:bg-gray-700 text-white text-xl font-bold transition-colors"
          >
            ·
          </button>
          <button
            onClick={() => addSymbol("-")}
            className="flex-1 h-12 rounded bg-gray-800 hover:bg-gray-700 text-white text-2xl font-bold transition-colors"
          >
            -
          </button>
          <button
            onClick={() => setCurrent((p) => p.slice(0, -1))}
            className="px-3 h-12 rounded bg-gray-800 hover:bg-gray-700 text-gray-400 text-xs transition-colors"
          >
            del
          </button>
        </div>

        <button
          onClick={commitLetter}
          disabled={!letter}
          className="w-full py-2 rounded bg-indigo-700 hover:bg-indigo-600 disabled:bg-gray-800 disabled:text-gray-600 text-white text-sm font-semibold transition-colors"
        >
          {letter ? `Add letter "${letter}"` : "Add letter"}
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 shrink-0">Word:</span>
          <span className="font-mono text-lg font-bold text-white tracking-widest">
            {decoded || <span className="text-gray-700 text-sm">none yet</span>}
          </span>
          {decoded && (
            <button
              onClick={backspaceLetter}
              className="ml-auto text-xs text-gray-600 hover:text-gray-400 transition-colors shrink-0"
            >
              undo
            </button>
          )}
        </div>
      </div>

      {/* Candidates */}
      {decoded.length > 0 && (
        <div className="w-full max-w-xs">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2">
            Candidates ({candidates.length})
          </p>
          {candidates.length === 0 ? (
            <p className="text-xs text-red-400">No match. Check your input.</p>
          ) : solved ? (
            <div className="rounded-lg p-3 bg-green-950/40 border border-green-700 text-center space-y-1">
              <p className="font-mono font-bold text-green-400 text-lg">{candidates[0].word}</p>
              <p className="text-white font-semibold text-lg">{candidates[0].freq} MHz</p>
            </div>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {candidates.map(({ word }) => (
                <span key={word} className="px-2 py-1 rounded text-xs font-mono bg-gray-800 text-gray-300">
                  {word}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="flex gap-2">
        <button
          onClick={() => setCurrent("")}
          className="px-3 py-1.5 rounded bg-gray-800 hover:bg-gray-700 text-gray-400 text-xs transition-colors"
        >
          Clear letter
        </button>
        <button
          onClick={reset}
          className="px-3 py-1.5 rounded bg-gray-800 hover:bg-gray-700 text-gray-400 text-xs transition-colors"
        >
          Reset all
        </button>
      </div>
    </div>
  );
}

export default function MorseCodePage() {
  const [tab, setTab] = useState<Tab>("manual");
  const mod = modules.find((m) => m.slug === "morse-code")!;

  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      <nav className="mb-8">
        <Link href="/" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">
          Back to modules
        </Link>
      </nav>

      <h1 className="text-3xl font-bold text-red-500 mb-6">Morse Code</h1>

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

      {tab === "solver" && <MorseCodeSolver />}

      <nav className="mt-10 flex justify-between text-sm">
        <Link href="/modules/memory" className="text-gray-500 hover:text-gray-300 transition-colors">
          Memory
        </Link>
        <Link href="/modules/complicated-wires" className="text-gray-500 hover:text-gray-300 transition-colors">
          Complicated Wires →
        </Link>
      </nav>
    </main>
  );
}
