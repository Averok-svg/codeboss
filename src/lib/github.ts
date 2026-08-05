import { Octokit } from "@octokit/rest";

export interface GitHubConfig {
  token: string;
  owner: string;
  repo: string;
}

export function getConfigFromEnv(): GitHubConfig | null {
  const token = process.env.GITHUB_TOKEN;
  const full = process.env.GITHUB_REPO;
  if (!token || !full) return null;
  const [owner, repo] = full.split("/");
  if (!owner || !repo) return null;
  return { token, owner, repo };
}

export function createOctokit(token: string) {
  return new Octokit({ auth: token });
}

export async function testConnection(config: GitHubConfig) {
  const octokit = createOctokit(config.token);
  try {
    const { data } = await octokit.repos.get({
      owner: config.owner,
      repo: config.repo,
    });
    return {
      ok: true as const,
      name: data.full_name,
      private: data.private,
      defaultBranch: data.default_branch,
      description: data.description || "",
    };
  } catch (err: any) {
    return {
      ok: false as const,
      error: err?.message || "Failed to connect to GitHub",
    };
  }
}

export async function getRecentCommits(config: GitHubConfig, count = 20) {
  const octokit = createOctokit(config.token);
  const { data } = await octokit.repos.listCommits({
    owner: config.owner,
    repo: config.repo,
    per_page: count,
  });
  return data.map((c) => ({
    sha: c.sha.slice(0, 7),
    fullSha: c.sha,
    message: c.commit.message.split("\n")[0],
    author: c.commit.author?.name || c.author?.login || "unknown",
    date: c.commit.author?.date || new Date().toISOString(),
    url: c.html_url,
  }));
}

export async function createCodeBossIssue(
  config: GitHubConfig,
  issue: { title: string; body: string; labels?: string[] }
) {
  const octokit = createOctokit(config.token);
  const { data } = await octokit.issues.create({
    owner: config.owner,
    repo: config.repo,
    title: `[CodeBoss] ${issue.title}`,
    body: `${issue.body}\n\n---\n*Created automatically by CodeBoss*`,
    labels: ["codeboss", "awaiting-grok-review", ...(issue.labels || [])],
  });
  return {
    number: data.number,
    url: data.html_url,
    title: data.title,
  };
}

export async function listCodeBossIssues(config: GitHubConfig) {
  const octokit = createOctokit(config.token);
  try {
    const { data } = await octokit.issues.listForRepo({
      owner: config.owner,
      repo: config.repo,
      labels: "codeboss",
      state: "open",
      per_page: 30,
    });
    return data.map((i) => ({
      number: i.number,
      title: i.title,
      body: i.body || "",
      url: i.html_url,
      createdAt: i.created_at,
      labels: i.labels.map((l) => (typeof l === "string" ? l : l.name || "")),
    }));
  } catch {
    return [];
  }
}

export function parseRepoString(repo: string): { owner: string; repo: string } | null {
  const cleaned = repo
    .trim()
    .replace(/^https?:\/\/github\.com\//, "")
    .replace(/\.git$/, "");
  const parts = cleaned.split("/");
  if (parts.length >= 2 && parts[0] && parts[1]) {
    return { owner: parts[0], repo: parts[1] };
  }
  return null;
}

export async function getCommitDiff(config: GitHubConfig, sha: string) {
  const octokit = createOctokit(config.token);
  const { data } = await octokit.repos.getCommit({
    owner: config.owner,
    repo: config.repo,
    ref: sha,
  });
  const files = (data.files || []).map((f) => ({
    filename: f.filename,
    status: f.status,
    additions: f.additions,
    deletions: f.deletions,
    patch: f.patch || "",
  }));
  return {
    sha: data.sha,
    message: data.commit.message,
    author: data.commit.author?.name || data.author?.login || "unknown",
    files,
    // combined patch text for scanning (capped)
    patchText: files
      .map((f) => `FILE ${f.filename}\n${f.patch}`)
      .join("\n\n")
      .slice(0, 80000),
  };
}

export async function getRecentCommitsWithDiffs(config: GitHubConfig, count = 12) {
  const commits = await getRecentCommits(config, count);
  const detailed = [];
  for (const c of commits) {
    try {
      const diff = await getCommitDiff(config, c.fullSha || c.sha);
      detailed.push({ ...c, ...diff, fullSha: c.fullSha || diff.sha });
    } catch {
      detailed.push({ ...c, files: [], patchText: "" });
    }
  }
  return detailed;
}

