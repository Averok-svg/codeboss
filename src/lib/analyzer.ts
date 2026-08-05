/**
 * CodeBoss code reviewer — reviews REAL commit diffs (Claude code changes),
 * not just commit message wording.
 */

export interface Finding {
  id: string;
  title: string;
  description: string;
  severity: "critical" | "high" | "medium" | "low";
  category: "security" | "architecture" | "performance" | "code-quality" | "testing";
  source: "diff-scan" | "commit-scan" | "heuristic";
  commitSha?: string;
  files?: string[];
}

type CommitForAnalysis = {
  sha: string;
  fullSha?: string;
  message: string;
  author: string;
  date?: string;
  patchText?: string;
  files?: { filename: string; patch?: string; status?: string }[];
};

const DIFF_RULES: {
  re: RegExp;
  title: string;
  severity: Finding["severity"];
  category: Finding["category"];
  why: string;
}[] = [
  {
    re: /(?:api[_-]?key|secret[_-]?key|private[_-]?key|access[_-]?token)\s*[:=]\s*['"][^'"]{8,}['"]/i,
    title: "Hardcoded secret or API key in diff",
    severity: "critical",
    category: "security",
    why: "Literal credential-like assignment found in the patch.",
  },
  {
    re: /Bearer\s+[A-Za-z0-9\-_\.]{20,}/,
    title: "Bearer token appears in code diff",
    severity: "critical",
    category: "security",
    why: "A long Bearer token string was present in the change.",
  },
  {
    re: /-----BEGIN (?:RSA |EC )?PRIVATE KEY-----/,
    title: "Private key material in diff",
    severity: "critical",
    category: "security",
    why: "PEM private key block detected in the commit patch.",
  },
  {
    re: /password\s*[:=]\s*['"][^'"]+['"]/i,
    title: "Hardcoded password in diff",
    severity: "critical",
    category: "security",
    why: "Password assigned as a string literal in code.",
  },
  {
    re: /service_role|SUPABASE_SERVICE_ROLE/i,
    title: "Service role key usage in diff",
    severity: "critical",
    category: "security",
    why: "Service role must never ship to the client; verify server-only usage.",
  },
  {
    re: /dangerouslySetInnerHTML/i,
    title: "dangerouslySetInnerHTML in diff",
    severity: "high",
    category: "security",
    why: "XSS risk if user content is not sanitized.",
  },
  {
    re: /eval\s*\(|new Function\s*\(/,
    title: "eval / dynamic Function in diff",
    severity: "high",
    category: "security",
    why: "Dynamic code execution is high risk.",
  },
  {
    re: /cors\(\s*\{\s*origin\s*:\s*true/i,
    title: "Permissive CORS origin: true",
    severity: "high",
    category: "security",
    why: "Wide-open CORS can expose APIs to any site.",
  },
  {
    re: /@ts-ignore|@ts-nocheck|\bas any\b/,
    title: "Type safety bypass in diff",
    severity: "medium",
    category: "code-quality",
    why: "Type escapes hide bugs; prefer proper types.",
  },
  {
    re: /console\.(log|debug|info)\(/,
    title: "Console debug left in diff",
    severity: "low",
    category: "code-quality",
    why: "Debug logging may leak data in production.",
  },
  {
    re: /\bTODO\b|\bFIXME\b|\bHACK\b/,
    title: "TODO/FIXME/HACK in shipped diff",
    severity: "low",
    category: "code-quality",
    why: "Incomplete work markers in committed code.",
  },
  {
    re: /disable\s+rls|ENABLE ROW LEVEL SECURITY|ROW LEVEL SECURITY/i,
    title: "RLS-related change in diff",
    severity: "high",
    category: "security",
    why: "Row Level Security changes need careful review.",
  },
];

function addedLinesOnly(patch: string): string {
  return patch
    .split("\n")
    .filter((l) => l.startsWith("+") && !l.startsWith("+++"))
    .map((l) => l.slice(1))
    .join("\n");
}

export function analyzeCommitDiffs(commits: CommitForAnalysis[]): Finding[] {
  const findings: Finding[] = [];
  const seen = new Set<string>();

  for (const commit of commits) {
    const sha = (commit.fullSha || commit.sha || "").slice(0, 7);
    const files = commit.files || [];
    const patchAll =
      commit.patchText ||
      files.map((f) => "FILE " + f.filename + "\n" + (f.patch || "")).join("\n\n");

    if (!patchAll.trim()) {
      if (/password|secret|api[_-]?key|token/i.test(commit.message)) {
        const key = "msg-secret-" + sha;
        if (!seen.has(key)) {
          seen.add(key);
          findings.push({
            id: "F-" + sha + "-msg",
            title: "Commit message suggests secrets — no diff loaded",
            description:
              "Commit `" +
              sha +
              "` by " +
              commit.author +
              ": \"" +
              commit.message +
              "\". Diff unavailable; Claude should still run git show.",
            severity: "medium",
            category: "security",
            source: "commit-scan",
            commitSha: sha,
          });
        }
      }
      continue;
    }

    const added = addedLinesOnly(patchAll);
    const scanText = added.length > 20 ? added : patchAll;
    const fileNames = files.map((f) => f.filename).filter(Boolean);

    for (const rule of DIFF_RULES) {
      if (!rule.re.test(scanText)) continue;
      const key = rule.title + "-" + sha;
      if (seen.has(key)) continue;
      seen.add(key);

      const matchedFiles = fileNames.filter((fn) => {
        const filePatch = files.find((f) => f.filename === fn)?.patch || "";
        return rule.re.test(addedLinesOnly(filePatch) || filePatch);
      });

      findings.push({
        id: "F-" + sha + "-" + findings.length,
        title: rule.title,
        description: [
          "**Code review (diff)** on commit `" + sha + "` by " + commit.author,
          "Message: \"" + commit.message.split("\n")[0] + "\"",
          matchedFiles.length
            ? "Files: " + matchedFiles.slice(0, 8).join(", ")
            : fileNames.length
            ? "Files touched: " + fileNames.slice(0, 8).join(", ")
            : "",
          "",
          rule.why,
          "",
          "Claude Code: run git show " + (commit.fullSha || commit.sha) + " and fix or explain why this is safe.",
        ]
          .filter(Boolean)
          .join("\n"),
        severity: rule.severity,
        category: rule.category,
        source: "diff-scan",
        commitSha: sha,
        files: matchedFiles.length ? matchedFiles : fileNames.slice(0, 8),
      });
    }
  }

  if (findings.length === 0) {
    findings.push({
      id: "F-clean-pass",
      title: "Diff scan: no critical patterns in recent patches",
      description:
        "CodeBoss reviewed recent commit diffs (not only messages). No hardcoded secrets, service-role leaks, eval, or obvious dangerous patterns matched. Continue watching new Claude commits.",
      severity: "low",
      category: "code-quality",
      source: "heuristic",
    });
  }

  return findings;
}

export function analyzeCommits(commits: CommitForAnalysis[]): Finding[] {
  return analyzeCommitDiffs(commits);
}

export function findingToIssueBody(f: Finding): string {
  return (
    "## CodeBoss code review\n\n" +
    "**Severity:** " + f.severity.toUpperCase() + "  \n" +
    "**Category:** " + f.category + "  \n" +
    "**Source:** " + f.source +
    (f.commitSha ? "  \n**Commit:** `" + f.commitSha + "`" : "") +
    (f.files && f.files.length ? "  \n**Files:** " + f.files.join(", ") : "") +
    "\n\n### Finding\n" +
    f.description +
    "\n\n### What Claude should do\n" +
    "1. Inspect the real diff (git show)\n" +
    "2. Confirm genuine vs false positive\n" +
    "3. Fix the code if genuine\n" +
    "4. Comment what changed\n\n" +
    "---\n*CodeBoss reviews Claude code via commit diffs*"
  );
}
