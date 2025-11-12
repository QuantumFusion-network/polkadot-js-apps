# Deployment Guide

This document describes the deployment process for `portal.qfnetwork.xyz` using Cloudflare Pages.

## Overview

The project uses **Cloudflare Pages** for automatic deployment with two environments:
- **Testing**: `portal-testing.qfnetwork.xyz` (deploys from `qf-master-test` branch)
- **Production**: `portal.qfnetwork.xyz` (deploys from `qf-master` branch)

## Development Workflow

### Step 1: Sync Testing Branch

Before starting development, sync `qf-master-test` with `qf-master`:

```bash
# Switch to testing branch
git checkout qf-master-test

# Pull latest changes
git pull origin qf-master-test

# Merge latest changes from production
git merge origin/qf-master
# or use rebase: git rebase origin/qf-master

# Push updated branch
git push origin qf-master-test
```

**Why?** This ensures your testing environment has the latest production code as a base.

### Step 2: Create Feature Branch

Create a new branch from `qf-master-test`:

```bash
git checkout qf-master-test
git checkout -b feature/my-new-feature
```

### Step 3: Develop and Commit

Make your changes and commit:

```bash
# Make changes to files
# ...

# Stage changes
git add .

# Commit
git commit -m "feat: add new feature"
```

### Step 4: Deploy to Testing Environment

You have two options for deploying to testing:

#### Option A: Pull Request (Recommended for Preview URLs)

Push your feature branch and create a Pull Request:

```bash
# Push feature branch
git push origin feature/my-new-feature

# Create PR: feature/my-new-feature → qf-master-test
# Merge PR (no review required for testing branch)
```

**What happens?** 
- Cloudflare Pages automatically creates preview URLs (see [Preview URLs](#preview-urls) section below)
- After merge: automatic deployment to `portal-testing.qfnetwork.xyz`

**Where to find preview URLs:**
- GitHub PR → "Checks" tab
- Cloudflare automatically comments PR with preview links

#### Option B: Direct Push (Faster, No Preview URLs)

For quick testing without preview URLs, you can push directly:

```bash
# Merge feature branch into qf-master-test locally
git checkout qf-master-test
git merge feature/my-new-feature

# Push directly (no PR needed)
git push origin qf-master-test
```

**What happens?**
- Direct deployment to `portal-testing.qfnetwork.xyz`
- No preview URLs created (this is not a PR)
- Faster workflow for quick iterations

**Where to find deployment URL:**
- Cloudflare Dashboard → `portal-testing` → "Deployments" tab
- Or directly: `https://portal-testing.qfnetwork.xyz`

**Note:** Code review is **not required** for `qf-master-test` branch. Review is only required for PRs to `qf-master` (production).

### Step 5: Test on Testing Environment

After deploying to `qf-master-test`:

1. **Automatic deployment** happens to `portal-testing.qfnetwork.xyz`
2. **Test your changes** on the testing environment
3. **Verify everything works** before deploying to production

### Step 6: Deploy to Production

**Important:** Code review is **required** for all PRs to `qf-master` (production branch).

You have two options:

#### Option A: Standard PR (Recommended)

When all commits from `qf-master-test` should go to production:

```bash
# Create PR: qf-master-test → qf-master
# Code review required - wait for approval
# Merge PR after approval
```

**Result:** All commits from `qf-master-test` are merged into `qf-master` → automatic deployment to `portal.qfnetwork.xyz`

**Note:** This PR requires code review approval before merging.

#### Option B: Selective Cherry-pick

When you need only specific commits in production:

```bash
# 1. Check commits in qf-master-test
git checkout qf-master-test
git log --oneline -10

# 2. Create branch from qf-master
git checkout qf-master
git pull origin qf-master
git checkout -b release/selected-features

# 3. Cherry-pick specific commits
git cherry-pick <commit-hash-1> <commit-hash-2>
# or range: git cherry-pick <commit-1>^..<commit-2>

# 4. Push and create PR
git push origin release/selected-features
# Create PR: release/selected-features → qf-master
```

**Result:** Only selected commits are merged into `qf-master` → deployment to `portal.qfnetwork.xyz`

## Cloudflare Pages URLs

### Preview URLs (for Pull Requests)

When you create a PR, Cloudflare Pages automatically generates preview URLs for testing.

#### For PR: `feature/xxx` → `qf-master-test`

**Project: `portal-testing`** creates:
- **Preview URL (commit-specific)**: `https://[commit-hash].portal-testing.pages.dev`
  - Unique URL for each commit
  - Updates with every new commit in PR
  - Use to test a specific commit state
  
- **Branch Preview URL**: `https://[branch-name].portal-testing.pages.dev`
  - Stable URL for the entire branch
  - Always shows the latest commit from the branch
  - Use for continuous testing

**Project: `portal-prod`** also creates previews:
- **Preview URL**: `https://[commit-hash].portal-prod-67d.pages.dev`
- **Branch Preview URL**: `https://[branch-name].portal-prod-67d.pages.dev`

#### For PR: `qf-master-test` → `qf-master`

**Project: `portal-prod`** creates:
- **Preview URL**: `https://[commit-hash].portal-prod-67d.pages.dev`
- **Branch Preview URL**: `https://qf-master-test.portal-prod-67d.pages.dev`

**Project: `portal-testing`** creates:
- **Preview URL**: `https://[commit-hash].portal-testing.pages.dev`
- **Branch Preview URL**: Not created (because `qf-master-test` is the production branch for `portal-testing`)

### Production URLs (after merge)

After merging to the production branch:

- **Testing environment**: `https://portal-testing.qfnetwork.xyz`
  - Deploys automatically when merging to `qf-master-test`
  
- **Production environment**: `https://portal.qfnetwork.xyz`
  - Deploys automatically when merging to `qf-master`

## URL Summary Table

| Event                                | Project          | URL Type       | Example                                            | Purpose                     |
| ------------------------------------ | ---------------- | -------------- | -------------------------------------------------- | --------------------------- |
| PR: `feature/xxx` → `qf-master-test` | `portal-testing` | Commit Preview | `https://abc123.portal-testing.pages.dev`          | Test specific commit        |
| PR: `feature/xxx` → `qf-master-test` | `portal-testing` | Branch Preview | `https://feature-xxx.portal-testing.pages.dev`     | Test latest branch state    |
| PR: `feature/xxx` → `qf-master-test` | `portal-prod`    | Commit Preview | `https://abc123.portal-prod-67d.pages.dev`         | Preview in prod environment |
| PR: `feature/xxx` → `qf-master-test` | `portal-prod`    | Branch Preview | `https://feature-xxx.portal-prod-67d.pages.dev`    | Preview branch in prod      |
| Merge to `qf-master-test`            | `portal-testing` | Production     | `https://portal-testing.qfnetwork.xyz`             | Testing environment         |
| Direct push to `qf-master-test`      | `portal-testing` | Production     | `https://portal-testing.qfnetwork.xyz`             | Testing environment (no PR) |
| PR: `qf-master-test` → `qf-master`   | `portal-prod`    | Commit Preview | `https://def456.portal-prod-67d.pages.dev`         | Preview before prod deploy  |
| PR: `qf-master-test` → `qf-master`   | `portal-prod`    | Branch Preview | `https://qf-master-test.portal-prod-67d.pages.dev` | Preview branch before prod  |
| Merge to `qf-master`                 | `portal-prod`    | Production     | `https://portal.qfnetwork.xyz`                     | Production environment      |

## Quick Reference

### Common Commands

```bash
# Sync testing branch
git checkout qf-master-test && git pull origin qf-master && git push origin qf-master-test

# Create feature branch
git checkout qf-master-test && git checkout -b feature/my-feature

# Direct push to testing (no PR, no review)
git checkout qf-master-test && git merge feature/my-feature && git push origin qf-master-test

# Cherry-pick commits
git checkout qf-master && git checkout -b release/selected && git cherry-pick <hash1> <hash2>
```

### Deployment Flow Diagram

```
┌─────────────────────────────────────────────────────────┐
│  1. Sync qf-master-test ← qf-master                    │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│  2. Create feature branch from qf-master-test         │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│  3. Develop → Commit → Push                            │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│  4. PR: feature → qf-master-test                      │
│     → Cloudflare creates preview URLs                  │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│  5. Merge → Deploy to portal-testing.qfnetwork.xyz    │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│  6. PR: qf-master-test → qf-master                     │
│     OR Cherry-pick selected commits                    │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│  7. Merge → Deploy to portal.qfnetwork.xyz           │
└─────────────────────────────────────────────────────────┘
```

## Code Review Policy

- **Testing branch (`qf-master-test`)**: No review required
  - Can merge PRs directly or push directly
  - Use for quick testing and iteration
  
- **Production branch (`qf-master`)**: Review **required**
  - All PRs must be reviewed and approved
  - Cannot push directly (branch protection)

## Notes

- **Preview URLs** are automatically created by Cloudflare Pages for every PR
- **Preview URLs** are automatically cleaned up when PR is closed
- **Production deployments** happen automatically after merge to production branch
- Use **cherry-pick** when you need selective commits in production
- Always test on `portal-testing.qfnetwork.xyz` before deploying to production
- **Direct push** to `qf-master-test` is allowed (no review needed)
- **Direct push** to `qf-master` is **not allowed** (requires PR with review)
