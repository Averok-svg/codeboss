"use client";

import { useState } from "react";
import { CheckCircle2, AlertCircle } from "lucide-react";

export default function SettingsPage() {
  const [token, setToken] = useState("");
  const [repo, setRepo] = useState("");
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);

  async function testConnection() {
    setTesting(true);
    setResult(null);
    try {
      const res = await fetch("/api/github", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, repo }),
      });
      const data = await res.json();
      if (data.ok) {
        setResult({
          ok: true,
          message: `Connected to ${data.name} (${data.private ? "private" : "public"})`,
        });
      } else {
        setResult({ ok: false, message: data.error || "Connection failed" });
      }
    } catch (e: any) {
      setResult({ ok: false, message: e.message });
    } finally {
      setTesting(false);
    }
  }

  return (
    <div className="min-h-screen p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-white">Settings</h1>
        <p className="mt-1 text-sm text-zinc-400">
          Everything stays free. Only GitHub + your existing Claude Code subscription.
        </p>
      </div>

      <div className="max-w-2xl space-y-6">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
          <h2 className="text-base font-semibold text-white">1. GitHub Connection (Free)</h2>
          <p className="mt-1 text-sm text-zinc-400">
            Create a Personal Access Token at GitHub → Settings → Developer settings → Personal access tokens.
            Give it <strong className="text-zinc-200">repo</strong> scope.
          </p>

          <div className="mt-5 space-y-4">
            <div>
              <label className="block text-xs font-medium text-zinc-400">Repository (owner/repo)</label>
              <input
                type="text"
                value={repo}
                onChange={(e) => setRepo(e.target.value)}
                placeholder="your-username/your-app"
                className="mt-1.5 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-400">GitHub Personal Access Token</label>
              <input
                type="password"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                className="mt-1.5 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <button
              onClick={testConnection}
              disabled={testing || !token || !repo}
              className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-50"
            >
              {testing ? "Testing..." : "Test Connection"}
            </button>
            {result && (
              <div
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${
                  result.ok ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
                }`}
              >
                {result.ok ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                {result.message}
              </div>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
          <h2 className="text-base font-semibold text-white">2. Environment Variables (for Vercel / production)</h2>
          <p className="mt-1 text-sm text-zinc-400">
            For the dashboard to stay connected automatically, add these in Vercel → Project → Settings → Environment Variables:
          </p>
          <pre className="mt-4 overflow-x-auto rounded-lg bg-zinc-950 p-4 text-xs text-zinc-300">
{`GITHUB_TOKEN=ghp_your_token_here
GITHUB_REPO=your-username/your-app`}
          </pre>
          <p className="mt-3 text-xs text-zinc-500">
            Never put the token in the frontend code. Only in environment variables.
          </p>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
          <h2 className="text-base font-semibold text-white">3. Connect Claude Code (Free – already paid)</h2>
          <p className="mt-1 text-sm text-zinc-400">
            In your project, add this to <code className="text-indigo-300">CLAUDE.md</code> or say it once:
          </p>
          <pre className="mt-4 overflow-x-auto rounded-lg bg-zinc-950 p-4 text-xs text-zinc-300 whitespace-pre-wrap">
{`You are working under CodeBoss supervision.

- Always check open GitHub issues labeled "codeboss"
- Treat them as high priority
- Fix them one by one and close the issue when done
- If unsure, ask me first`}
          </pre>
        </div>
      </div>
    </div>
  );
}
