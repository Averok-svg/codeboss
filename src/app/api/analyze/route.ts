import { NextResponse } from "next/server";
import { getConfigFromEnv, getRecentCommits, createCodeBossIssue, listCodeBossIssues } from "@/lib/github";
import { analyzeCommits, findingToIssueBody } from "@/lib/analyzer";

export async function GET() {
  const config = getConfigFromEnv();
  if (!config) {
    return NextResponse.json({ findings: [], activity: [], error: "Not connected" });
  }

  const activity: { time: string; message: string; type: "info" | "success" | "warning" }[] = [];

  try {
    activity.push({ time: new Date().toISOString(), message: "Starting scan of recent commits...", type: "info" });

    const commits = await getRecentCommits(config, 25);
    activity.push({ time: new Date().toISOString(), message: `Scanned ${commits.length} recent commits`, type: "info" });

    const findings = analyzeCommits(commits);
    activity.push({ time: new Date().toISOString(), message: `Found ${findings.length} potential issues`, type: findings.length > 0 ? "warning" : "success" });

    // Auto-create issues for Critical and High only
    const existingIssues = await listCodeBossIssues(config);
    const existingTitles = new Set(existingIssues.map((i) => i.title.replace("[CodeBoss] ", "").toLowerCase()));

    let createdCount = 0;
    for (const finding of findings) {
      if (finding.severity === "critical" || finding.severity === "high") {
        const titleKey = finding.title.toLowerCase();
        if (!existingTitles.has(titleKey)) {
          try {
            await createCodeBossIssue(config, {
              title: finding.title,
              body: findingToIssueBody(finding),
              labels: [finding.severity, finding.category],
            });
            createdCount++;
            activity.push({
              time: new Date().toISOString(),
              message: `Auto-created GitHub Issue for: ${finding.title}`,
              type: "success",
            });
          } catch (err: any) {
            activity.push({
              time: new Date().toISOString(),
              message: `Failed to create issue: ${err.message}`,
              type: "warning",
            });
          }
        }
      }
    }

    if (createdCount === 0) {
      activity.push({ time: new Date().toISOString(), message: "No new Critical/High issues to create", type: "info" });
    } else {
      activity.push({ time: new Date().toISOString(), message: `Created ${createdCount} new GitHub Issue(s)`, type: "success" });
    }

    const updatedIssues = await listCodeBossIssues(config);

    return NextResponse.json({
      findings,
      issues: updatedIssues,
      scannedCommits: commits.length,
      scannedAt: new Date().toISOString(),
      activity,
      autoCreated: createdCount,
    });
  } catch (e: any) {
    activity.push({ time: new Date().toISOString(), message: `Scan error: ${e.message}`, type: "warning" });
    return NextResponse.json({ findings: [], activity, error: e.message });
  }
}
