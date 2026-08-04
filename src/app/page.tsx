"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import {
  Activity,
  AlertTriangle,
  RefreshCw,
  ExternalLink,
  Shield,
  Bot,
  Search,
  Code2,
  Server,
  CheckCircle2,
  X,
} from "lucide-react";

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
  { label: string; icon: React.ElementType; color: string; bg: string }
> = {
  architect: { label: "System Architect", icon: Server, color: "text-indigo-400", bg: "bg-indigo-500/15" },
  "senior-dev": { label: "Senior Developer", icon: Code2, color: "text-emerald-400", bg: "bg-emerald-500/15" },
  tester: { label: "Aggressive Tester", icon: Shield, color: "text-red-400", bg: "bg-red-500/15" },
  researcher: { label: "Researcher", icon: Search, color: "text-cyan-400", bg: "bg-cyan-500/15" },
  system: { label: "CodeBoss", icon: Bot, color: "text-slate-400", bg: "bg-slate-500/15" },
};

const SCAN_STAGES = [
  { pct: 8, label: "Connecting to private repo..." },
  { pct: 18, label: "Fetching recent commits..." },
  { pct: 32, label: "System Architect reviewing architecture..." },
  { pct: 48, label: "Senior Developer scanning code quality..." },
  { pct: 62, label: "Aggressive Tester running chaos checks..." },
  { pct: 78, label: "Researcher looking for better patterns..." },
  { pct: 90, label: "Creating GitHub issues for Critical/High..." },
  { pct: 100, label: "Scan complete" },
];

function buildAgentDiscussion(
  findings: Finding[],
  commits: Commit[],
  issues: Issue[]
): AgentMessage[] {
  const now = Date.now();
  const msgs: AgentMessage[] = [];
  let t = 0;

  msgs.push({
    id: `m-${t++}`,
    role: "system",
    content: `Scan started on ${commits.length} recent commits. Agents are online.`,
    timestamp: new Date(now - 90000).toISOString(),
  });

  msgs.push({
    id: `m-${t++}`,
    role: "architect",
    content:
      "Reviewing overall structure and security boundaries. Checking for auth, RLS, and service-layer consistency.",
    timestamp: new Date(now - 75000).toISOString(),
  });

  const critical = findings.filter((f) => f.severity === "critical");
  const high = findings.filter((f) => f.severity === "high");

  if (critical.length > 0) {
    msgs.push({
      id: `m-${t++}`,
      role: "tester",
      content: `CRITICAL: ${critical[0].title}. I will try to break this path. ${critical[0].description.slice(0, 120)}...`,
      timestamp: new Date(now - 60000).toISOString(),
    });
    msgs.push({
      id: `m-${t++}`,
      role: "senior-dev",
      content:
        "Acknowledged. Investigating the referenced commit diff. Will not trust the commit message alone — checking actual code for secrets and auth flaws.",
      timestamp: new Date(now - 50000).toISOString(),
    });
  }

  if (high.length > 0) {
    msgs.push({
      id: `m-${t++}`,
      role: "architect",
      content: `Architecture note: ${high[0].title}. We should treat this as high priority before shipping further features.`,
      timestamp: new Date(now - 40000).toISOString(),
    });
  }

  msgs.push({
    id: `m-${t++}`,
    role: "researcher",
    content:
      "Checked current best practices for Next.js + Supabase security. Recommend explicit RLS on every table and rate limiting on public routes. Documenting recommendations in issues.",
    timestamp: new Date(now - 30000).toISOString(),
  });

  msgs.push({
    id: `m-${t++}`,
    role: "tester",
    content:
      "Running aggressive checks: malformed payloads, missing auth headers, and edge-case inputs. Any weak path will be reported as a CodeBoss issue.",
    timestamp: new Date(now - 20000).toISOString(),
  });

  if (issues.length > 0) {
    msgs.push({
      id: `m-${t++}`,
      role: "system",
      content: `${issues.length} open GitHub issue(s) labeled codeboss are ready for Claude Code to discuss and fix.`,
      timestamp: new Date(now - 10000).toISOString(),
    });
  } else if (findings.length === 0) {
    msgs.push({
      id: `m-${t++}`,
      role: "architect",
      content: "No critical patterns in recent commits. System health looks acceptable for now. Continuing background watch.",
      timestamp: new Date(now - 8000).toISOString(),
    });
  }

  msgs.push({
    id: `m-${t++}`,
    role: "senior-dev",
    content:
      "Claude Code should pick up open codeboss issues, verify with git show, comment analysis, then fix or close false positives.",
    timestamp: new Date(now - 4000).toISOString(),
  });

  return msgs;
}

export default function DashboardPage() {
  const [connected, setConnected] = useState(false);
  const [repo, setRepo] = useState("");
  const [commits, setCommits] = useState<Commit[]>([]);
  const [findings, setFindings] = useState<Finding[]>([]);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [agentMessages, setAgentMessages] = useState<AgentMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [scanPct, setScanPct] = useState(0);
  const [scanLabel, setScanLabel] = useState("");
  const [scanDone, setScanDone] = useState(false);
  const [lastScan, setLastScan] = useState<string | null>(null);
  const [autoCreated, setAutoCreated] = useState(0);
  const feedRef = useRef<HTMLDivElement>(null);

  const refresh = useCallback(async () => {
    try {
      const gh = await fetch("/api/github").then((r) => r.json());
      if (gh.connected) {
        setConnected(true);
        setRepo(gh.repo || "");
        setCommits(gh.commits || []);
      } else {
        setConnected(false);
      }

      const an = await fetch("/api/analyze").then((r) => r.json());
      const nextFindings = an.findings || [];
      const nextIssues = an.issues || [];
      setFindings(nextFindings);
      setActivity(an.activity || []);
      setAutoCreated(an.autoCreated || 0);
      if (an.scannedAt) setLastScan(an.scannedAt);
      if (an.issues) setIssues(nextIssues);
      else {
        const iss = await fetch("/api/issues").then((r) => r.json());
        setIssues(iss.issues || []);
      }

      setAgentMessages(
        buildAgentDiscussion(nextFindings, gh.commits || commits, nextIssues.length ? nextIssues : issues)
      );
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [commits, issues]);

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (feedRef.current) {
      feedRef.current.scrollTop = feedRef.current.scrollHeight;
    }
  }, [agentMessages, scanning]);

  async function runScan() {
    if (scanning) return;
    setScanning(true);
    setScanDone(false);
    setScanPct(0);
    setScanLabel(SCAN_STAGES[0].label);

    // Animate progress through stages while real scan runs
    let stageIdx = 0;
    const progressTimer = setInterval(() => {
      stageIdx = Math.min(stageIdx + 1, SCAN_STAGES.length - 1);
      setScanPct(SCAN_STAGES[stageIdx].pct);
      setScanLabel(SCAN_STAGES[stageIdx].label);
      if (stageIdx >= SCAN_STAGES.length - 1) clearInterval(progressTimer);
    }, 450);

    try {
      await refresh();
    } finally {
      clearInterval(progressTimer);
      setScanPct(100);
      setScanLabel("Scan complete");
      setScanDone(true);
      setTimeout(() => {
        setScanning(false);
        setScanDone(false);
      }, 1800);
    }
  }

  const criticalCount = findings.filter((f) => f.severity === "critical").length;
  const highCount = findings.filter((f) => f.severity === "high").length;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0e17]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />
          <p className="text-sm text-slate-400">Connecting agents to repository...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0e17] text-slate-100">
      {/* Scan overlay */}
      {scanning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-[#0d1219] p-8 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/20">
                  <Bot className="h-5 w-5 text-indigo-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">CodeBoss Scan</p>
                  <p className="text-xs text-slate-500">Multi-agent analysis running</p>
                </div>
              </div>
              {scanDone && <CheckCircle2 className="h-6 w-6 text-emerald-400 animate-in zoom-in" />}
            </div>

            <div className="mb-3 flex items-end justify-between">
              <p className="text-xs text-slate-400">{scanLabel}</p>
              <p className="text-2xl font-bold text-cyan-400 tabular-nums">{scanPct}%</p>
            </div>

            <div className="h-3 overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-cyan-400 to-emerald-400 transition-all duration-500 ease-out"
                style={{ width: `${scanPct}%` }}
              />
            </div>

            <div className="mt-6 grid grid-cols-2 gap-2">
              {(["architect", "senior-dev", "tester", "researcher"] as AgentRole[]).map((role) => {
                const c = roleConfig[role];
                const Icon = c.icon;
                const active = scanPct > 20;
                return (
                  <div
                    key={role}
                    className={`flex items-center gap-2 rounded-lg border px-3 py-2 transition ${
                      active ? "border-slate-600 bg-slate-900/80" : "border-slate-800 bg-slate-900/30 opacity-50"
                    }`}
                  >
                    <Icon className={`h-3.5 w-3.5 ${c.color} ${active && !scanDone ? "animate-pulse" : ""}`} />
                    <span className="text-[11px] text-slate-300">{c.label}</span>
                  </div>
                );
              })}
            </div>

            {scanDone && (
              <p className="mt-5 text-center text-sm font-medium text-emerald-400 animate-in fade-in">
                Done — agents finished this pass
              </p>
            )}
          </div>
        </div>
      )}

      {/* Top bar */}
      <div className="border-b border-slate-800/80 bg-[#0d1219]/60 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-400">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold tracking-tight text-white">CodeBoss</h1>
              <p className="text-[11px] text-slate-500">Architect · Developer · Tester · Researcher</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
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
              className="flex items-center gap-2 rounded-full bg-indigo-600 px-4 py-1.5 text-xs font-medium text-white transition hover:bg-indigo-500 disabled:opacity-50"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${scanning ? "animate-spin" : ""}`} />
              Scan Now
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* KPI Row */}
        <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {[
            { label: "Critical", value: criticalCount, text: "text-red-400", border: "border-red-500/20", color: "from-red-500/20 to-red-500/5" },
            { label: "High", value: highCount, text: "text-orange-400", border: "border-orange-500/20", color: "from-orange-500/20 to-orange-500/5" },
            { label: "Findings", value: findings.length, text: "text-amber-400", border: "border-amber-500/20", color: "from-amber-500/20 to-amber-500/5" },
            { label: "Open Issues", value: issues.length, text: "text-indigo-400", border: "border-indigo-500/20", color: "from-indigo-500/20 to-indigo-500/5" },
            { label: "Commits", value: commits.length, text: "text-emerald-400", border: "border-emerald-500/20", color: "from-emerald-500/20 to-emerald-500/5" },
            { label: "Last Scan", value: lastScan ? new Date(lastScan).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "—", text: "text-cyan-400", border: "border-cyan-500/20", color: "from-cyan-500/20 to-cyan-500/5" },
          ].map((kpi) => (
            <div
              key={kpi.label}
              className={`rounded-2xl border ${kpi.border} bg-gradient-to-b ${kpi.color} p-4 transition hover:scale-[1.02]`}
            >
              <p className="text-[11px] font-medium uppercase tracking-wider text-slate-500">{kpi.label}</p>
              <p className={`mt-2 text-2xl font-bold ${kpi.text}`}>{kpi.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          {/* Live Agent Discussion - main interactive panel */}
          <div className="xl:col-span-2 space-y-6">
            <div className="rounded-2xl border border-slate-800/80 bg-[#0d1219]/80 overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
                <div>
                  <h3 className="text-sm font-semibold text-white">Live Agent Discussion</h3>
                  <p className="text-xs text-slate-500">Architect · Senior Dev · Aggressive Tester · Researcher</p>
                </div>
                <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium text-emerald-400">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                  Live
                </span>
              </div>
              <div ref={feedRef} className="max-h-[420px] space-y-4 overflow-y-auto p-5">
                {agentMessages.length === 0 ? (
                  <p className="py-10 text-center text-sm text-slate-600">Click Scan Now to start agent discussion</p>
                ) : (
                  agentMessages.map((msg, idx) => {
                    const config = roleConfig[msg.role];
                    const Icon = config.icon;
                    return (
                      <div
                        key={msg.id}
                        className="flex gap-3 animate-in fade-in slide-in-from-bottom-2"
                        style={{ animationDelay: `${idx * 40}ms`, animationFillMode: "both" }}
                      >
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
              </div>
            </div>

            {/* Findings */}
            <div className="rounded-2xl border border-slate-800/80 bg-[#0d1219]/80 p-5">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-white">Automated Findings</h3>
                  <p className="text-xs text-slate-500">
                    Critical & High auto-created as GitHub Issues
                    {autoCreated > 0 && ` · ${autoCreated} new this scan`}
                  </p>
                </div>
                <AlertTriangle className="h-4 w-4 text-amber-400" />
              </div>
              <div className="space-y-3">
                {findings.length === 0 ? (
                  <p className="py-8 text-center text-sm text-slate-600">No findings. System looks clean.</p>
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

          {/* Right column */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-800/80 bg-[#0d1219]/80 p-5">
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

            <div className="rounded-2xl border border-slate-800/80 bg-[#0d1219]/80 p-5">
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-white">Backend Activity</h3>
                <p className="text-xs text-slate-500">What ran in the last scan</p>
              </div>
              <div className="max-h-40 space-y-2 overflow-y-auto">
                {activity.length === 0 ? (
                  <p className="text-xs text-slate-600">No activity yet</p>
                ) : (
                  activity
                    .slice()
                    .reverse()
                    .map((a, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs">
                        <span
                          className={`mt-1 h-1.5 w-1.5 shrink-0 rounded-full ${
                            a.type === "success" ? "bg-emerald-400" : a.type === "warning" ? "bg-amber-400" : "bg-slate-500"
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

            <div className="rounded-2xl border border-slate-800/80 bg-[#0d1219]/80 p-5">
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

        {/* Bottom agent status bar */}
        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-4">
          {(
            [
              { role: "architect" as AgentRole, metric: commits.length, metricLabel: "Commits reviewed" },
              { role: "senior-dev" as AgentRole, metric: findings.length, metricLabel: "Findings logged" },
              { role: "tester" as AgentRole, metric: criticalCount + highCount, metricLabel: "Attacks flagged" },
              { role: "researcher" as AgentRole, metric: issues.length, metricLabel: "Issues open" },
            ] as const
          ).map((item) => {
            const c = roleConfig[item.role];
            const Icon = c.icon;
            return (
              <div
                key={item.role}
                className={`flex items-center gap-3 rounded-2xl border border-slate-700/50 bg-gradient-to-r from-slate-900/80 to-transparent p-4`}
              >
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${c.bg}`}>
                  <Icon className={`h-5 w-5 ${c.color}`} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-white">{c.label}</p>
                  <p className="text-[11px] text-slate-400">{item.metricLabel}</p>
                </div>
                <p className={`text-lg font-bold ${c.color}`}>{item.metric}</p>
              </div>
            );
          })}
        </div>

        <p className="mt-6 text-center text-[11px] text-slate-600">
          Multi-agent monitor · Auto-creates Critical & High issues · Claude Code discusses & fixes · Target: {repo || "—"}
        </p>
      </div>
    </div>
  );
}
