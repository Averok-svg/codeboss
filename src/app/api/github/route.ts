import { NextResponse } from "next/server";
import { getConfigFromEnv, testConnection, getRecentCommits, parseRepoString, createOctokit } from "@/lib/github";

export async function GET() {
  const config = getConfigFromEnv();
  if (!config) {
    return NextResponse.json(
      { connected: false, error: "GITHUB_TOKEN or GITHUB_REPO not set in environment" },
      { status: 200 }
    );
  }

  const connection = await testConnection(config);
  if (!connection.ok) {
    return NextResponse.json({ connected: false, error: connection.error });
  }

  const commits = await getRecentCommits(config, 15);
  return NextResponse.json({
    connected: true,
    repo: connection.name,
    private: connection.private,
    defaultBranch: connection.defaultBranch,
    commits,
  });
}

export async function POST(req: Request) {
  // Allow testing connection with body (for settings UI) – still free
  try {
    const body = await req.json();
    const token = body.token as string;
    const repoStr = body.repo as string;
    const parsed = parseRepoString(repoStr);
    if (!token || !parsed) {
      return NextResponse.json({ ok: false, error: "token and repo (owner/repo) required" });
    }
    const result = await testConnection({ token, owner: parsed.owner, repo: parsed.repo });
    return NextResponse.json(result);
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message });
  }
}
