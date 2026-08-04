import { cn } from "@/lib/utils";
import { Severity } from "@/lib/types";

const severityStyles: Record<Severity, string> = {
  critical: "bg-red-500/15 text-red-400 border-red-500/30",
  high: "bg-orange-500/15 text-orange-400 border-orange-500/30",
  medium: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
  low: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  info: "bg-zinc-500/15 text-zinc-400 border-zinc-500/30",
};

export function SeverityBadge({ severity }: { severity: Severity }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium uppercase tracking-wide",
        severityStyles[severity]
      )}
    >
      {severity}
    </span>
  );
}

export function StatusBadge({
  status,
}: {
  status: "open" | "in-progress" | "fixed" | "wontfix" | "needs-human";
}) {
  const styles = {
    open: "bg-zinc-500/15 text-zinc-300 border-zinc-500/30",
    "in-progress": "bg-indigo-500/15 text-indigo-300 border-indigo-500/30",
    fixed: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
    wontfix: "bg-zinc-600/20 text-zinc-500 border-zinc-600/30",
    "needs-human": "bg-purple-500/15 text-purple-300 border-purple-500/40 animate-pulse",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium capitalize",
        styles[status]
      )}
    >
      {status.replace("-", " ")}
    </span>
  );
}
