"use client";

import { mockIssues } from "@/lib/mock-data";
import { SeverityBadge, StatusBadge } from "@/components/ui/badge";
import { formatRelativeTime } from "@/lib/utils";
import { AlertCircle } from "lucide-react";

export function IssuesBoard({ limit }: { limit?: number }) {
  const issues = limit ? mockIssues.slice(0, limit) : mockIssues;

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/50">
      <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-4">
        <div>
          <h3 className="text-sm font-semibold text-white">Attack & Issue Board</h3>
          <p className="text-xs text-zinc-500">
            {mockIssues.filter((i) => i.status === "open" || i.status === "needs-human").length}{" "}
            requiring attention
          </p>
        </div>
      </div>

      <div className="divide-y divide-zinc-800/80">
        {issues.map((issue) => (
          <div
            key={issue.id}
            className="flex gap-4 px-5 py-4 transition-colors hover:bg-zinc-800/30"
          >
            <div className="mt-0.5">
              <AlertCircle
                className={
                  issue.severity === "critical"
                    ? "h-4 w-4 text-red-400"
                    : issue.severity === "high"
                    ? "h-4 w-4 text-orange-400"
                    : "h-4 w-4 text-zinc-500"
                }
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium text-white">{issue.title}</span>
                <SeverityBadge severity={issue.severity} />
                <StatusBadge status={issue.status} />
              </div>
              <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-zinc-400">
                {issue.description}
              </p>
              {issue.attackAttempt && (
                <p className="mt-1.5 rounded bg-red-500/10 px-2 py-1 text-[11px] text-red-300/90">
                  Attack: {issue.attackAttempt}
                </p>
              )}
              <div className="mt-2 flex items-center gap-3 text-[11px] text-zinc-600">
                <span>#{issue.id}</span>
                <span>•</span>
                <span className="capitalize">{issue.foundBy.replace("-", " ")}</span>
                <span>•</span>
                <span>{formatRelativeTime(issue.createdAt)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
