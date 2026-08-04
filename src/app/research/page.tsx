export default function ResearchPage() {
  const items = [
    {
      title: "TanStack Query + Domain Layer",
      summary:
        "Recommended pattern for server state management in Next.js apps using Supabase. Improves caching, deduplication and testability.",
      source: "TanStack Docs + community patterns 2026",
      usefulness: "High",
    },
    {
      title: "Supabase RLS Best Practices 2026",
      summary:
        "Always enable RLS, use security definer functions carefully, and test policies with different roles. Missing policies are the #1 source of data leaks.",
      source: "Supabase Official + security audits",
      usefulness: "Critical",
    },
    {
      title: "Rate limiting with Upstash or Vercel KV",
      summary:
        "Protect public API routes from abuse. Cheap and easy to implement with edge-compatible stores.",
      source: "Vercel + Upstash docs",
      usefulness: "High",
    },
  ];

  return (
    <div className="min-h-screen p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-white">Research Findings</h1>
        <p className="mt-1 text-sm text-zinc-400">
          Better solutions discovered by the Researcher agent from the internet
        </p>
      </div>

      <div className="grid gap-4 max-w-3xl">
        {items.map((item) => (
          <div
            key={item.title}
            className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5"
          >
            <div className="flex items-start justify-between gap-4">
              <h3 className="text-base font-semibold text-white">{item.title}</h3>
              <span className="shrink-0 rounded-md bg-cyan-500/15 px-2 py-0.5 text-xs font-medium text-cyan-400">
                {item.usefulness}
              </span>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-zinc-400">{item.summary}</p>
            <p className="mt-3 text-[11px] text-zinc-600">Source: {item.source}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
