"use client";

import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  RefreshCw,
  ExternalLink,
  Shield,
  Bot,
  Search,
  Code2,
  Server,
  CheckCircle2,
  Activity,
  Radar,
  Lock,
  Eye,
} from "lucide-react";
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  YAxis,
} from "recharts";

interface Commit {
  sha: string;
  message: string;
  author: string;
  date: string;
  url: string;
}

interface Finding {
  id: string;
  title: string;
  description: string;
  severity: "critical" | "high" | "medium" | "low";
  category: string;
  source?: string;
}

interface Issue {
  number: number;
  title: string;
  url: string;
  createdAt: string;
}

interface ActivityItem {
  time: string;
  message: string;
  type: "info" | "success" | "warning";
}

type AgentRole = "architect" | "senior-dev" | "tester" | "researcher" | "system";

interface AgentMessage {
  id: string;
  role: AgentRole;
  content: string;
  timestamp: string;
}

const roleConfig: Record<
  AgentRole,
  { label: string; icon: React.ElementType; color: string; bg: string; accent: string }
> = {
  architect: { label: "System Architect", icon: Server, color: "text-indigo-400", bg: "bg-indigo-500/15", accent: "#818cf8" },
  "senior-dev": { label: "Senior Developer", icon: Code2, color: "text-emerald-400", bg: "bg-emerald-500/15", accent: "#34d399" },
  tester: { label: "Aggressive Tester", icon: Shield, color: "text-red-400", bg: "bg-red-500/15", accent: "#f87171" },
  researcher: { label: "Researcher", icon: Search, color: "text-cyan-400", bg: "bg-cyan-500/15", accent: "#22d3ee" },
  system: { label: "CodeBoss", icon: Bot, color: "text-slate-400", bg: "bg-slate-500/15", accent: "#94a3b8" },
};

const SCAN_STAGES = [
  { pct: 10, label: "Connecting to private repo..." },
  { pct: 22, label: "Fetching recent commits..." },
  { pct: 38, label: "System Architect reviewing architecture..." },
  { pct: 52, label: "Senior Developer scanning code quality..." },
  { pct: 68, label: "Aggressive Tester running chaos checks..." },
  { pct: 82, label: "Researcher checking best practices..." },
  { pct: 94, label: "Creating GitHub issues for Critical/High..." },
  { pct: 100, label: "Scan complete" },
];

function buildAgentDiscussion(
  findings: Finding[],
  commits: Commit[],
  issues: Issue[]
): AgentMessage[] {
  const now = Date.now();
  const msgs: AgentMessage[] = [];
  let i = 0;
  const push = (role: AgentRole, content: string, agoSec: number) => {
    msgs.push({
      id: `msg-${i++}`,
      role,
      content,
      timestamp: new Date(now - agoSec * 1000).toISOString(),
    });
  };

  const critical = findings.filter((f) => f.severity === "critical");
  const high = findings.filter((f) => f.severity === "high");
  const medium = findings.filter((f) => f.severity === "medium" || f.severity === "low");
  const latest = commits[0];

  push(
    "system",
    `Scan finished. Watched ${commits.length} recent commit${commits.length === 1 ? "" : "s"}. Found ${findings.length} signal${findings.length === 1 ? "" : "s"} (${critical.length} critical, ${high.length} high).`,
    95
  );

  if (latest) {
    push(
      "architect",
      `Latest commit ${latest.sha} by ${latest.author}: "${latest.message}". Checking auth boundaries, data access, and service-layer consistency.`,
      85
    );
  }

  if (critical.length > 0) {
    const f = critical[0];
    push(
      "tester",
      `CRITICAL: "${f.title}". ${f.description.slice(0, 160)}${f.description.length > 160 ? "…" : ""} Treating as break-the-system until diff is proven clean.`,
      75
    );
    push(
      "senior-dev",
      `Never trust commit messages alone. Claude Code must git show the hash, scan for secret-shaped strings, then decide fix vs false positive.`,
      65
    );
  }

  if (high.length > 0) {
    const titles = high.map((f) => f.title).slice(0, 3).join("; ");
    push(
      "architect",
      `High-severity needs design attention: ${titles}. Fix boundaries before adding surface area.`,
      55
    );
  }

  if (medium.length > 0) {
    push(
      "researcher",
      `${medium.length} medium/low signal(s) noted (TODOs, type escapes, debug leftovers). Not blocking, but debt accumulates.`,
      45
    );
  }

  push(
    "researcher",
    "Best practice for Next.js + Supabase: RLS on every table, no direct client writes to sensitive tables, rate limits on public routes, secrets only in server env.",
    35
  );

  if (issues.length > 0) {
    const list = issues.slice(0, 4).map((iss) => `#${iss.number}`).join(", ");
    push(
      "system",
      `${issues.length} open codeboss issue(s): ${list}${issues.length > 4 ? "…" : ""}. Claude Code should verify, comment, fix or close.`,
      25
    );
    push(
      "senior-dev",
      "Order: Critical → High. Comment analysis, implement if genuine, run tsc/lint/tests, summarize, close.",
      15
    );
  } else if (findings.length === 0) {
    push(
      "architect",
      "No pattern hits on recent commits. Architecture health stable for this pass. Background watch continues.",
      20
    );
  } else {
    push(
      "tester",
      "Findings exist but no open codeboss issues (or already closed). Re-scan after new commits.",
      18
    );
  }

  push(
    "system",
    "Agents stand by. Interrupt anytime. Use Claude Code on open codeboss issues for real discussion + fixes.",
    5
  );

  return msgs;
}

function fakeChartData(seed: number) {
  return Array.from({ length: 16 }, (_, i) => ({
    t: i,
    v: 20 + Math.sin(i / 2 + seed) * 18 + (i % 3) * 4 + seed * 3,
  }));
}

function MatrixRain() {
  const cols = useMemo(
    () =>
      Array.from({ length: 8 }, (_, i) => ({
        left: `${8 + i * 12}%`,
        delay: `${i * 0.35}s`,
        text: "01SCAN"[i % 6] + "X9F2A7E1B0C4D8",
      })),
    []
  );
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-40">
      {cols.map((c, i) => (
        <span
          key={i}
          className="matrix-col absolute top-0"
          style={{ left: c.left, animationDelay: c.delay }}
        >
          {c.text}
        </span>
      ))}
    </div>
  );
}

function AgentWorkstation({
  role,
  status,
  metric,
  metricLabel,
  mood,
}: {
  role: AgentRole;
  status: "idle" | "working" | "alert";
  metric: number | string;
  metricLabel: string;
  mood: "reviewing" | "thinking" | "confused" | "excited" | "calm";
}) {
  const c = roleConfig[role];
  const Icon = c.icon;
  const lines = useMemo(
    () => Array.from({ length: 6 }, (_, i) => 25 + ((i * 19 + role.length * 5) % 60)),
    [role]
  );

  const moodMeta: Record<string, { emoji: string; label: string; color: string }> = {
    reviewing: { emoji: "🧐", label: "Reviewing code", color: "text-indigo-300" },
    thinking: { emoji: "🤔", label: "Thinking hard", color: "text-amber-300" },
    confused: { emoji: "😕", label: "Checking anomaly", color: "text-orange-300" },
    excited: { emoji: "🤩", label: "Clean pass!", color: "text-emerald-300" },
    calm: { emoji: "😎", label: "Standing by", color: "text-slate-400" },
  };
  const m = moodMeta[mood];

  return (
    <div className="flex flex-col rounded-2xl border border-slate-700/70 bg-[#0a101c] p-4 shadow-[0_0_30px_rgba(0,0,0,0.25)] anim-glow-border min-h-[200px]">
      {/* Person header */}
      <div className="mb-3 flex items-start gap-3">
        <div className="relative">
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-2xl text-2xl ${c.bg} ring-1 ring-white/10`}
          >
            {m.emoji}
          </div>
          <div className={`absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full ${c.bg} ring-2 ring-[#0a101c]`}>
            <Icon className={`h-3 w-3 ${c.color}`} />
          </div>
        </div>
        <div className="min-w-0 flex-1 pt-0.5">
          <p className="text-sm font-semibold text-white leading-tight">{c.label}</p>
          <p className={`mt-0.5 text-[11px] font-medium ${m.color}`}>{m.label}</p>
          <p className="mt-1 flex items-center gap-1.5 text-[10px] text-slate-500">
            {status === "working" && (
              <>
                <span className="typing-dots text-cyan-400">
                  <span /><span /><span />
                </span>
                working on laptop
              </>
            )}
            {status === "alert" && <span className="text-red-400">focused on threat</span>}
            {status === "idle" && <span className="text-emerald-400/70">idle monitor</span>}
          </p>
        </div>
        <div className="text-right shrink-0">
          <p className={`text-xl font-bold tabular-nums ${c.color}`}>{metric}</p>
          <p className="text-[10px] text-slate-500">{metricLabel}</p>
        </div>
      </div>

      {/* Laptop screen */}
      <div className="agent-screen anim-flicker relative mt-auto h-24 rounded-xl border border-slate-600/80 p-2.5">
        <div className="scanline-overlay" />
        <MatrixRain />
        {/* code-ish lines */}
        <div className="relative z-10 mb-1 space-y-1">
          <div className="h-1 w-[70%] rounded bg-slate-600/80" />
          <div className="h-1 w-[45%] rounded bg-slate-600/50" />
          <div className="h-1 w-[55%] rounded" style={{ background: c.accent + "66" }} />
        </div>
        <div className="relative z-10 flex h-10 items-end gap-1 px-0.5">
          {lines.map((h, i) => (
            <div
              key={i}
              className="flex-1 rounded-t-sm"
              style={{
                height: `${h}%`,
                background: `linear-gradient(to top, ${c.accent}44, ${c.accent})`,
                animation: `bar-pulse ${1.1 + i * 0.12}s ease-in-out infinite`,
                animationDelay: `${i * 0.08}s`,
              }}
            />
          ))}
        </div>
        <div className="absolute bottom-1.5 left-2.5 z-10 font-mono text-[8px] text-slate-500">
          laptop · live
        </div>
        <div className="absolute bottom-1.5 right-2.5 z-10 font-mono text-[8px]" style={{ color: c.accent }}>
          {mood.toUpperCase()}
        </div>
      </div>
      {/* laptop base */}
      <div className="mx-auto mt-1 h-1.5 w-[70%] rounded-b-md bg-slate-700/80" />
      <div className="mx-auto h-1 w-[40%] rounded-b bg-slate-800" />
    </div>
  );
}

export default function DashboardPage() {
  const [connected, setConnected] = useState(false);
  const [repo, setRepo] = useState("");
  const [commits, setCommits] = useState<Commit[]>([]);
  const [findings, setFindings] = useState<Finding[]>([]);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [agentMessages, setAgentMessages] = useState<AgentMessage[]>([]);
  const [visibleCount, setVisibleCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [scanPct, setScanPct] = useState(0);
  const [scanLabel, setScanLabel] = useState("");
  const [scanDone, setScanDone] = useState(false);
  const [lastScan, setLastScan] = useState<string | null>(null);
  const [autoCreated, setAutoCreated] = useState(0);
  const [diffsLoaded, setDiffsLoaded] = useState(0);
  const [scanMode, setScanMode] = useState("");
  const [scanPulse, setScanPulse] = useState(0);
  const [nowTick, setNowTick] = useState(Date.now());
  const [streaming, setStreaming] = useState(false);
  const [clock, setClock] = useState("");
  const feedRef = useRef<HTMLDivElement>(null);
  const streamRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const fullMessagesRef = useRef<AgentMessage[]>([]);

  const chartA = useMemo(() => {
    const base = fakeChartData(1 + (findings.length % 5) * 0.15);
    return base.map((d, i) => ({ ...d, v: d.v + (scanPulse % 7) * 0.3 * ((i % 3) - 1) }));
  }, [findings.length, scanPulse]);
  const chartB = useMemo(() => {
    const base = fakeChartData(2.4 + (diffsLoaded % 4) * 0.1);
    return base.map((d, i) => ({ ...d, v: d.v + (scanPulse % 5) * 0.4 * ((i % 2) - 0.5) }));
  }, [diffsLoaded, scanPulse]);

  useEffect(() => {
    const tick = () => {
      setClock(
        new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
      setNowTick(Date.now());
      setScanPulse((p) => p + 1);
    };
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, []);

  const stopStream = () => {
    if (streamRef.current) {
      clearInterval(streamRef.current);
      streamRef.current = null;
    }
    setStreaming(false);
  };

  const startMessageStream = (msgs: AgentMessage[]) => {
    stopStream();
    fullMessagesRef.current = msgs;
    setAgentMessages([]);
    setVisibleCount(0);
    setStreaming(true);
    let idx = 0;
    streamRef.current = setInterval(() => {
      idx += 1;
      setVisibleCount(idx);
      setAgentMessages(msgs.slice(0, idx));
      requestAnimationFrame(() => {
        if (feedRef.current) {
          feedRef.current.scrollTo({
            top: feedRef.current.scrollHeight,
            behavior: "smooth",
          });
        }
      });
      if (idx >= msgs.length) stopStream();
    }, 2200);
  };

  const refresh = useCallback(async (opts?: { stream?: boolean }) => {
    try {
      const gh = await fetch("/api/github").then((r) => r.json());
      let nextCommits: Commit[] = [];
      if (gh.connected) {
        setConnected(true);
        setRepo(gh.repo || "");
        nextCommits = gh.commits || [];
        setCommits(nextCommits);
      } else {
        setConnected(false);
      }

      const an = await fetch("/api/analyze").then((r) => r.json());
      const nextFindings: Finding[] = an.findings || [];
      let nextIssues: Issue[] = an.issues || [];
      setFindings(nextFindings);
      setActivity(an.activity || []);
      setAutoCreated(an.autoCreated || 0);
      setDiffsLoaded(an.diffsLoaded || 0);
      setScanMode(an.mode || "");
      if (an.scannedAt) setLastScan(an.scannedAt);
      if (!an.issues) {
        const iss = await fetch("/api/issues").then((r) => r.json());
        nextIssues = iss.issues || [];
      }
      setIssues(nextIssues);

      const discussion = buildAgentDiscussion(nextFindings, nextCommits, nextIssues);
      if (opts?.stream) startMessageStream(discussion);
      else {
        stopStream();
        fullMessagesRef.current = discussion;
        setAgentMessages(discussion);
        setVisibleCount(discussion.length);
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh({ stream: false });
    const interval = setInterval(() => refresh({ stream: false }), 60000);
    return () => {
      clearInterval(interval);
      stopStream();
    };
  }, [refresh]);

  async function runScan() {
    if (scanning) return;
    setScanning(true);
    setScanDone(false);
    setScanPct(0);
    setScanLabel(SCAN_STAGES[0].label);
    stopStream();
    setAgentMessages([]);

    let stageIdx = 0;
    const progressTimer = setInterval(() => {
      stageIdx = Math.min(stageIdx + 1, SCAN_STAGES.length - 1);
      setScanPct(SCAN_STAGES[stageIdx].pct);
      setScanLabel(SCAN_STAGES[stageIdx].label);
      if (stageIdx >= SCAN_STAGES.length - 1) clearInterval(progressTimer);
    }, 480);

    try {
      await refresh({ stream: true });
    } finally {
      clearInterval(progressTimer);
      setScanPct(100);
      setScanLabel("Scan complete");
      setScanDone(true);
      setTimeout(() => {
        setScanning(false);
        setScanDone(false);
      }, 1600);
    }
  }

  const criticalCount = findings.filter((f) => f.severity === "critical").length;
  const highCount = findings.filter((f) => f.severity === "high").length;
  const threatLevel = criticalCount > 0 ? "critical" : highCount > 0 ? "elevated" : "safe";
  const systemStatus =
    scanning || streaming
      ? "scanning"
      : threatLevel === "critical"
      ? "alert"
      : threatLevel === "elevated"
      ? "elevated"
      : "safe";

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#060a12]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative h-14 w-14">
            <div className="absolute inset-0 rounded-full border-2 border-cyan-500/30 anim-radar" />
            <div className="absolute inset-2 rounded-full border border-cyan-400/50" />
            <Radar className="absolute inset-0 m-auto h-5 w-5 text-cyan-400" />
          </div>
          <p className="text-sm text-slate-400">Booting command center...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#060a12] text-slate-100">
      {/* Scan overlay */}
      {scanning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-cyan-500/30 bg-[#0a101c] p-8 shadow-[0_0_40px_rgba(56,189,248,0.15)]">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative flex h-12 w-12 items-center justify-center">
                  <div className="absolute inset-0 rounded-full border border-cyan-400/40 anim-radar" />
                  <Bot className="h-6 w-6 text-cyan-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Deep Scan in Progress</p>
                  <p className="text-xs text-slate-500">Multi-agent security pass</p>
                </div>
              </div>
              {scanDone && <CheckCircle2 className="h-7 w-7 text-emerald-400" />}
            </div>
            <div className="mb-2 flex items-end justify-between">
              <p className="text-xs text-cyan-300/80">{scanLabel}</p>
              <p className="text-3xl font-bold tabular-nums text-cyan-400">{scanPct}%</p>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-cyan-400 to-emerald-400 transition-all duration-500"
                style={{ width: `${scanPct}%` }}
              />
            </div>
            <div className="mt-6 grid grid-cols-2 gap-2">
              {(["architect", "senior-dev", "tester", "researcher"] as AgentRole[]).map((role) => {
                const cfg = roleConfig[role];
                const Icon = cfg.icon;
                const active = scanPct > 20;
                return (
                  <div
                    key={role}
                    className={`flex items-center gap-2 rounded-lg border px-3 py-2 ${
                      active ? "border-slate-600 bg-slate-900/80" : "border-slate-800 opacity-40"
                    }`}
                  >
                    <Icon className={`h-3.5 w-3.5 ${cfg.color} ${active && !scanDone ? "animate-pulse" : ""}`} />
                    <span className="text-[11px] text-slate-300">{cfg.label}</span>
                  </div>
                );
              })}
            </div>
            {scanDone && (
              <p className="mt-5 text-center text-sm font-medium text-emerald-400">
                Done — agent discussion streaming below
              </p>
            )}
          </div>
        </div>
      )}

      {/* Top bar */}
      <div className="border-b border-slate-800/80 bg-[#080d18]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-6 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-400 shadow-[0_0_20px_rgba(56,189,248,0.35)]">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-base font-semibold tracking-tight text-white sm:text-lg">
                LIVE CYBERSECURITY SOC
              </h1>
              <p className="text-[11px] text-cyan-400/90">
                Software Team Monitor · <span className="font-mono text-slate-500">{clock}</span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Animated system status badges */}
            {systemStatus === "safe" && (
              <span className="anim-blink-safe rounded-full border border-emerald-500/40 bg-emerald-500/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                ● System Safe
              </span>
            )}
            {systemStatus === "elevated" && (
              <span className="anim-blink-scan rounded-full border border-amber-500/40 bg-amber-500/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-amber-400">
                ● Elevated Risk
              </span>
            )}
            {systemStatus === "alert" && (
              <span className="anim-blink-alert rounded-full border border-red-500/40 bg-red-500/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-red-400">
                ● Threats Detected
              </span>
            )}
            {systemStatus === "scanning" && (
              <span className="anim-blink-scan rounded-full border border-cyan-500/40 bg-cyan-500/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-cyan-400">
                ● System Scanning
              </span>
            )}

            {findings.length === 0 && !scanning && (
              <span className="rounded-full border border-slate-600 bg-slate-800/60 px-3 py-1 text-[11px] font-medium text-slate-400">
                No Issues Detected
              </span>
            )}

            {lastScan && (
              <span className="rounded-full border border-slate-700 bg-slate-900/60 px-3 py-1 font-mono text-[10px] text-slate-500">
                Last scan {new Date(lastScan).toLocaleTimeString()}
              </span>
            )}

            {connected ? (
              <div className="flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-400">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                {repo}
              </div>
            ) : (
              <div className="rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1.5 text-xs text-amber-400">
                Not connected
              </div>
            )}

            <button
              onClick={runScan}
              disabled={scanning}
              className="flex items-center gap-2 rounded-full bg-indigo-600 px-4 py-1.5 text-xs font-medium text-white shadow-[0_0_20px_rgba(99,102,241,0.35)] transition hover:bg-indigo-500 disabled:opacity-50"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${scanning ? "animate-spin" : ""}`} />
              Scan Now
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8">
        <div className="mb-6 animate-pulse rounded-xl border border-cyan-400/40 bg-gradient-to-r from-cyan-500/20 via-indigo-500/20 to-emerald-500/20 px-4 py-3 text-center">
          <p className="text-sm font-bold tracking-wide text-cyan-200">
            CODEBOSS LIVE · DIFF CODE REVIEW · v2026.08.05
          </p>
          <p className="mt-1 text-[11px] text-slate-300">
            If you see this banner, the new UI is deployed. Pulse &amp; health KPIs update every second.
          </p>
        </div>

        {/* Live status strip */}
        <div className="mb-4 flex flex-wrap items-center gap-2 text-[11px]">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 font-medium text-cyan-300">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-400" />
            {scanMode === "diff-code-review" ? "DIFF CODE REVIEW ON" : "MONITOR ON"}
          </span>
          <span className="rounded-full border border-slate-700 bg-slate-900/80 px-3 py-1 font-mono text-slate-400">
            pulse {scanPulse % 1000}
          </span>
          <span className="rounded-full border border-slate-700 bg-slate-900/80 px-3 py-1 text-slate-400">
            last scan{" "}
            {lastScan
              ? Math.max(0, Math.floor((nowTick - new Date(lastScan).getTime()) / 1000)) + "s ago"
              : "—"}
          </span>
          {activity[0] && (
            <span className="max-w-md truncate rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1 text-indigo-200">
              {activity[activity.length - 1]?.message || activity[0]?.message}
            </span>
          )}
        </div>

        {/* KPI + mini charts */}
        <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {[
            { label: "Critical", value: criticalCount, text: "text-red-400", border: "border-red-500/25", color: "from-red-500/20", hint: "blockers" },
            { label: "High", value: highCount, text: "text-orange-400", border: "border-orange-500/25", color: "from-orange-500/20", hint: "urgent" },
            { label: "Diff findings", value: findings.filter((f) => f.source === "diff-scan").length || findings.length, text: "text-amber-400", border: "border-amber-500/25", color: "from-amber-500/20", hint: "from patches" },
            { label: "Patches read", value: diffsLoaded || commits.length, text: "text-cyan-400", border: "border-cyan-500/25", color: "from-cyan-500/20", hint: "git diffs" },
            { label: "Open issues", value: issues.length, text: "text-indigo-400", border: "border-indigo-500/25", color: "from-indigo-500/20", hint: "on GitHub" },
            {
              label: "Health",
              value: Math.max(0, 100 - criticalCount * 25 - highCount * 12 - Math.max(0, findings.length - 1) * 3),
              text: "text-emerald-400",
              border: "border-emerald-500/25",
              color: "from-emerald-500/20",
              hint: "score",
            },
          ].map((kpi) => (
            <div
              key={kpi.label}
              className={`group relative overflow-hidden rounded-2xl border ${kpi.border} bg-gradient-to-b ${kpi.color} to-transparent p-4 transition hover:scale-[1.03]`}
            >
              <div className="pointer-events-none absolute -right-4 -top-4 h-16 w-16 rounded-full bg-white/5 blur-xl transition group-hover:bg-white/10" />
              <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500">{kpi.label}</p>
              <p className={`mt-1 text-2xl font-bold tabular-nums tracking-tight ${kpi.text} transition-all`}>
                {kpi.value}
                {kpi.label === "Health" ? <span className="text-sm font-semibold text-slate-500">%</span> : null}
              </p>
              <p className="mt-1 text-[10px] text-slate-500">{kpi.hint}</p>
            </div>
          ))}
        </div>

        {/* Animated graphs row */}
        <div className="mb-8 grid grid-cols-1 gap-5 md:grid-cols-2">
          <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-[#0a101c] p-4">
            <div className="scanline-overlay" />
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-cyan-400" />
                <p className="text-xs font-semibold text-white">Live Signal Intensity</p>
              </div>
              <span className="font-mono text-[10px] text-cyan-500/80">REALTIME</span>
            </div>
            <div className="h-24">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartA}>
                  <YAxis hide domain={[0, 80]} />
                  <Area type="monotone" dataKey="v" stroke="#22d3ee" fill="url(#g1)" strokeWidth={2} isAnimationActive animationDuration={2000} />
                  <defs>
                    <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="#22d3ee" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-[#0a101c] p-4">
            <div className="scanline-overlay" />
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-emerald-400" />
                <p className="text-xs font-semibold text-white">Repo Watch Pressure</p>
              </div>
              <span className="font-mono text-[10px] text-emerald-500/80">ACTIVE</span>
            </div>
            <div className="h-24">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartB}>
                  <YAxis hide domain={[0, 80]} />
                  <Area type="monotone" dataKey="v" stroke="#34d399" fill="url(#g2)" strokeWidth={2} isAnimationActive animationDuration={2500} />
                  <defs>
                    <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#34d399" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="#34d399" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Agent workstations — people at laptops */}
        <div className="mb-8">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Software team on duty
            </h2>
            <p className="text-[10px] text-slate-600">reviewing · thinking · reacting in real time</p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <AgentWorkstation
              role="architect"
              status={scanning || streaming ? "working" : criticalCount > 0 ? "alert" : "idle"}
              metric={commits.length}
              metricLabel="commits"
              mood={
                scanning || streaming
                  ? "thinking"
                  : criticalCount > 0
                  ? "confused"
                  : findings.length === 0
                  ? "excited"
                  : "reviewing"
              }
            />
            <AgentWorkstation
              role="senior-dev"
              status={scanning || streaming ? "working" : findings.length > 0 ? "working" : "idle"}
              metric={findings.length}
              metricLabel="findings"
              mood={
                scanning || streaming
                  ? "reviewing"
                  : criticalCount > 0
                  ? "confused"
                  : findings.length === 0
                  ? "excited"
                  : "thinking"
              }
            />
            <AgentWorkstation
              role="tester"
              status={criticalCount + highCount > 0 ? "alert" : scanning ? "working" : "idle"}
              metric={criticalCount + highCount}
              metricLabel="threats"
              mood={
                criticalCount > 0
                  ? "confused"
                  : highCount > 0
                  ? "thinking"
                  : scanning
                  ? "reviewing"
                  : findings.length === 0
                  ? "excited"
                  : "calm"
              }
            />
            <AgentWorkstation
              role="researcher"
              status={scanning || streaming ? "working" : "idle"}
              metric={issues.length}
              metricLabel="issues"
              mood={
                scanning || streaming
                  ? "thinking"
                  : issues.length > 2
                  ? "reviewing"
                  : findings.length === 0
                  ? "excited"
                  : "calm"
              }
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className="space-y-6 xl:col-span-2">
            {/* Live discussion */}
            <div className="overflow-hidden rounded-2xl border border-slate-800 bg-[#0a101c]">
              <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
                <div>
                  <h3 className="text-sm font-semibold text-white">Live Agent Discussion</h3>
                  <p className="text-xs text-slate-500">
                    From this scan’s real commits, findings & issues
                    {streaming ? " · streaming…" : ""}
                  </p>
                </div>
                <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium text-emerald-400">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                  {streaming ? "Writing" : "Live"}
                </span>
              </div>
              <div ref={feedRef} className="max-h-[420px] space-y-4 overflow-y-auto scroll-smooth p-5">
                {agentMessages.length === 0 ? (
                  <p className="py-10 text-center text-sm text-slate-600">
                    Click Scan Now — agents discuss real results, one message at a time
                  </p>
                ) : (
                  agentMessages.map((msg) => {
                    const config = roleConfig[msg.role];
                    const Icon = config.icon;
                    return (
                      <div key={msg.id} className="flex gap-3 anim-float">
                        <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${config.bg}`}>
                          <Icon className={`h-4 w-4 ${config.color}`} />
                        </div>
                        <div className="min-w-0 flex-1 rounded-xl border border-slate-800/60 bg-slate-900/40 px-4 py-3">
                          <div className="mb-1 flex items-center gap-2">
                            <span className={`text-xs font-semibold ${config.color}`}>{config.label}</span>
                            <span className="text-[10px] text-slate-600">
                              {new Date(msg.timestamp).toLocaleTimeString()}
                            </span>
                          </div>
                          <p className="text-sm leading-relaxed text-slate-300">{msg.content}</p>
                        </div>
                      </div>
                    );
                  })
                )}
                {streaming && (
                  <p className="text-center text-[11px] text-slate-600">
                    Showing {visibleCount} of {fullMessagesRef.current.length} · auto-scrolling
                  </p>
                )}
              </div>
            </div>

            {/* Findings */}
            <div className="rounded-2xl border border-slate-800 bg-[#0a101c] p-5">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-white">Automated Findings</h3>
                  <p className="text-xs text-slate-500">Critical & High auto-create GitHub Issues</p>
                </div>
                <AlertTriangle className="h-4 w-4 text-amber-400" />
              </div>
              <div className="space-y-3">
                {findings.length === 0 ? (
                  <div className="flex flex-col items-center gap-2 py-8">
                    <Lock className="h-8 w-8 text-emerald-500/50" />
                    <p className="text-sm text-emerald-400/80">No issues detected — system clean</p>
                  </div>
                ) : (
                  findings.map((f) => (
                    <div
                      key={f.id}
                      className="rounded-xl border border-slate-800/60 bg-slate-900/40 p-4 transition hover:border-slate-700"
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-medium text-white">{f.title}</span>
                        <span
                          className={`rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase ${
                            f.severity === "critical"
                              ? "bg-red-500/15 text-red-400"
                              : f.severity === "high"
                              ? "bg-orange-500/15 text-orange-400"
                              : "bg-slate-500/15 text-slate-400"
                          }`}
                        >
                          {f.severity}
                        </span>
                        {(f.severity === "critical" || f.severity === "high") && (
                          <span className="text-[10px] font-medium text-emerald-400">Auto-created</span>
                        )}
                      </div>
                      <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-slate-400">{f.description}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-800 bg-[#0a101c] p-5">
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-white">Open CodeBoss Issues</h3>
                <p className="text-xs text-slate-500">Claude Code discusses & fixes these</p>
              </div>
              <div className="space-y-2">
                {issues.length === 0 ? (
                  <p className="py-6 text-center text-xs text-slate-600">No open issues</p>
                ) : (
                  issues.map((i) => (
                    <a
                      key={i.number}
                      href={i.url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-between gap-2 rounded-xl border border-slate-800/60 bg-slate-900/40 px-3 py-3 transition hover:border-indigo-500/30"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm text-white">
                          #{i.number} {i.title.replace("[CodeBoss] ", "")}
                        </p>
                        <p className="text-[10px] text-slate-500">{new Date(i.createdAt).toLocaleString()}</p>
                      </div>
                      <ExternalLink className="h-3.5 w-3.5 shrink-0 text-slate-500" />
                    </a>
                  ))
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-[#0a101c] p-5">
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-white">Backend Activity</h3>
              </div>
              <div className="max-h-40 space-y-2 overflow-y-auto">
                {activity.length === 0 ? (
                  <p className="text-xs text-slate-600">No activity yet</p>
                ) : (
                  activity
                    .slice()
                    .reverse()
                    .map((a, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs">
                        <span
                          className={`mt-1 h-1.5 w-1.5 shrink-0 rounded-full ${
                            a.type === "success"
                              ? "bg-emerald-400"
                              : a.type === "warning"
                              ? "bg-amber-400"
                              : "bg-slate-500"
                          }`}
                        />
                        <div>
                          <p className="text-slate-300">{a.message}</p>
                          <p className="text-slate-600">{new Date(a.time).toLocaleTimeString()}</p>
                        </div>
                      </div>
                    ))
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-[#0a101c] p-5">
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-white">Recent Commits</h3>
              </div>
              <div className="space-y-2">
                {commits.slice(0, 5).map((c) => (
                  <a
                    key={c.sha}
                    href={c.url}
                    target="_blank"
                    rel="noreferrer"
                    className="block rounded-xl border border-slate-800/60 bg-slate-900/40 px-3 py-2.5 transition hover:border-slate-700"
                  >
                    <p className="truncate text-xs text-slate-200">{c.message}</p>
                    <p className="mt-1 text-[10px] text-slate-500">
                      <span className="font-mono text-cyan-400">{c.sha}</span> · {c.author}
                    </p>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <p className="mt-6 text-center font-mono text-[10px] text-slate-600">
          CODEBOSS SOC · AUTO CRITICAL/HIGH ISSUES · CLAUDE CODE FIX LOOP · TARGET {repo || "—"}
          {" · "}
          <Link href="/about" className="text-cyan-500/80 underline-offset-2 hover:text-cyan-400 hover:underline">
            What is CodeBoss?
          </Link>
        </p>
      </div>
    </div>
  );
}
