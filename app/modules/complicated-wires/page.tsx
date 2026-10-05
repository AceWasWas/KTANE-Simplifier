"use client";

import { useState } from "react";
import Link from "next/link";
import { modules } from "@/app/data/modules";

type Tab = "manual" | "solver";
type Action = "C" | "D" | "S" | "P" | "B";

interface Wire {
  red: boolean;
  blue: boolean;
  star: boolean;
  led: boolean;
}

const ACTION_TABLE: Record<string, Action> = {
  "0000": "C", "0001": "C",
  "0010": "S", "0011": "D",
  "0100": "S", "0101": "D",
  "0110": "B", "0111": "B",
  "1000": "C", "1001": "C",
  "1010": "P", "1011": "P",
  "1100": "S", "1101": "D",
  "1110": "B", "1111": "D",
};

function getAction(w: Wire): Action {
  return ACTION_TABLE[`${+w.red}${+w.blue}${+w.star}${+w.led}`];
}

function resolve(
  action: Action,
  serialEven: boolean | null,
  parallel: boolean | null,
  twoBatt: boolean | null,
): boolean | null {
  if (action === "C") return true;
  if (action === "D") return false;
  if (action === "S") return serialEven;
  if (action === "P") return parallel;
  if (action === "B") return twoBatt;
  return null;
}

function newWire(): Wire {
  return { red: false, blue: false, star: false, led: false };
}

function WireVisual({ w }: { w: Wire }) {
  let bg = "bg-gray-300";
  if (w.red && w.blue) bg = "bg-gradient-to-r from-red-500 via-blue-500 to-red-500";
  else if (w.red) bg = "bg-red-500";
  else if (w.blue) bg = "bg-blue-500";
  return <div className={`h-1.5 rounded-full ${bg} flex-1`} />;
}

function ComplWiresSolver() {
  const [wires, setWires] = useState<Wire[]>([newWire(), newWire()]);
  const [serialEven, setSerialEven] = useState<boolean | null>(null);
  const [parallel, setParallel] = useState<boolean | null>(null);
  const [twoBatt, setTwoBatt] = useState<boolean | null>(null);

  const toggle = (i: number, prop: keyof Wire) => {
    setWires((prev) => {
      const next = [...prev];
      next[i] = { ...next[i], [prop]: !next[i][prop] };
      return next;
    });
  };

  const addWire = () => {
    if (wires.length < 6) setWires((p) => [...p, newWire()]);
  };

  const removeWire = (i: number) => {
    setWires((p) => p.filter((_, j) => j !== i));
  };

  const needsInfo = wires.some((w) => {
    const a = getAction(w);
    return (
      (a === "S" && serialEven === null) ||
      (a === "P" && parallel === null) ||
      (a === "B" && twoBatt === null)
    );
  });

  const actionLabel: Record<Action, string> = {
    C: "C - always cut",
    D: "D - never cut",
    S: "S - cut if serial even",
    P: "P - cut if parallel port",
    B: "B - cut if 2+ batteries",
  };

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Module visual */}
      <div className="relative rounded-lg border-2 border-gray-700 bg-gray-950 p-3 w-60">
        <div className="absolute top-2 right-2 w-3 h-3 rounded-full bg-gray-400 border-2 border-gray-300" />
        <div className="space-y-2 mt-4">
          {wires.map((w, i) => {
            const action = getAction(w);
            const cut = resolve(action, serialEven, parallel, twoBatt);
            return (
              <div key={i} className="flex items-center gap-2">
                {w.led ? (
                  <div className="w-2 h-2 rounded-full bg-yellow-400 shrink-0" />
                ) : (
                  <div className="w-2 h-2 rounded-full bg-gray-700 shrink-0" />
                )}
                <WireVisual w={w} />
                {w.star ? (
                  <span className="text-[10px] text-white shrink-0">★</span>
                ) : (
                  <span className="w-3 shrink-0" />
                )}
                {cut === true && (
                  <span className="text-[10px] font-bold text-green-400 shrink-0">CUT</span>
                )}
                {cut === false && (
                  <span className="text-[10px] font-bold text-red-400 shrink-0">SKIP</span>
                )}
                {cut === null && (
                  <span className="text-[10px] text-gray-600 shrink-0">?</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Wire list */}
      <div className="w-full max-w-sm space-y-2">
        <div className="flex items-center justify-between mb-1">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">
            Wires ({wires.length}/6)
          </p>
          {wires.length < 6 && (
            <button
              onClick={addWire}
              className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              + Add wire
            </button>
          )}
        </div>

        {wires.map((w, i) => {
          const action = getAction(w);
          const cut = resolve(action, serialEven, parallel, twoBatt);
          return (
            <div
              key={i}
              className="flex items-center gap-2 bg-gray-900 border border-gray-800 rounded-lg px-3 py-2"
            >
              <span className="text-xs text-gray-600 font-mono w-4 shrink-0">{i + 1}</span>

              {/* Property toggles */}
              {(["red", "blue", "star", "led"] as const).map((prop) => {
                const labels: Record<string, string> = { red: "R", blue: "B", star: "★", led: "LED" };
                const active: Record<string, string> = {
                  red: "bg-red-600 text-white",
                  blue: "bg-blue-600 text-white",
                  star: "bg-yellow-600 text-white",
                  led: "bg-yellow-400 text-gray-900",
                };
                return (
                  <button
                    key={prop}
                    onClick={() => toggle(i, prop)}
                    className={[
                      "px-1.5 py-0.5 rounded text-[10px] font-bold transition-colors",
                      w[prop]
                        ? active[prop]
                        : "bg-gray-800 text-gray-600 hover:bg-gray-700 hover:text-gray-400",
                    ].join(" ")}
                  >
                    {labels[prop]}
                  </button>
                );
              })}

              <span className="flex-1" />

              {/* Action code */}
              <span className="text-[10px] text-gray-600 font-mono" title={actionLabel[action]}>
                {action}
              </span>

              {/* Result */}
              {cut === true && (
                <span className="text-xs font-bold text-green-400 w-12 text-right">CUT</span>
              )}
              {cut === false && (
                <span className="text-xs font-bold text-red-400 w-12 text-right">SKIP</span>
              )}
              {cut === null && (
                <span className="text-xs text-gray-600 w-12 text-right">need info</span>
              )}

              {wires.length > 1 && (
                <button
                  onClick={() => removeWire(i)}
                  className="text-gray-700 hover:text-gray-500 text-xs ml-1 transition-colors"
                >
                  x
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Bomb info */}
      {needsInfo && (
        <div className="w-full max-w-sm bg-gray-900 border border-gray-800 rounded-lg p-3 space-y-2.5">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">Bomb Info</p>

          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 w-28 shrink-0">Serial last digit</span>
            {(["Even", "Odd"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setSerialEven(serialEven === (v === "Even") ? null : v === "Even")}
                className={[
                  "px-2.5 py-1 rounded text-xs font-medium transition-colors",
                  serialEven === (v === "Even")
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-800 text-gray-400 hover:bg-gray-700",
                ].join(" ")}
              >
                {v}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 w-28 shrink-0">Parallel port</span>
            {(["Yes", "No"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setParallel(parallel === (v === "Yes") ? null : v === "Yes")}
                className={[
                  "px-2.5 py-1 rounded text-xs font-medium transition-colors",
                  parallel === (v === "Yes")
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-800 text-gray-400 hover:bg-gray-700",
                ].join(" ")}
              >
                {v}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 w-28 shrink-0">2+ batteries</span>
            {(["Yes", "No"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setTwoBatt(twoBatt === (v === "Yes") ? null : v === "Yes")}
                className={[
                  "px-2.5 py-1 rounded text-xs font-medium transition-colors",
                  twoBatt === (v === "Yes")
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-800 text-gray-400 hover:bg-gray-700",
                ].join(" ")}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={() => {
          setWires([newWire(), newWire()]);
          setSerialEven(null);
          setParallel(null);
          setTwoBatt(null);
        }}
        className="px-4 py-2 rounded bg-gray-800 hover:bg-gray-700 text-gray-400 text-xs transition-colors"
      >
        Reset
      </button>
    </div>
  );
}

export default function ComplicatedWiresPage() {
  const [tab, setTab] = useState<Tab>("manual");
  const mod = modules.find((m) => m.slug === "complicated-wires")!;

  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      <nav className="mb-8">
        <Link href="/" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">
          Back to modules
        </Link>
      </nav>

      <h1 className="text-3xl font-bold text-red-500 mb-6">Complicated Wires</h1>

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

      {tab === "solver" && <ComplWiresSolver />}

      <nav className="mt-10 flex justify-between text-sm">
        <Link href="/modules/morse-code" className="text-gray-500 hover:text-gray-300 transition-colors">
          Morse Code
        </Link>
        <Link href="/modules/wire-sequences" className="text-gray-500 hover:text-gray-300 transition-colors">
          Wire Sequences →
        </Link>
      </nav>
    </main>
  );
}
