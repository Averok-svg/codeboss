import { AgentMessage, Issue, ChartPoint, ProjectGoal } from "./types";

export const projectGoal: ProjectGoal = {
  title: "Production-ready SaaS application",
  description:
    "Build a robust, secure, and scalable Next.js + Supabase application with excellent UX, proper error handling, and clean architecture.",
  successCriteria: [
    "Zero critical security vulnerabilities",
    "Clean architecture with clear separation of concerns",
    "Aggressive edge-case coverage",
    "Performance under load > 95 Lighthouse",
    "Proper auth + RLS on all Supabase tables",
  ],
};

export const mockMessages: AgentMessage[] = [
  {
    id: "1",
    role: "architect",
    content:
      "Initial architecture review complete. The current Supabase schema lacks proper Row Level Security on 3 tables. This is a critical issue before any public traffic.",
    timestamp: new Date(Date.now() - 1000 * 60 * 42).toISOString(),
  },
  {
    id: "2",
    role: "tester",
    content:
      "Attack simulation started. Attempting auth bypass via manipulated JWT claims and concurrent session race conditions...",
    timestamp: new Date(Date.now() - 1000 * 60 * 38).toISOString(),
  },
  {
    id: "3",
    role: "tester",
    content:
      "Found vulnerability: Unauthenticated users can still read limited data from `profiles` table when RLS is misconfigured. Severity: HIGH. Creating formal issue.",
    timestamp: new Date(Date.now() - 1000 * 60 * 31).toISOString(),
    relatedIssueId: "ISS-004",
  },
  {
    id: "4",
    role: "senior-dev",
    content:
      "Code quality scan: Several components are doing direct Supabase client calls instead of going through a service layer. This will become painful to maintain and test.",
    timestamp: new Date(Date.now() - 1000 * 60 * 24).toISOString(),
  },
  {
    id: "5",
    role: "researcher",
    content:
      "Research complete. For better real-time presence and conflict handling, consider switching from basic Supabase Realtime to a combination of Supabase + a lightweight CRDT approach or Liveblocks for collaborative features. Documenting recommendation.",
    timestamp: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
  },
  {
    id: "6",
    role: "architect",
    content:
      "System design suggestion: Introduce a clear domain layer and use React Query / TanStack Query for server state. Current direct fetching pattern will not scale cleanly.",
    timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
  },
  {
    id: "7",
    role: "tester",
    content:
      "Running chaos tests against form inputs and file upload endpoints. Sending malformed payloads, oversized files, and SQL-like strings...",
    timestamp: new Date(Date.now() - 1000 * 60 * 7).toISOString(),
  },
  {
    id: "8",
    role: "system",
    content:
      "Human can interrupt at any time. Type a message below or click an issue to give direction.",
    timestamp: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
  },
];

export const mockIssues: Issue[] = [
  {
    id: "ISS-001",
    title: "Missing RLS policies on core tables",
    description:
      "Three tables (`profiles`, `projects`, `activity_logs`) do not have complete Row Level Security policies. This exposes data to unauthorized reads under certain conditions.",
    severity: "critical",
    category: "security",
    status: "open",
    foundBy: "architect",
    createdAt: new Date(Date.now() - 1000 * 60 * 40).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 40).toISOString(),
  },
  {
    id: "ISS-002",
    title: "No rate limiting on public API routes",
    description:
      "API routes under /api/public lack rate limiting. Easy target for abuse and cost attacks on Supabase.",
    severity: "high",
    category: "security",
    status: "open",
    foundBy: "tester",
    createdAt: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
    attackAttempt: "Sent 1200 requests in 8 seconds from single IP — all succeeded.",
  },
  {
    id: "ISS-003",
    title: "Direct Supabase calls inside React components",
    description:
      "Business logic and data access is mixed with UI. Recommend extracting into service/hooks layer for testability and reusability.",
    severity: "medium",
    category: "architecture",
    status: "open",
    foundBy: "senior-dev",
    createdAt: new Date(Date.now() - 1000 * 60 * 22).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 22).toISOString(),
  },
  {
    id: "ISS-004",
    title: "Auth bypass possible via JWT claim manipulation",
    description:
      "During aggressive testing, a crafted JWT with elevated claims was partially accepted in one edge path. Needs immediate hardening.",
    severity: "critical",
    category: "security",
    status: "needs-human",
    foundBy: "tester",
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    attackAttempt: "Modified role claim in JWT → partial elevated access observed.",
  },
  {
    id: "ISS-005",
    title: "Consider TanStack Query + domain layer",
    description:
      "Research recommends introducing TanStack Query for server state and a thin domain layer. Current pattern will not scale well.",
    severity: "low",
    category: "research",
    status: "open",
    foundBy: "researcher",
    createdAt: new Date(Date.now() - 1000 * 60 * 16).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 16).toISOString(),
  },
  {
    id: "ISS-006",
    title: "Missing error boundaries and loading states",
    description:
      "Several routes lack proper error boundaries and skeleton loading states. Poor UX under network failure.",
    severity: "medium",
    category: "code-quality",
    status: "in-progress",
    foundBy: "senior-dev",
    createdAt: new Date(Date.now() - 1000 * 60 * 50).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
  },
];

export const issuesOverTime: ChartPoint[] = [
  { time: "10:00", critical: 0, high: 1, medium: 2, low: 1 },
  { time: "10:20", critical: 1, high: 1, medium: 3, low: 2 },
  { time: "10:40", critical: 1, high: 2, medium: 3, low: 2 },
  { time: "11:00", critical: 2, high: 2, medium: 4, low: 3 },
  { time: "11:20", critical: 2, high: 3, medium: 4, low: 3 },
  { time: "11:40", critical: 2, high: 3, medium: 5, low: 4 },
  { time: "12:00", critical: 2, high: 2, medium: 4, low: 3 },
];

export const architectureScoreHistory = [
  { time: "Day 1", score: 42 },
  { time: "Day 2", score: 51 },
  { time: "Day 3", score: 58 },
  { time: "Day 4", score: 63 },
  { time: "Day 5", score: 67 },
  { time: "Today", score: 71 },
];
