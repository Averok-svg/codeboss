"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Activity,
  AlertTriangle,
  Code2,
  RefreshCw,
  Github,
  Zap,
  ExternalLink,
  Shield,
  Bot,
  Search,
  Bug,
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

export default function DashboardPage() {
  const [connected, setConnected] = useState(false);
  const [repo, setRepo] = useState("");
  const [commits, setCommits] = useState<Commit[]>([]);
  const [findings, setFindings] = useState<Finding[]>([]);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [lastScan, setLastScan] = useState<string | null>(null);
  const [autoCreated, setAutoCreated] = useState(0);

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
      setFindings(an.findings || []);
      setActivity(an.activity || []);
      setAutoCreated(an.autoCreated || 0);
      if (an.scannedAt) setLastScan(an.scannedAt);
      if (an.issues) setIssues(an.issues);
      else {
        const iss = await fetch("/api/issues").then((r) => r.json());
        setIssues(iss.issues || []);
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
      setScanning(false);
    }
  }, []);

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, 60000);
    return () => clearInterval(interval);
  }, [refresh]);

  async function runScan() {
    setScanning(true);
    await refresh();
  }

  const criticalCount = findings.filter((f) => f.severity === "critical").length;
  const highCount = findings.filter((f) => f.severity === "high").length;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0e17]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />
          <p className="text-sm text-slate-400">Connecting to repository...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0e17] text-slate-100">
      {/* Top bar */}
      <div className="border-b border-slate-800/80 bg-[#0d1219]/60 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-400">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold tracking-tight text-white">CodeBoss</h1>
              <p className="text-[11px] text-slate-500">Strict Engineering Partner</p>
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
            { label: "Critical", value: criticalCount, color: "from-red-500/20 to-red-500/5", text: "text-red-400", border: "border-red-500/20" },
            { label: "High", value: highCount, color: "from-orange-500/20 to-orange-500/5", text: "text-orange-400", border: "border-orange-500/20" },
            { label: "Findings", value: findings.length, color: "from-amber-500/20 to-amber-500/5", text: "text-amber-400", border: "border-amber-500/20" },
            { label: "Open Issues", value: issues.length, color: "from-indigo-500/20 to-indigo-500/5", text: "text-indigo-400", border: "border-indigo-500/20" },
            { label: "Commits", value: commits.length, color: "from-emerald-500/20 to-emerald-500/5", text: "text-emerald-400", border: "border-emerald-500/20" },
            { label: "Last Scan", value: lastScan ? new Date(lastScan).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "—", color: "from-cyan-500/20 to-cyan-500/5", text: "text-cyan-400", border: "border-cyan-500/20" },
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
          {/* Left - Activity + Findings */}
          <div className="space-y-6 xl:col-span-2">
            {/* Backend Activity */}
            <div className="rounded-2xl border border-slate-800/80 bg-[#0d1219]/80 p-5">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-white">Live Backend Activity</h3>
                  <p className="text-xs text-slate-500">Real-time monitor actions</p>
                </div>
                <Zap className="h-4 w-4 text-amber-400" />
              </div>
              <div className="max-h-36 space-y-2 overflow-y-auto">
                {activity.length === 0 ? (
                  <p className="text-xs text-slate-600">Waiting for scan...</p>
                ) : (
                  activity.slice().reverse().map((a, i) => (
                    <div key={i} className="flex items-start gap-3 rounded-lg bg-slate-900/50 px-3 py-2">
                      <span className={`mt-1 h-1.5 w-1.5 shrink-0 rounded-full ${
                        a.type === "success" ? "bg-emerald-400" : a.type === "warning" ? "bg-amber-400" : "bg-slate-500"
                      }`} />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-slate-300">{a.message}</p>
                        <p className="text-[10px] text-slate-600">{new Date(a.time).toLocaleTimeString()}</p>
                      </div>
                    </div>
                  ))
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
                        <span className={`rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase ${
                          f.severity === "critical"
                            ? "bg-red-500/15 text-red-400"
                            : f.severity === "high"
                            ? "bg-orange-500/15 text-orange-400"
                            : "bg-slate-500/15 text-slate-400"
                        }`}>
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
            {/* Open Issues */}
            <div className="rounded-2xl border border-slate-800/80 bg-[#0d1219]/80 p-5">
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-white">Open CodeBoss Issues</h3>
                <p className="text-xs text-slate-500">Claude Code should discuss & fix these</p>
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
                        <p className="truncate text-sm text-white">#{i.number} {i.title.replace("[CodeBoss] ", "")}</p>
                        <p className="text-[10px] text-slate-500">{new Date(i.createdAt).toLocaleString()}</p>
                      </div>
                      <ExternalLink className="h-3.5 w-3.5 shrink-0 text-slate-500" />
                    </a>
                  ))
                )}
              </div>
            </div>

            {/* Recent Commits */}
            <div className="rounded-2xl border border-slate-800/80 bg-[#0d1219]/80 p-5">
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-white">Recent Commits</h3>
                <p className="text-xs text-slate-500">Live from private repo</p>
              </div>
              <div className="space-y-2">
                {commits.slice(0, 6).map((c) => (
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

        {/* Bottom Agent Status Bar - matching your design */}
        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="flex items-center gap-3 rounded-2xl border border-indigo-500/20 bg-gradient-to-r from-indigo-500/10 to-transparent p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/20">
              <Bot className="h-5 w-5 text-indigo-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">CodeBoss Monitor</p>
              <p className="text-[11px] text-slate-400">Commit Scanner · Issue Creator</p>
            </div>
            <div className="ml-auto text-right">
              <p className="text-lg font-bold text-indigo-400">{commits.length}</p>
              <p className="text-[10px] text-slate-500">Commits watched</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-cyan-500/20 bg-gradient-to-r from-cyan-500/10 to-transparent p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/20">
              <Search className="h-5 w-5 text-cyan-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Pattern Engine</p>
              <p className="text-[11px] text-slate-400">Security & Quality Finder</p>
            </div>
            <div className="ml-auto text-right">
              <p className="text-lg font-bold text-cyan-400">{findings.length}</p>
              <p className="text-[10px] text-slate-500">Issues logged</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-emerald-500/20 bg-gradient-to-r from-emerald-500/10 to-transparent p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20">
              <Shield className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Claude Code</p>
              <p className="text-[11px] text-slate-400">Fixer · Discusses in Issues</p>
            </div>
            <div className="ml-auto text-right">
              <p className="text-lg font-bold text-emerald-400">{issues.length}</p>
              <p className="text-[10px] text-slate-500">Open for fix</p>
            </div>
          </div>
        </div>

        <p className="mt-6 text-center text-[11px] text-slate-600">
          Continuous monitoring · Auto-creates Critical & High issues · Claude Code discusses & fixes · Target: {repo || "—"}
        </p>
      </div>
    </div>
  );
}
