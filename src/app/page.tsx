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
  Info,
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
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    try {
      const gh = await fetch("/api/github").then((r) => r.json());
      if (gh.connected) {
        setConnected(true);
        setRepo(gh.repo || "");
        setCommits(gh.commits || []);
        setError("");
      } else {
        setConnected(false);
        setError(gh.error || "Not connected");
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
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
      setScanning(false);
    }
  }, []);

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, 60000); // every 60s to stay free + gentle
    return () => clearInterval(interval);
  }, [refresh]);

  async function runScan() {
    setScanning(true);
    await refresh();
  }

  const severityColor = {
    critical: "text-red-400 bg-red-500/15 border-red-500/30",
    high: "text-orange-400 bg-orange-500/15 border-orange-500/30",
    medium: "text-yellow-400 bg-yellow-500/15 border-yellow-500/30",
    low: "text-blue-400 bg-blue-500/15 border-blue-500/30",
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
          <p className="text-sm text-zinc-400">Connecting to your repo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Command Center</h1>
          <p className="mt-1 text-sm text-zinc-400">
            Free automated monitor · Auto-creates Critical & High issues · Claude Code fixes them
          </p>
        </div>
        <div className="flex items-center gap-3">
          {connected ? (
            <div className="flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-400">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              {repo || "Connected"}
            </div>
          ) : (
            <div className="rounded-lg border border-amber-500/20 bg-amber-500/10 px-3 py-1.5 text-xs font-medium text-amber-400">
              Not connected
            </div>
          )}
          <button
            onClick={runScan}
            disabled={scanning}
            className="flex items-center gap-2 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-indigo-500 disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${scanning ? "animate-spin" : ""}`} />
            Scan Now
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: "Open Findings", value: findings.length, icon: AlertTriangle, color: "text-red-400", bg: "bg-red-500/10" },
          { label: "GitHub Issues", value: issues.length, icon: Github, color: "text-indigo-400", bg: "bg-indigo-500/10" },
          { label: "Recent Commits", value: commits.length, icon: Code2, color: "text-emerald-400", bg: "bg-emerald-500/10" },
          { label: "Last Scan", value: lastScan ? new Date(lastScan).toLocaleTimeString() : "—", icon: Activity, color: "text-cyan-400", bg: "bg-cyan-500/10" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
            <div className={`inline-flex rounded-lg p-2 ${s.bg}`}>
              <s.icon className={`h-4 w-4 ${s.color}`} />
            </div>
            <p className="mt-3 text-2xl font-bold text-white">{s.value}</p>
            <p className="mt-0.5 text-xs text-zinc-500">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Findings + Activity */}
        <div className="xl:col-span-2 space-y-4">
          {/* Backend Activity */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 overflow-hidden">
            <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-4">
              <div>
                <h3 className="text-sm font-semibold text-white">Backend Activity</h3>
                <p className="text-xs text-zinc-500">What CodeBoss is doing right now</p>
              </div>
              <Zap className="h-4 w-4 text-amber-400" />
            </div>
            <div className="max-h-40 overflow-y-auto divide-y divide-zinc-800/80">
              {activity.length === 0 ? (
                <div className="p-4 text-xs text-zinc-500">No activity yet. Click Scan Now.</div>
              ) : (
                activity.slice().reverse().map((a, i) => (
                  <div key={i} className="flex items-start gap-3 px-5 py-2.5 text-xs">
                    <span className={`mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full ${
                      a.type === "success" ? "bg-emerald-400" : a.type === "warning" ? "bg-amber-400" : "bg-zinc-500"
                    }`} />
                    <div>
                      <p className="text-zinc-300">{a.message}</p>
                      <p className="text-zinc-600">{new Date(a.time).toLocaleTimeString()}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Findings */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 overflow-hidden">
            <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-4">
              <div>
                <h3 className="text-sm font-semibold text-white">Automated Findings</h3>
                <p className="text-xs text-zinc-500">
                  Critical & High are auto-created as GitHub Issues
                  {autoCreated > 0 && ` · ${autoCreated} created this scan`}
                </p>
              </div>
            </div>
            <div className="divide-y divide-zinc-800/80 max-h-[420px] overflow-y-auto">
              {findings.length === 0 ? (
                <div className="p-8 text-center text-sm text-zinc-500">
                  {connected ? "No findings right now. Looking good." : "Connect GitHub to start scanning."}
                </div>
              ) : (
                findings.map((f) => (
                  <div key={f.id} className="flex gap-4 px-5 py-4">
                    <AlertTriangle
                      className={`mt-0.5 h-4 w-4 shrink-0 ${
                        f.severity === "critical" ? "text-red-400" : f.severity === "high" ? "text-orange-400" : "text-zinc-500"
                      }`}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-medium text-white">{f.title}</span>
                        <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-medium uppercase ${severityColor[f.severity]}`}>
                          {f.severity}
                        </span>
                        {(f.severity === "critical" || f.severity === "high") && (
                          <span className="text-[10px] text-emerald-400">Auto-created as Issue</span>
                        )}
                      </div>
                      <p className="mt-1 line-clamp-2 text-xs text-zinc-400">{f.description}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 overflow-hidden">
            <div className="border-b border-zinc-800 px-5 py-4">
              <h3 className="text-sm font-semibold text-white">Open CodeBoss Issues</h3>
              <p className="text-xs text-zinc-500">Claude Code should fix these</p>
            </div>
            <div className="divide-y divide-zinc-800/80 max-h-64 overflow-y-auto">
              {issues.length === 0 ? (
                <div className="p-6 text-center text-xs text-zinc-500">No open issues yet</div>
              ) : (
                issues.map((i) => (
                  <a key={i.number} href={i.url} target="_blank" rel="noreferrer"
                    className="flex items-center justify-between gap-2 px-5 py-3 hover:bg-zinc-800/40 transition">
                    <div className="min-w-0">
                      <p className="truncate text-sm text-white">#{i.number} {i.title.replace("[CodeBoss] ", "")}</p>
                      <p className="text-[11px] text-zinc-500">{new Date(i.createdAt).toLocaleString()}</p>
                    </div>
                    <ExternalLink className="h-3.5 w-3.5 shrink-0 text-zinc-500" />
                  </a>
                ))
              )}
            </div>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 overflow-hidden">
            <div className="border-b border-zinc-800 px-5 py-4">
              <h3 className="text-sm font-semibold text-white">Recent Commits</h3>
            </div>
            <div className="divide-y divide-zinc-800/80 max-h-56 overflow-y-auto">
              {commits.slice(0, 8).map((c) => (
                <a key={c.sha} href={c.url} target="_blank" rel="noreferrer"
                  className="block px-5 py-3 hover:bg-zinc-800/40 transition">
                  <p className="truncate text-sm text-zinc-200">{c.message}</p>
                  <p className="mt-0.5 text-[11px] text-zinc-500">
                    <span className="font-mono text-indigo-400">{c.sha}</span> · {c.author}
                  </p>
                </a>
              ))}
            </div>
          </div>

          {/* Claude usage note */}
          <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
            <div className="flex items-start gap-2">
              <Info className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
              <div className="text-xs text-zinc-400">
                <p className="font-medium text-amber-300">Claude usage control</p>
                <p className="mt-1">CodeBoss itself is free and does not use Claude tokens.</p>
                <p className="mt-1">Only when you ask Claude Code to fix issues will tokens be used. Check your usage at console.anthropic.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
