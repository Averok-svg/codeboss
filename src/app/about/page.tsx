"use client";

import Link from "next/link";
import {
  Bot,
  Shield,
  Server,
  Code2,
  Search,
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
} from "lucide-react";

const FEATURES = [
  {
    icon: Radar,
    title: "Live SOC Command Center",
    desc: "Cybersecurity-style dashboard with blinking system status, scan progress 0–100%, animated graphs, and a software team working on laptop screens in real time.",
  },
  {
    icon: Server,
    title: "Multi-Agent Team",
    desc: "System Architect, Senior Developer, Aggressive Tester, and Researcher discuss every scan — streaming messages built from your real commits, findings, and GitHub issues.",
  },
  {
    icon: Shield,
    title: "Automated Threat Findings",
    desc: "Rule-based scan of commit messages for secrets, auth, RLS, quality debt, and architecture risks. Critical and High findings auto-open labeled GitHub issues.",
  },
  {
    icon: MessageSquare,
    title: "Claude Code Collaboration",
    desc: "Issues become the discussion board. Claude Code verifies with git show, comments analysis, fixes genuine problems or closes false positives — using your existing subscription.",
  },
  {
    icon: Activity,
    title: "Live Graphs & KPIs",
    desc: "Critical / High / Findings / Open Issues / Commits counters, live signal intensity charts, repo watch pressure, and backend activity logs after every scan.",
  },
  {
    icon: Lock,
    title: "Private Repo Safe",
    desc: "Works with private GitHub repositories via a Personal Access Token. Token stays in Vercel environment variables — never in frontend code.",
  },
];

const STEPS = [
  {
    n: "01",
    title: "Watch the app repo",
    text: "CodeBoss connects to your private GitHub project (e.g. Averok-svg/finnexus) and reads recent commits on a schedule or when you hit Scan Now.",
  },
  {
    n: "02",
    title: "Agents analyze",
    text: "Architect, Developer, Tester, and Researcher roles run a structured pass. The UI shows progress, moods (reviewing / thinking / confused / excited), and a slow-scrolling discussion feed.",
  },
  {
    n: "03",
    title: "Issues auto-created",
    text: "Critical and High signals become GitHub issues labeled codeboss, with a discussion protocol for Claude Code.",
  },
  {
    n: "04",
    title: "Claude Code closes the loop",
    text: "In the original app repo, CLAUDE.md instructs Claude to check those issues, verify diffs, comment, fix or dismiss, then close — full autonomy with optional human interrupt.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#060a12] text-slate-100">
      {/* Nav */}
      <header className="border-b border-slate-800/80 bg-[#080d18]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-400">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">CodeBoss</p>
              <p className="text-[10px] text-slate-500">About the system</p>
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
        <section className="mb-16 text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">
            Live Cybersecurity SOC · Software Team Monitor
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
            What is CodeBoss?
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-slate-400">
            CodeBoss is a free, automated engineering command center. It watches a private
            GitHub app (like Finnexus), runs multi-agent style reviews, surfaces security and
            quality signals, opens GitHub issues, and pairs with Claude Code so the original
            app keeps getting fixed — without extra AI API spend on the monitor itself.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-600 to-cyan-600 px-6 py-3 text-sm font-semibold text-white shadow-[0_0_30px_rgba(56,189,248,0.25)]"
            >
              Launch CodeBoss Dashboard
              <ExternalLink className="h-4 w-4" />
            </Link>
            <a
              href="https://github.com/Averok-svg/finnexus"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-slate-700 px-6 py-3 text-sm text-slate-300 hover:border-slate-500"
            >
              <Github className="h-4 w-4" />
              Monitored app: finnexus
            </a>
          </div>
        </section>

        {/* What it monitors */}
        <section className="mb-16 rounded-2xl border border-slate-800 bg-[#0a101c] p-8">
          <h2 className="text-xl font-semibold text-white">Tied to the real project</h2>
          <p className="mt-2 text-sm text-slate-400">
            CodeBoss is not a generic demo. It is wired to the app you are actively building.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5">
              <GitBranch className="mb-3 h-5 w-5 text-cyan-400" />
              <h3 className="font-medium text-white">Finnexus (original app)</h3>
              <p className="mt-2 text-sm text-slate-400">
                Private repo <code className="text-cyan-300">Averok-svg/finnexus</code> — Next.js,
                TypeScript, Supabase, Vercel. Commits, auth flows, and product work land here.
                Claude Code runs in this repo to implement fixes.
              </p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5">
              <Bot className="mb-3 h-5 w-5 text-indigo-400" />
              <h3 className="font-medium text-white">CodeBoss (this monitor)</h3>
              <p className="mt-2 text-sm text-slate-400">
                Separate Next.js app on Vercel. Uses GitHub API with a PAT to read commits and
                create issues labeled <code className="text-indigo-300">codeboss</code>. Dashboard
                is the SOC UI you open in the browser.
              </p>
            </div>
          </div>
        </section>

        {/* Features / graphs */}
        <section className="mb-16">
          <h2 className="text-xl font-semibold text-white">Dashboard: graphs, agents & signals</h2>
          <p className="mt-2 text-sm text-slate-400">
            Everything on the live screen maps to real scan data from Finnexus.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="rounded-2xl border border-slate-800 bg-[#0a101c] p-5 transition hover:border-slate-700"
              >
                <f.icon className="mb-3 h-5 w-5 text-cyan-400" />
                <h3 className="text-sm font-semibold text-white">{f.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-400">{f.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-2xl border border-slate-800 bg-[#0a101c] p-6">
            <h3 className="text-sm font-semibold text-white">KPI & chart strip</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-400">
              <li className="flex gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                Counters: Critical, High, Findings, Open Issues, Commits, Auto-created issues
              </li>
              <li className="flex gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                Animated area charts: Live Signal Intensity & Repo Watch Pressure
              </li>
              <li className="flex gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                Agent workstations with laptop screens, matrix rain, moods (reviewing / thinking /
                confused / excited)
              </li>
              <li className="flex gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                Status badges: System Safe, Elevated Risk, Threats Detected, System Scanning
              </li>
            </ul>
          </div>
        </section>

        {/* How setup works */}
        <section className="mb-16">
          <h2 className="text-xl font-semibold text-white">How the setup works</h2>
          <p className="mt-2 text-sm text-slate-400">
            Designed to stay free: GitHub API + Vercel hobby + your existing Claude subscription.
          </p>
          <div className="mt-8 space-y-4">
            {STEPS.map((s) => (
              <div
                key={s.n}
                className="flex gap-4 rounded-2xl border border-slate-800 bg-[#0a101c] p-5"
              >
                <span className="font-mono text-lg font-bold text-cyan-500/80">{s.n}</span>
                <div>
                  <h3 className="font-medium text-white">{s.title}</h3>
                  <p className="mt-1 text-sm text-slate-400">{s.text}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-5 text-sm text-slate-300">
            <p className="font-medium text-indigo-300">Environment on Vercel</p>
            <p className="mt-2 font-mono text-xs text-slate-400">
              GITHUB_TOKEN=ghp_… · GITHUB_REPO=Averok-svg/finnexus
            </p>
            <p className="mt-2 text-xs text-slate-500">
              No Anthropic API key required for CodeBoss itself — analysis is rule-based; intelligence
              for fixes comes from Claude Code in the Finnexus project.
            </p>
          </div>
        </section>

        {/* Connection diagram style */}
        <section className="mb-16 rounded-2xl border border-slate-800 bg-[#0a101c] p-8">
          <h2 className="text-xl font-semibold text-white">How it connects to the original app</h2>
          <div className="mt-6 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex-1 rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-4 text-center">
              <p className="text-xs uppercase tracking-wider text-cyan-400">App</p>
              <p className="mt-1 font-semibold text-white">Finnexus</p>
              <p className="mt-1 text-[11px] text-slate-500">GitHub + Supabase + Vercel</p>
            </div>
            <ArrowRight className="mx-auto hidden h-5 w-5 text-slate-600 sm:block" />
            <div className="flex-1 rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-4 text-center">
              <p className="text-xs uppercase tracking-wider text-indigo-400">Monitor</p>
              <p className="mt-1 font-semibold text-white">CodeBoss</p>
              <p className="mt-1 text-[11px] text-slate-500">Reads commits · writes issues</p>
            </div>
            <ArrowRight className="mx-auto hidden h-5 w-5 text-slate-600 sm:block" />
            <div className="flex-1 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-center">
              <p className="text-xs uppercase tracking-wider text-emerald-400">Fixer</p>
              <p className="mt-1 font-semibold text-white">Claude Code</p>
              <p className="mt-1 text-[11px] text-slate-500">Discusses & patches Finnexus</p>
            </div>
          </div>
          <p className="mt-6 text-sm leading-relaxed text-slate-400">
            The bridge is GitHub Issues with the label <strong className="text-slate-200">codeboss</strong>.
            CodeBoss creates them; Claude Code (guided by <code className="text-emerald-300">CLAUDE.md</code> in
            Finnexus) owns verification and fixes. You can interrupt anytime. False positives are closed
            with evidence after <code className="text-slate-300">git show</code> on the real diff.
          </p>
        </section>

        {/* CodeBoss Master */}
        <section className="mb-16 rounded-2xl border border-violet-500/25 bg-gradient-to-br from-violet-500/10 to-transparent p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-violet-300">
                Companion system
              </p>
              <h2 className="mt-1 text-xl font-semibold text-white">CodeBoss Master</h2>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-300">
                <strong className="text-white">CodeBoss Master</strong> is the Master Tracker prototype
                built in <strong className="text-violet-200">Google AI Studio</strong>. It inspired the
                SOC look and feel — live latency/quality trends, dual-monitoring style agent cards, and
                a denser “mission control” layout. CodeBoss (this Vercel app) is the production-facing
                monitor connected to Finnexus; CodeBoss Master is the design / tracking lab where the
                visual language and multi-engine monitoring ideas were explored.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-slate-400">
                <li className="flex gap-2">
                  <Zap className="mt-0.5 h-4 w-4 shrink-0 text-violet-400" />
                  Visual reference for graphs, agent cards, and continuous monitoring chrome
                </li>
                <li className="flex gap-2">
                  <Zap className="mt-0.5 h-4 w-4 shrink-0 text-violet-400" />
                  Concept for dual AI monitoring (e.g. Claude + research/QA style engines)
                </li>
                <li className="flex gap-2">
                  <Zap className="mt-0.5 h-4 w-4 shrink-0 text-violet-400" />
                  CodeBoss on Vercel implements the free GitHub + Claude Code operational loop
                </li>
              </ul>
            </div>
          </div>
          <p className="mt-6 text-xs text-slate-500">
            Google AI Studio app used as the Master Tracker design source during build-out of this
            SOC dashboard.
          </p>
        </section>

        {/* Cost */}
        <section className="mb-16 grid gap-4 sm:grid-cols-3">
          {[
            { t: "CodeBoss UI", d: "Vercel Hobby — free" },
            { t: "GitHub API & Issues", d: "Free for normal use" },
            { t: "Code fixes", d: "Existing Claude subscription" },
          ].map((x) => (
            <div key={x.t} className="rounded-xl border border-slate-800 bg-[#0a101c] p-4 text-center">
              <p className="text-sm font-medium text-white">{x.t}</p>
              <p className="mt-1 text-xs text-emerald-400">{x.d}</p>
            </div>
          ))}
        </section>

        {/* Bottom CTA */}
        <section className="rounded-2xl border border-cyan-500/30 bg-gradient-to-r from-indigo-600/20 via-cyan-600/10 to-transparent p-10 text-center">
          <h2 className="text-2xl font-bold text-white">Open the live command center</h2>
          <p className="mx-auto mt-3 max-w-lg text-sm text-slate-300">
            Scan Finnexus, watch the software team react, and send Critical/High work to Claude Code
            through GitHub issues.
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-8 py-3 text-sm font-bold text-slate-900 hover:bg-cyan-50"
          >
            Go to CodeBoss Dashboard
            <ArrowRight className="h-4 w-4" />
          </Link>
          <p className="mt-4 text-[11px] text-slate-500">
            Dashboard route: <span className="font-mono text-slate-400">/</span> · This page:{" "}
            <span className="font-mono text-slate-400">/about</span>
          </p>
        </section>
      </main>

      <footer className="border-t border-slate-800 py-8 text-center text-[11px] text-slate-600">
        CodeBoss · Live Cybersecurity SOC & Software Team Monitor · Built for Finnexus · Master Tracker
        concepts from Google AI Studio
      </footer>
    </div>
  );
}
