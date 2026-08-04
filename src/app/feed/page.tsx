import { AgentFeed } from "@/components/dashboard/agent-feed";

export default function FeedPage() {
  return (
    <div className="min-h-screen p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-white">Agent Discussion Feed</h1>
        <p className="mt-1 text-sm text-zinc-400">
          Full conversation between Architect, Aggressive Tester, Senior Dev and Researcher
        </p>
      </div>
      <div className="h-[calc(100vh-12rem)] max-w-3xl">
        <AgentFeed />
      </div>
    </div>
  );
}
