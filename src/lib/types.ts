export type Severity = "critical" | "high" | "medium" | "low" | "info";

export type AgentRole =
  | "architect"
  | "senior-dev"
  | "tester"
  | "researcher"
  | "system";

export interface AgentMessage {
  id: string;
  role: AgentRole;
  content: string;
  timestamp: string;
  relatedIssueId?: string;
}

export interface Issue {
  id: string;
  title: string;
  description: string;
  severity: Severity;
  category: "architecture" | "security" | "performance" | "bug" | "code-quality" | "research";
  status: "open" | "in-progress" | "fixed" | "wontfix" | "needs-human";
  foundBy: AgentRole;
  createdAt: string;
  updatedAt: string;
  attackAttempt?: string;
}

export interface StatCard {
  label: string;
  value: string | number;
  change?: number;
  trend?: "up" | "down" | "neutral";
  icon?: string;
}

export interface ChartPoint {
  time: string;
  critical: number;
  high: number;
  medium: number;
  low: number;
}

export interface ProjectGoal {
  title: string;
  description: string;
  successCriteria: string[];
}
