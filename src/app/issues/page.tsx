import { IssuesBoard } from "@/components/dashboard/issues-board";

export default function IssuesPage() {
  return (
    <div className="min-h-screen p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-white">Attack & Issue Board</h1>
        <p className="mt-1 text-sm text-zinc-400">
          Every problem discovered by Architect, Tester, Senior Dev and Researcher
        </p>
      </div>
      <IssuesBoard />
    </div>
  );
}
