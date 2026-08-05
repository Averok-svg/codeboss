"use client";

import Link from "next/link";
import {
  Bot,
  Shield,
  Server,
  Github,
  Zap,
  Lock,
  Activity,
  ArrowRight,
  CheckCircle2,
  GitBranch,
  MessageSquare,
  Radar,
  ExternalLink,
  Clock,
} from "lucide-react";

const PIPELINE = [
  {
    n: "1",
    title: "CodeBoss detects",
    text: "Scans Averok-svg/finnexus commits. Flags security/quality signals. Critical & High auto-open GitHub issues labeled codeboss + awaiting-grok-review.",
  },
  {
    n: "2",
    title: "Claude Code fixes",
    text: "Reads open codeboss issues (via CLAUDE.md). Verifies with git show, comments analysis, implements real fixes. Does not close the issue.",
  },
  {
    n: "3",
    title: "CodeBoss Master reviews",
    text: "Master app (Google AI Studio / Vercel) auto-checks open issues every ~10 minutes and posts genuineness + resolution comments on GitHub. If OK, posts: REVIEWED AND FINAL APPROVED BY CODEBOSS MASTER.",
  },
  {
    n: "4",
    title: "Grok final gate",
    text: "Human/Grok reviews the thread. Comments exactly APPROVED only when satisfied.",
  },
  {
    n: "5",
    title: "Claude closes",
    text: "Claude closes the issue only when BOTH phrases exist on the issue: Master approval line + APPROVED.",
  },
];

const FEATURES = [
  {
    icon: Radar,
    title: "Live SOC dashboard",
    desc: "Cyber-style UI: System Safe / Scanning / Threats Detected badges, animated graphs, agent workstations, slow-scrolling discussion from real scan data.",
  },
  {
    icon: Shield,
    title: "Strict multi-reviewer gate",
    desc: "No issue closes on Claude alone. Requires CodeBoss Master review comment and Grok APPROVED before close.",
  },
  {
    icon: MessageSquare,
    title: "GitHub as the board",
    desc: "Issues labeled codeboss are the single source of truth. Discussion, fixes, and approvals all live on the issue thread.",
  },
  {
    icon: Activity,
    title: "KPIs & charts",
    desc: "Critical, High, Findings, Open Issues, Commits, auto-created count, live signal charts, backend activity log.",
  },
  {
    icon: Lock,
    title: "Private repo safe",
    desc: "GitHub PAT only in Vercel env. Monitor stays free: rule-based analysis, no extra LLM bill on CodeBoss itself.",
  },
  {
    icon: Clock,
    title: "Master auto-loop",
    desc: "CodeBoss Master runs startAutoReviewLoop on boot and reviews Finnexus codeboss issues on a timer — no manual copy-paste of comments.",
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
              <p className="text-[10px] text-slate-500">About · process & architecture</p>
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
        <section className="mb-14 text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">
            Live Cybersecurity SOC · Software Team Monitor
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            What CodeBoss does
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-slate-400">
            The product we are protecting and improving is <strong className="text-white">Finnexus</strong>
            (GitHub <code className="text-cyan-300">Averok-svg/finnexus</code>). CodeBoss is the
            monitor and code-review layer for Finnexus — it reads Finnexus commit diffs, flags problems
            in Finnexus code, opens issues on the Finnexus repo, and helps Claude Code, CodeBoss Master,
            and Grok fix and approve work <strong className="text-slate-200">on Finnexus only</strong>.
            Claude is a tool in this pipeline; Finnexus is the application.
          </p>
          <p className="mt-3 text-xs text-slate-500">
            Last process overhaul documented: multi-reviewer gate + Master auto GitHub comments
            (Aug 2026).
          </p>
        </section>

        {/* Pipeline */}
        <section className="mb-16">
          <h2 className="text-xl font-semibold text-white">End-to-end process</h2>
          <p className="mt-2 text-sm text-slate-400">
            This is the live operating model — not a design mock.
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

        {/* Systems map */}
        <section className="mb-16 rounded-2xl border border-slate-800 bg-[#0a101c] p-8">
          <h2 className="text-xl font-semibold text-white">Systems involved</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-5">
              <GitBranch className="mb-2 h-5 w-5 text-cyan-400" />
              <h3 className="font-medium text-white">Finnexus</h3>
              <p className="mt-2 text-sm text-slate-400">
                Product app repo <code className="text-cyan-300">Averok-svg/finnexus</code>. Where
                code lives, Claude Code runs, and GitHub issues are opened/closed.
              </p>
            </div>
            <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-5">
              <Bot className="mb-2 h-5 w-5 text-indigo-400" />
              <h3 className="font-medium text-white">CodeBoss (this app)</h3>
              <p className="mt-2 text-sm text-slate-400">
                Next.js monitor on Vercel. Reads commits via GitHub API, rule-based findings, SOC
                UI, auto-creates issues. Free to run (no LLM API on the monitor).
              </p>
            </div>
            <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-5">
              <Server className="mb-2 h-5 w-5 text-violet-400" />
              <h3 className="font-medium text-white">CodeBoss Master</h3>
              <p className="mt-2 text-sm text-slate-400">
                Separate app (Google AI Studio origin, repo{" "}
                <code className="text-violet-300">Averok-svg/CodeBoss-Master</code>, Vercel +
                Supabase). Runs an auto-review loop that comments on Finnexus{" "}
                <code className="text-slate-300">codeboss</code> issues. Approval line:{" "}
                <code className="text-violet-200">REVIEWED AND FINAL APPROVED BY CODEBOSS MASTER</code>.
              </p>
            </div>
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5">
              <Zap className="mb-2 h-5 w-5 text-emerald-400" />
              <h3 className="font-medium text-white">Claude Code + Grok</h3>
              <p className="mt-2 text-sm text-slate-400">
                Claude implements fixes under <code className="text-emerald-300">CLAUDE.md</code>.
                Grok is the final human/AI gate and must comment{" "}
                <code className="text-emerald-200">APPROVED</code> before Claude may close.
              </p>
            </div>
          </div>
        </section>

        {/* Close rules */}
        <section className="mb-16 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-6">
          <h2 className="text-lg font-semibold text-white">Close rules (strict)</h2>
          <ul className="mt-4 space-y-2 text-sm text-slate-300">
            <li className="flex gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
              Claude must not close after fix alone
            </li>
            <li className="flex gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
              Issue must contain Master line: REVIEWED AND FINAL APPROVED BY CODEBOSS MASTER
            </li>
            <li className="flex gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
              Issue must contain Grok line: APPROVED
            </li>
            <li className="flex gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
              Labels: codeboss + awaiting-grok-review until closed
            </li>
          </ul>
        </section>

        {/* Features */}
        <section className="mb-16">
          <h2 className="text-xl font-semibold text-white">Dashboard capabilities</h2>
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
            { t: "CodeBoss UI + scan", d: "Vercel Hobby · free" },
            { t: "GitHub Issues bridge", d: "Free for normal use" },
            { t: "Claude / Master AI", d: "Existing subscriptions" },
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
          <h2 className="text-2xl font-bold text-white">Open the live command center</h2>
          <p className="mx-auto mt-3 max-w-lg text-sm text-slate-300">
            Scan Finnexus, watch agents react, and follow issues through Claude → Master → Grok →
            close.
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
        CodeBoss · Finnexus monitor · Master auto-review · Grok approval gate · Updated when process
        overhauls land
      </footer>
    </div>
  );
}
