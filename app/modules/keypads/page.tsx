"use client";

import { useState } from "react";
import Link from "next/link";
import { modules } from "@/app/data/modules";

type Tab = "manual" | "solver";
type SymId = string;

const SYMS: Record<SymId, { char: string; label: string }> = {
  "q-b":  { char: "Q",  label: "Q balloon" },
  "a-l":  { char: "A",  label: "A-like" },
  "lam":  { char: "λ",  label: "Lambda λ" },
  "hbar": { char: "ħ",  label: "H-bar ħ" },
  "zh-m": { char: "Ж",  label: "Ж mirrored" },
  "psi":  { char: "ψ",  label: "Psi ψ" },
  "hkc":  { char: "Ↄ",  label: "Reversed C" },
  "de":   { char: "Ϗ",  label: "Dotted E Ϗ" },
  "omg":  { char: "Ω",  label: "Omega Ω" },
  "sto":  { char: "☆",  label: "Star outline" },
  "iq":   { char: "¿",  label: "Inv. question" },
  "cpy":  { char: "©",  label: "Copyright ©" },
  "smp":  { char: "ϡ",  label: "Sampi ϡ" },
  "zh-s": { char: "Ж",  label: "Ж standard" },
  "geo":  { char: "ვ",  label: "Georgian ვ" },
  "cb":   { char: "б",  label: "б (b-like)" },
  "plc":  { char: "¶",  label: "Pilcrow ¶" },
  "hs":   { char: "Ъ",  label: "Hard sign Ъ" },
  "ara":  { char: "ﻬ",  label: "Arabic lam" },
  "PSI":  { char: "Ψ",  label: "Psi caps Ψ" },
  "cdt":  { char: "Ċ",  label: "C with dot" },
  "stf":  { char: "★",  label: "Star filled" },
  "ast":  { char: "✱",  label: "Asterisk ✱" },
  "ae":   { char: "æ",  label: "AE ligature" },
  "ci":   { char: "И",  label: "Cyrillic И" },
};

const COLUMNS: SymId[][] = [
  ["q-b",  "a-l",  "lam",  "hbar", "zh-m", "psi",  "hkc"],
  ["de",   "q-b",  "hkc",  "omg",  "sto",  "psi",  "iq"],
  ["cpy",  "smp",  "omg",  "zh-s", "geo",  "lam",  "sto"],
  ["cb",   "plc",  "hs",   "zh-m", "zh-s", "iq",   "ara"],
  ["PSI",  "ara",  "hs",   "cdt",  "plc",  "geo",  "stf"],
  ["cb",   "de",   "ast",  "ae",   "PSI",  "ci",   "omg"],
];

const SYM_ORDER = Object.keys(SYMS);

function KeypadsSolver() {
  const [selected, setSelected] = useState<Set<SymId>>(new Set());

  const toggle = (id: SymId) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); return next; }
      if (next.size >= 4) return prev;
      next.add(id);
      return next;
    });
  };

  const matchCol = selected.size === 4
    ? COLUMNS.findIndex((col) => [...selected].every((id) => col.includes(id)))
    : -1;

  const pressOrder = matchCol >= 0
    ? COLUMNS[matchCol].filter((id) => selected.has(id))
    : [];

  const selectedArr = [...selected];

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Module visual */}
      <div className="relative rounded-lg border-2 border-gray-700 bg-gray-950 p-3 w-48">
        <div className="absolute top-2 right-2 w-3 h-3 rounded-full bg-gray-400 border-2 border-gray-300" />
        <div className="grid grid-cols-2 gap-2 mt-4">
          {[0, 1, 2, 3].map((i) => {
            const id = selectedArr[i];
            return (
              <div
                key={i}
                className="h-10 bg-gray-900 border border-gray-700 rounded flex items-center justify-center font-mono text-lg text-white"
              >
                {id ? SYMS[id].char : ""}
              </div>
            );
          })}
        </div>
      </div>

      {/* Symbol grid */}
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">
            Select your 4 symbols ({selected.size}/4)
          </p>
          {selected.size > 0 && (
            <button
              onClick={() => setSelected(new Set())}
              className="text-xs text-gray-600 hover:text-gray-400 transition-colors"
            >
              Clear
            </button>
          )}
        </div>

        <div className="grid grid-cols-5 gap-1.5">
          {SYM_ORDER.map((id) => {
            const { char, label } = SYMS[id];
            const isSel = selected.has(id);
            const disabled = !isSel && selected.size >= 4;
            return (
              <button
                key={id}
                onClick={() => toggle(id)}
                disabled={disabled}
                title={label}
                className={[
                  "h-12 rounded flex flex-col items-center justify-center font-mono text-xl transition-colors",
                  isSel
                    ? "bg-indigo-600 text-white ring-1 ring-indigo-400"
                    : disabled
                    ? "bg-gray-900 text-gray-700 cursor-not-allowed"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700",
                ].join(" ")}
              >
                {char}
              </button>
            );
          })}
        </div>
        <p className="text-[10px] text-gray-600 mt-1.5 text-center">
          Hover for symbol name. Ж appears twice as mirrored and standard variants.
        </p>
      </div>

      {/* Result */}
      {selected.size === 4 && (
        matchCol >= 0 ? (
          <div className="w-full max-w-sm space-y-3">
            <div className="rounded-lg p-3 bg-green-950/40 border border-green-700 text-center">
              <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Column {matchCol + 1}</p>
              <p className="font-semibold text-green-400 text-sm">Press in this order (top to bottom):</p>
            </div>
            <div className="flex gap-3 justify-center">
              {pressOrder.map((id, i) => (
                <div key={id} className="flex flex-col items-center gap-1">
                  <span className="text-[10px] text-gray-600">{i + 1}</span>
                  <div className="w-11 h-11 bg-indigo-700 rounded flex items-center justify-center font-mono text-xl text-white">
                    {SYMS[id].char}
                  </div>
                  <span className="text-[10px] text-gray-500 text-center w-14 leading-tight">
                    {SYMS[id].label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="rounded-lg p-3 bg-red-950/40 border border-red-700 text-xs text-center space-y-1">
            <p className="text-red-400 font-semibold">No column contains all 4 symbols.</p>
            <p className="text-gray-600">
              Ж has two variants that look the same in text. Try swapping between mirrored and standard.
            </p>
          </div>
        )
      )}
    </div>
  );
}

export default function KeypadsPage() {
  const [tab, setTab] = useState<Tab>("manual");
  const mod = modules.find((m) => m.slug === "keypads")!;

  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      <nav className="mb-8">
        <Link href="/" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">
          Back to modules
        </Link>
      </nav>

      <h1 className="text-3xl font-bold text-red-500 mb-6">Keypads</h1>

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

      {tab === "solver" && <KeypadsSolver />}

      <nav className="mt-10 flex justify-between text-sm">
        <Link href="/modules/the-button" className="text-gray-500 hover:text-gray-300 transition-colors">
          The Button
        </Link>
        <Link href="/modules/simon-says" className="text-gray-500 hover:text-gray-300 transition-colors">
          Simon Says →
        </Link>
      </nav>
    </main>
  );
}
