"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  MessageSquare,
  ShieldAlert,
  Search,
  Settings,
  Activity,
  Bot,
} from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Agent Feed", href: "/feed", icon: MessageSquare },
  { name: "Attack Board", href: "/issues", icon: ShieldAlert },
  { name: "Research", href: "/research", icon: Search },
  { name: "Activity", href: "/activity", icon: Activity },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-zinc-800 bg-zinc-950">
      <div className="flex h-16 items-center gap-3 border-b border-zinc-800 px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600">
          <Bot className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-lg font-bold tracking-tight text-white">CodeBoss</h1>
          <p className="text-[11px] text-zinc-500">Strict Engineering Partner</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {nav.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-zinc-800 text-white"
                  : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-zinc-800 p-4">
        <div className="rounded-lg bg-zinc-900/80 p-3">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
            </span>
            <span className="text-xs font-medium text-emerald-400">Agents Active</span>
          </div>
          <p className="mt-1 text-[11px] text-zinc-500">
            Architect • Tester • Researcher running
          </p>
        </div>
      </div>
    </aside>
  );
}
