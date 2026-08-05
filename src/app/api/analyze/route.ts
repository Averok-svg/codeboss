import { NextResponse } from "next/server";
import {
  getConfigFromEnv,
  getRecentCommitsWithDiffs,
  createCodeBossIssue,
  listCodeBossIssues,
} from "@/lib/github";
import { analyzeCommitDiffs, findingToIssueBody } from "@/lib/analyzer";

export async function GET() {
  const config = getConfigFromEnv();
  if (!config) {
    return NextResponse.json({ findings: [], activity: [], error: "Not connected" });
  }

  const activity: { time: string; message: string; type: "info" | "success" | "warning" }[] = [];

  try {
    activity.push({
      time: new Date().toISOString(),
      message: "Starting CODE review of recent commits (fetching diffs)...",
      type: "info",
    });

    // Fetch commits WITH patches — this is the real code Claude wrote
    const commits = await getRecentCommitsWithDiffs(config, 12);
    const withPatch = commits.filter((c: { patchText?: string }) => (c.patchText || "").length > 0);

    activity.push({
      time: new Date().toISOString(),
      message: `Loaded ${commits.length} commits, ${withPatch.length} with diff patches`,
      type: "info",
    });

    const findings = analyzeCommitDiffs(commits);
    const fromDiff = findings.filter((f) => f.source === "diff-scan").length;

    activity.push({
      time: new Date().toISOString(),
      message: `Code review complete: ${findings.length} finding(s) (${fromDiff} from actual diffs)`,
      type: findings.some((f) => f.severity === "critical" || f.severity === "high") ? "warning" : "success",
    });

    const existingIssues = await listCodeBossIssues(config);
    const existingTitles = new Set(
      existingIssues.map((i) => i.title.replace("[CodeBoss] ", "").toLowerCase())
    );

    let createdCount = 0;
    for (const finding of findings) {
      if (finding.severity !== "critical" && finding.severity !== "high") continue;
      const titleKey = finding.title.toLowerCase();
      if (existingTitles.has(titleKey)) continue;
      try {
        await createCodeBossIssue(config, {
          title: finding.title,
          body: findingToIssueBody(finding),
          labels: [finding.severity, finding.category],
        });
        createdCount++;
        activity.push({
          time: new Date().toISOString(),
          message: `Opened issue for code finding: ${finding.title}`,
          type: "success",
        });
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        activity.push({
          time: new Date().toISOString(),
          message: `Failed to create issue: ${message}`,
          type: "warning",
        });
      }
    }

    if (createdCount === 0) {
      activity.push({
        time: new Date().toISOString(),
        message: "No new Critical/High code issues to open",
        type: "info",
      });
    }

    const updatedIssues = await listCodeBossIssues(config);

    return NextResponse.json({
      findings,
      issues: updatedIssues,
      scannedCommits: commits.length,
      diffsLoaded: withPatch.length,
      scannedAt: new Date().toISOString(),
      activity,
      autoCreated: createdCount,
      mode: "diff-code-review",
    });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    activity.push({ time: new Date().toISOString(), message: `Scan error: ${message}`, type: "warning" });
    return NextResponse.json({ findings: [], activity, error: message });
  }
}
