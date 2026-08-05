"use client";

import Link from "next/link";
import {
  Bot,
  Shield,
  Server,
  Zap,
  Lock,
  Activity,
  ArrowRight,
  CheckCircle2,
  GitBranch,
  MessageSquare,
  Radar,
  Code2,
  Eye,
} from "lucide-react";

const PIPELINE = [
  {
    n: "1",
    title: "CodeBoss reviews Finnexus code",
    text: "Pulls real commit diffs from Averok-svg/finnexus (not just messages). Scans patches for secrets, auth risks, RLS issues, dangerous patterns. Critical & High findings auto-open GitHub issues labeled codeboss.",
  },
  {
    n: "2",
    title: "Claude fixes Finnexus",
    text: "Reads open codeboss issues via CLAUDE.md. Runs git show on the real commit, comments genuine vs false positive, implements fixes in Finnexus. Does not close the issue yet.",
  },
  {
    n: "3",
    title: "CodeBoss Master QA sign-off",
    text: "Tier 3 QA (Gemini) reviews the Finnexus code/diff and Claude’s resolution. If sound, posts the exact line: REVIEWED AND FINAL APPROVED BY CODEBOSS MASTER. Never closes issues.",
  },
  {
    n: "4",
    title: "Claude closes",
    text: "Claude closes the Finnexus issue only when that Master approval line is present. Grok/Perplexity may add threat insight but are not a required close gate.",
  },
];

const ENTITIES = [
  {
    icon: GitBranch,
    name: "Finnexus",
    role: "Product under repair",
    detail: "Averok-svg/finnexus — the only application being fixed, reviewed, and shipped. All issues and commits refer to Finnexus.",
    color: "border-cyan-500/30 bg-cyan-500/5 text-cyan-300",
  },
  {
    icon: Radar,
    name: "CodeBoss",
    role: "Diff monitor & scanner",
    detail: "Averok-svg/codeboss on Vercel. Reads Finnexus commit patches, flags real code risks, opens codeboss issues, shows live SOC dashboard.",
    color: "border-indigo-500/30 bg-indigo-500/5 text-indigo-300",
  },
  {
    icon: Code2,
    name: "Claude Code",
    role: "Tier 1 developer",
    detail: "Implements Finnexus fixes from CodeBoss issues. Follows CLAUDE.md. Closes only after Master approval line exists.",
    color: "border-emerald-500/30 bg-emerald-500/5 text-emerald-300",
  },
  {
    icon: Shield,
    name: "CodeBoss Master",
    role: "Tier 3 Principal QA",
    detail: "Gemini-powered QA on Google AI Studio / Cloud Run. Reviews Finnexus diffs, posts findings, appends REVIEWED AND FINAL APPROVED BY CODEBOSS MASTER.",
    color: "border-violet-500/30 bg-violet-500/5 text-violet-300",
  },
];

const FEATURES = [
  {
    icon: Eye,
    title: "Real diff code review",
    desc: "Fetches GitHub commit patches and scans added lines for hardcoded secrets, service-role keys, eval, XSS sinks, permissive CORS, RLS changes, and type-safety bypasses.",
  },
  {
    icon: Radar,
    title: "Live SOC dashboard",
    desc: "Cyber-style UI with System Safe / Scanning badges, animated graphs, agent workstations, pulse counter, health score, and backend activity from real scans.",
  },
  {
    icon: MessageSquare,
    title: "GitHub as the board",
    desc: "Issues labeled codeboss on Finnexus are the single source of truth. Detection, fixes, QA comments, and close all live on the issue thread.",
  },
  {
    icon: Shield,
    title: "Single Master approval gate",
    desc: "Claude cannot close on its own. Close requires REVIEWED AND FINAL APPROVED BY CODEBOSS MASTER. No chat-based second gate.",
  },
  {
    icon: Lock,
    title: "Private repo safe",
    desc: "GitHub PAT only in Vercel env for CodeBoss. Monitor analysis is rule-based on diffs — no extra LLM bill on the scanner itself.",
  },
  {
    icon: Activity,
    title: "KPIs that move",
    desc: "Critical, High, Diff findings, Patches read, Open issues, Health %, last-scan age, live pulse, and charts driven by scan data.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#060a12] text-slate-100">
      <header className="border-b border-slate-800/80 bg-[#080d18]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-400">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">CodeBoss</p>
              <p className="text-[10px] text-slate-500">About · Finnexus pipeline</p>
            </div>
          </Link>
          <Link
            href="/"
            className="flex items-center gap-2 rounded-full bg-indigo-600 px-4 py-2 text-xs font-medium text-white hover:bg-indigo-500"
          >
            Open live dashboard
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-12">
        {/* Hero */}
        <section className="mb-14 text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">
            Finnexus · Diff code review · Master QA gate
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            What CodeBoss does for Finnexus
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-slate-400">
            The product under repair is <strong className="text-white">Finnexus</strong>{" "}
            (<code className="text-cyan-300">Averok-svg/finnexus</code>). CodeBoss is the
            monitor and code-review layer for Finnexus — it reads real commit diffs, flags
            problems in Finnexus code, opens issues on the Finnexus repo, and coordinates
            Claude Code and CodeBoss Master so Finnexus gets fixed safely. Claude is a tool
            in this pipeline; <strong className="text-slate-200">Finnexus is the application</strong>.
          </p>
        </section>

        {/* Entity map */}
        <section className="mb-16">
          <h2 className="text-xl font-semibold text-white">Who does what</h2>
          <p className="mt-2 text-sm text-slate-400">Locked naming — use these names everywhere.</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {ENTITIES.map((e) => (
              <div key={e.name} className={`rounded-2xl border p-5 ${e.color}`}>
                <div className="mb-2 flex items-center gap-2">
                  <e.icon className="h-5 w-5" />
                  <h3 className="font-semibold text-white">{e.name}</h3>
                </div>
                <p className="text-xs font-medium uppercase tracking-wider opacity-80">{e.role}</p>
                <p className="mt-2 text-sm text-slate-300">{e.detail}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Pipeline */}
        <section className="mb-16">
          <h2 className="text-xl font-semibold text-white">End-to-end process</h2>
          <p className="mt-2 text-sm text-slate-400">
            How a Finnexus change moves from detection to close.
          </p>
          <div className="mt-8 space-y-4">
            {PIPELINE.map((s) => (
              <div
                key={s.n}
                className="flex gap-4 rounded-2xl border border-slate-800 bg-[#0a101c] p-5"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cyan-500/15 font-mono text-sm font-bold text-cyan-400">
                  {s.n}
                </span>
                <div>
                  <h3 className="font-medium text-white">{s.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-slate-400">{s.text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Visual flow */}
        <section className="mb-16 rounded-2xl border border-slate-800 bg-[#0a101c] p-6 sm:p-8">
          <h2 className="text-xl font-semibold text-white">Pipeline diagram</h2>
          <pre className="mt-6 overflow-x-auto rounded-xl border border-slate-800 bg-[#060a12] p-4 font-mono text-[10px] leading-relaxed text-slate-300 sm:text-xs">
{`┌─────────────────────────────────────────────────────────────┐
│  FINNEXUS  (Averok-svg/finnexus)  — product under repair    │
└───────────────────────────┬─────────────────────────────────┘
                            │ new commits / diffs
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  CODEBOSS  (monitor on Vercel)                              │
│  • Fetch real git patches                                   │
│  • Diff scan: secrets, auth, RLS, eval, XSS, CORS…          │
│  • Open GitHub issues  [codeboss]  on Finnexus              │
└───────────────────────────┬─────────────────────────────────┘
                            │ issue open
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  CLAUDE CODE  (Tier 1)                                      │
│  • git show · genuine vs false positive                     │
│  • Fix Finnexus code · comment on issue                     │
│  • Does NOT close yet                                       │
└───────────────────────────┬─────────────────────────────────┘
                            │ fix ready
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  CODEBOSS MASTER  (Tier 3 QA · Gemini)                      │
│  • Review Finnexus diff + Claude resolution                 │
│  • If sound, comment exactly:                               │
│    REVIEWED AND FINAL APPROVED BY CODEBOSS MASTER           │
│  • Never closes · never removes labels                      │
└───────────────────────────┬─────────────────────────────────┘
                            │ Master line present
                            ▼
┌─────────────────────────────────────────────────────────────┐
│  CLAUDE CODE  closes the Finnexus issue                     │
│  (Grok/Perplexity = optional insight, NOT a close gate)     │
└─────────────────────────────────────────────────────────────┘`}
          </pre>
        </section>

        {/* Close policy */}
        <section className="mb-16 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-6">
          <h2 className="text-lg font-semibold text-white">Close policy (locked)</h2>
          <ul className="mt-4 space-y-2 text-sm text-slate-300">
            <li className="flex gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
              Claude does not close after a fix alone
            </li>
            <li className="flex gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
              Close requires issue comment:{" "}
              <code className="text-amber-200">REVIEWED AND FINAL APPROVED BY CODEBOSS MASTER</code>
            </li>
            <li className="flex gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
              CodeBoss Master never closes issues and never removes labels
            </li>
            <li className="flex gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
              Grok / Perplexity may add threat insight but are not required to close
            </li>
          </ul>
        </section>

        {/* Features */}
        <section className="mb-16">
          <h2 className="text-xl font-semibold text-white">CodeBoss capabilities</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="rounded-2xl border border-slate-800 bg-[#0a101c] p-5"
              >
                <f.icon className="mb-3 h-5 w-5 text-cyan-400" />
                <h3 className="text-sm font-semibold text-white">{f.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-400">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Cost */}
        <section className="mb-16 grid gap-4 sm:grid-cols-3">
          {[
            { t: "CodeBoss scan + UI", d: "Vercel Hobby · free" },
            { t: "GitHub Issues bridge", d: "Free for normal use" },
            { t: "Claude + Master AI", d: "Existing subscriptions" },
          ].map((x) => (
            <div
              key={x.t}
              className="rounded-xl border border-slate-800 bg-[#0a101c] p-4 text-center"
            >
              <p className="text-sm font-medium text-white">{x.t}</p>
              <p className="mt-1 text-xs text-emerald-400">{x.d}</p>
            </div>
          ))}
        </section>

        <section className="rounded-2xl border border-cyan-500/30 bg-gradient-to-r from-indigo-600/20 via-cyan-600/10 to-transparent p-10 text-center">
          <h2 className="text-2xl font-bold text-white">Open the Finnexus command center</h2>
          <p className="mx-auto mt-3 max-w-lg text-sm text-slate-300">
            Scan Finnexus diffs, open codeboss issues, and follow Claude → CodeBoss Master → close.
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-8 py-3 text-sm font-bold text-slate-900 hover:bg-cyan-50"
          >
            Go to CodeBoss Dashboard
            <ArrowRight className="h-4 w-4" />
          </Link>
          <p className="mt-4 text-[11px] text-slate-500">
            Dashboard <span className="font-mono text-slate-400">/</span> · This page{" "}
            <span className="font-mono text-slate-400">/about</span>
          </p>
        </section>
      </main>

      <footer className="border-t border-slate-800 py-8 text-center text-[11px] text-slate-600">
        CodeBoss · Finnexus diff review · CodeBoss Master QA gate · Single approval close policy
      </footer>
    </div>
  );
}
