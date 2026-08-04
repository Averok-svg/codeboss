export default function ActivityPage() {
  return (
    <div className="min-h-screen p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-white">Activity Timeline</h1>
        <p className="mt-1 text-sm text-zinc-400">
          Full log of agent actions, commits watched, and human interventions
        </p>
      </div>
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-8 text-center text-sm text-zinc-500">
        Activity timeline will appear here once GitHub is connected and agents start running.
      </div>
    </div>
  );
}
