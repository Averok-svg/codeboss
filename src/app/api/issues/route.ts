import { NextResponse } from "next/server";
import { getConfigFromEnv, createCodeBossIssue, listCodeBossIssues } from "@/lib/github";
import { findingToIssueBody, type Finding } from "@/lib/analyzer";

export async function GET() {
  const config = getConfigFromEnv();
  if (!config) {
    return NextResponse.json({ issues: [] });
  }
  const issues = await listCodeBossIssues(config);
  return NextResponse.json({ issues });
}

export async function POST(req: Request) {
  const config = getConfigFromEnv();
  if (!config) {
    return NextResponse.json({ error: "Not connected to GitHub" }, { status: 400 });
  }

  try {
    const body = await req.json();
    const finding = body.finding as Finding;

    if (!finding?.title) {
      return NextResponse.json({ error: "finding required" }, { status: 400 });
    }

    const created = await createCodeBossIssue(config, {
      title: finding.title,
      body: findingToIssueBody(finding),
      labels: [finding.severity, finding.category],
    });

    return NextResponse.json({ ok: true, issue: created });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
