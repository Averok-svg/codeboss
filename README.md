# CodeBoss (Free Version)

Real-time automated monitor for your private GitHub repo.  
Zero extra cost. Uses only free GitHub API + your existing Claude Code subscription.

## What it does

1. Watches your private GitHub commits
2. Scans them with free rule-based analysis (security, quality, architecture hints)
3. Lets you create GitHub Issues with one click
4. Claude Code (already paid) fixes the issues
5. Beautiful real-time dashboard with live updates

## Quick Start (Local)

```bash
cd codeboss
npm install
cp .env.example .env.local
# Edit .env.local and add:
# GITHUB_TOKEN=ghp_...
# GITHUB_REPO=username/repo
npm run dev
```

Open http://localhost:3000

## Deploy to Vercel (Free)

1. Push this folder to a GitHub repo
2. Go to vercel.com → New Project → Import the repo
3. Add Environment Variables:
   - `GITHUB_TOKEN` = your GitHub PAT (repo scope)
   - `GITHUB_REPO` = `owner/repo`
4. Deploy

You get a live URL. No credit card needed for hobby tier.

## Claude Code side

In your app project, add to `CLAUDE.md`:

```
You are working under CodeBoss supervision.
Always check open GitHub issues labeled "codeboss".
Fix them with priority and close when done.
Ask me if unsure.
```

Then just say in Claude Code:
`Fix open issues labeled codeboss`

## Cost

| Item | Cost |
|------|------|
| CodeBoss dashboard | Free (Vercel hobby) |
| GitHub API + Issues | Free |
| Analysis | Free (rule-based) |
| Actual code fixes | Your existing Claude subscription |

No Anthropic API key required. No extra charges.
