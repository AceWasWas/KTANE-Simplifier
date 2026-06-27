import Link from "next/link";
import { modules } from "./data/modules";

export default function Home() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-red-500 mb-2">
          KTaNE Simplifier
        </h1>
        <p className="text-lg text-gray-400 mb-1">
          Keep Talking and Nobody Explodes — Quick Reference
        </p>
        <p className="text-sm text-gray-500 max-w-xl mx-auto">
          A companion tool for the bomb defuser. Select a module below to view
          its disarming instructions. Study carefully — one small oversight and
          it could all be over.
        </p>
      </header>

      <section>
        <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-4">
          Section 1 — Modules
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {modules.map((mod, i) => (
            <Link
              key={mod.slug}
              href={`/modules/${mod.slug}`}
              className="group flex items-center gap-3 rounded-lg border border-gray-800 bg-gray-900 px-4 py-3 hover:border-red-600 hover:bg-gray-800 transition-colors"
            >
              <span className="text-xs text-gray-600 font-mono w-4 shrink-0">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-sm font-medium text-gray-200 group-hover:text-white">
                {mod.title}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <footer className="mt-16 text-center text-xs text-gray-700">
        Based on the KTaNE Bomb Defusal Manual v1 · Verification Code 241
      </footer>
    </main>
  );
}
