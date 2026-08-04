import { NextResponse } from "next/server";
import { getConfigFromEnv, getRecentCommits } from "@/lib/github";
import { analyzeCommits } from "@/lib/analyzer";

export async function GET() {
  const config = getConfigFromEnv();
  if (!config) {
    return NextResponse.json({ findings: [], error: "Not connected" });
  }

  try {
    const commits = await getRecentCommits(config, 25);
    const findings = analyzeCommits(commits);
    return NextResponse.json({
      findings,
      scannedCommits: commits.length,
      scannedAt: new Date().toISOString(),
    });
  } catch (e: any) {
    return NextResponse.json({ findings: [], error: e.message });
  }
}
