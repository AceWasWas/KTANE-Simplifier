import { notFound } from "next/navigation";
import Link from "next/link";
import { getModule, modules } from "@/app/data/modules";

export function generateStaticParams() {
  return modules.map((m) => ({ slug: m.slug }));
}

export default async function ModulePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const mod = getModule(slug);
  if (!mod) notFound();

  const currentIndex = modules.findIndex((m) => m.slug === slug);
  const prev = modules[currentIndex - 1];
  const next = modules[currentIndex + 1];

  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      <nav className="mb-8">
        <Link
          href="/"
          className="text-sm text-gray-500 hover:text-gray-300 transition-colors"
        >
          ← Back to modules
        </Link>
      </nav>

      <article>
        <h1 className="text-3xl font-bold text-red-500 mb-8">{mod.title}</h1>
        <pre className="whitespace-pre-wrap font-mono text-sm leading-7 text-gray-300 bg-gray-900 rounded-lg border border-gray-800 p-6">
          {mod.content}
        </pre>
      </article>

      <nav className="mt-10 flex justify-between text-sm">
        {prev ? (
          <Link
            href={`/modules/${prev.slug}`}
            className="text-gray-500 hover:text-gray-300 transition-colors"
          >
            ← {prev.title}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            href={`/modules/${next.slug}`}
            className="text-gray-500 hover:text-gray-300 transition-colors"
          >
            {next.title} →
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </main>
  );
}
