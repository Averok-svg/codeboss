"use client";

import { AlertTriangle, Shield, Code2, Activity, TrendingUp, Bug } from "lucide-react";
import { cn } from "@/lib/utils";

const stats = [
  {
    label: "Critical Issues",
    value: "2",
    change: "+1",
    trend: "up" as const,
    icon: AlertTriangle,
    color: "text-red-400",
    bg: "bg-red-500/10",
  },
  {
    label: "Architecture Score",
    value: "71",
    change: "+4",
    trend: "up" as const,
    icon: Code2,
    color: "text-indigo-400",
    bg: "bg-indigo-500/10",
  },
  {
    label: "Security Risk",
    value: "High",
    change: "2 open",
    trend: "down" as const,
    icon: Shield,
    color: "text-orange-400",
    bg: "bg-orange-500/10",
  },
  {
    label: "Break Attempts",
    value: "47",
    change: "Today",
    trend: "neutral" as const,
    icon: Bug,
    color: "text-purple-400",
    bg: "bg-purple-500/10",
  },
  {
    label: "Agent Actions",
    value: "128",
    change: "+23",
    trend: "up" as const,
    icon: Activity,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
  },
  {
    label: "Research Hits",
    value: "9",
    change: "3 useful",
    trend: "up" as const,
    icon: TrendingUp,
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
  },
];

export function StatCards() {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 transition-colors hover:border-zinc-700"
        >
          <div className="flex items-center justify-between">
            <div className={cn("rounded-lg p-2", stat.bg)}>
              <stat.icon className={cn("h-4 w-4", stat.color)} />
            </div>
            <span
              className={cn(
                "text-xs font-medium",
                stat.trend === "up"
                  ? "text-emerald-400"
                  : stat.trend === "down"
                  ? "text-red-400"
                  : "text-zinc-500"
              )}
            >
              {stat.change}
            </span>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-bold tracking-tight text-white">{stat.value}</p>
            <p className="mt-0.5 text-xs text-zinc-500">{stat.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
