"use client";

import { Bot, Code2, Shield, Search, Server } from "lucide-react";
import { mockMessages } from "@/lib/mock-data";
import { AgentRole } from "@/lib/types";
import { formatRelativeTime, cn } from "@/lib/utils";

const roleConfig: Record<
  AgentRole,
  { label: string; icon: React.ElementType; color: string; bg: string }
> = {
  architect: {
    label: "Architect",
    icon: Server,
    color: "text-indigo-400",
    bg: "bg-indigo-500/15",
  },
  "senior-dev": {
    label: "Senior Dev",
    icon: Code2,
    color: "text-emerald-400",
    bg: "bg-emerald-500/15",
  },
  tester: {
    label: "Aggressive Tester",
    icon: Shield,
    color: "text-red-400",
    bg: "bg-red-500/15",
  },
  researcher: {
    label: "Researcher",
    icon: Search,
    color: "text-cyan-400",
    bg: "bg-cyan-500/15",
  },
  system: {
    label: "System",
    icon: Bot,
    color: "text-zinc-400",
    bg: "bg-zinc-500/15",
  },
};

export function AgentFeed() {
  return (
    <div className="flex h-full flex-col rounded-xl border border-zinc-800 bg-zinc-900/50">
      <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-4">
        <div>
          <h3 className="text-sm font-semibold text-white">Live Agent Discussion</h3>
          <p className="text-xs text-zinc-500">Architect • Tester • Researcher • Senior Dev</p>
        </div>
        <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium text-emerald-400">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
          Live
        </span>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto p-5">
        {mockMessages.map((msg) => {
          const config = roleConfig[msg.role];
          const Icon = config.icon;
          return (
            <div key={msg.id} className="flex gap-3">
              <div
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                  config.bg
                )}
              >
                <Icon className={cn("h-4 w-4", config.color)} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className={cn("text-xs font-semibold", config.color)}>
                    {config.label}
                  </span>
                  <span className="text-[11px] text-zinc-600">
                    {formatRelativeTime(msg.timestamp)}
                  </span>
                </div>
                <p className="mt-1 text-sm leading-relaxed text-zinc-300">{msg.content}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Human interrupt */}
      <div className="border-t border-zinc-800 p-4">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Interrupt agents or give a new instruction..."
            className="flex-1 rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
          <button className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-500">
            Send
          </button>
        </div>
        <p className="mt-2 text-[11px] text-zinc-600">
          Agents will pause and ask you when confused. You can interrupt anytime.
        </p>
      </div>
    </div>
  );
}
