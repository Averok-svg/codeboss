/**
 * Free rule-based analyzer.
 * No LLM cost. Scans commit messages and simple patterns
 * then suggests issues for Claude Code to discuss and fix.
 */

export interface Finding {
  id: string;
  title: string;
  description: string;
  severity: "critical" | "high" | "medium" | "low";
  category: "security" | "architecture" | "performance" | "code-quality" | "testing";
  source: "commit-scan" | "heuristic";
}

const SECURITY_PATTERNS = [
  { re: /password|secret|api[_-]?key|token|private[_-]?key/i, title: "Possible secret or credential in commit", severity: "critical" as const },
  { re: /rls|row level security/i, title: "RLS / Row Level Security related change", severity: "high" as const },
  { re: /auth|jwt|session/i, title: "Authentication related change – review carefully", severity: "high" as const },
  { re: /cors|csrf|xss|injection/i, title: "Security keyword detected", severity: "high" as const },
];

const QUALITY_PATTERNS = [
  { re: /todo|fixme|hack|temporary/i, title: "Temporary / TODO left in code", severity: "medium" as const },
  { re: /console\.log|debugger/i, title: "Debug statements may be present", severity: "low" as const },
  { re: /any\b|@ts-ignore|@ts-nocheck/i, title: "Type safety weakened", severity: "medium" as const },
  { re: /force push|hard reset/i, title: "Destructive git operation mentioned", severity: "high" as const },
];

export function analyzeCommits(
  commits: { sha: string; message: string; author: string; date: string }[]
): Finding[] {
  const findings: Finding[] = [];
  const seen = new Set<string>();

  for (const commit of commits) {
    const msg = commit.message;

    for (const p of SECURITY_PATTERNS) {
      if (p.re.test(msg)) {
        const key = `${p.title}-${commit.sha}`;
        if (!seen.has(key)) {
          seen.add(key);
          findings.push({
            id: `F-${commit.sha}-${findings.length}`,
            title: p.title,
            description: `Commit \`${commit.sha}\` by ${commit.author}: "${msg}"\n\nCodeBoss flagged this because the message matched a security-related pattern. Please review the change carefully.`,
            severity: p.severity,
            category: "security",
            source: "commit-scan",
          });
        }
      }
    }

    for (const p of QUALITY_PATTERNS) {
      if (p.re.test(msg)) {
        const key = `${p.title}-${commit.sha}`;
        if (!seen.has(key)) {
          seen.add(key);
          findings.push({
            id: `F-${commit.sha}-${findings.length}`,
            title: p.title,
            description: `Commit \`${commit.sha}\`: "${msg}"\n\nThis looks like a code-quality concern. Claude Code should investigate and discuss before fixing.`,
            severity: p.severity,
            category: "code-quality",
            source: "commit-scan",
          });
        }
      }
    }
  }

  if (findings.length < 2) {
    findings.push({
      id: "F-baseline-arch",
      title: "Architecture & RLS health check recommended",
      description:
        "No critical patterns found in recent commits. Still recommended: verify all Supabase tables have proper RLS policies, rate limiting on public routes, and that data access goes through a service layer.",
      severity: "medium",
      category: "architecture",
      source: "heuristic",
    });
  }

  return findings;
}

export function findingToIssueBody(f: Finding): string {
  return `## CodeBoss Alert (strict multi-reviewer gate)

**Severity:** ${f.severity.toUpperCase()}  
**Category:** ${f.category}  
**Source:** ${f.source}  
**Status gate:** awaiting-grok-review

### Problem
${f.description}

### Automated protocol (do not skip)

**1) Claude Code (fixer)**
- Investigate with \`git show\` on the referenced commit — never trust this description alone
- Comment: genuine vs false positive + evidence
- If genuine: implement the fix (tsc/lint/tests as required)
- Comment a short resolution summary
- **DO NOT CLOSE**
- Keep labels \`codeboss\` + \`awaiting-grok-review\`

**2) CodeBoss Master (Google AI Studio) — required review comments**
After Claude has commented (and fixed if needed), CodeBoss Master must comment on THIS issue:
- **Genuineness review:** is the original flag real or false positive? (with reasons)
- **Resolution review:** if Claude fixed something, was the fix adequate and safe?
- If not OK: comment what must change (do not approve)
- If OK: comment exactly this line (plus a short rationale):
  \`REVIEWED AND FINAL APPROVED BY CODEBOSS MASTER\`

**3) Grok (final gate)**
- Review Claude + CodeBoss Master comments
- If satisfied, comment exactly: \`APPROVED\`
- If not, request changes

**4) Claude Code (close only after both approvals)**
- Close ONLY when the issue comments include BOTH:
  - \`REVIEWED AND FINAL APPROVED BY CODEBOSS MASTER\`
  - \`APPROVED\`
- Then remove \`awaiting-grok-review\` if possible and close
- If either reviewer requested changes: fix, comment again, wait for new approvals

---
*CodeBoss · Claude fixes · CodeBoss Master reviews · Grok final APPROVED · then close*`;
}
