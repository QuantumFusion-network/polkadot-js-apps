# Deployment Guide

This document describes the deployment process for `portal.qfnetwork.xyz` using Cloudflare Pages.

## Overview

The project uses **Cloudflare Pages** for automatic deployment with preview deployments:
- **Production**: `portal.qfnetwork.xyz` (deploys from `qf-master` branch)
- **Preview Deployments**: Automatically created for every feature branch and PR

## Development Workflow

### Step 1: Create Feature Branch

Create a new branch from `qf-master`:

```bash
# Switch to production branch
git checkout qf-master

# Pull latest changes
git pull origin qf-master

# Create feature branch
git checkout -b feature/my-new-feature
```

### Step 2: Develop and Commit

Make your changes and commit:

```bash
# Make changes to files
# ...

# Stage changes
git add .

# Commit
git commit -m "feat: add new feature"
```

### Step 3: Create Pull Request

Push your feature branch and create a Pull Request:

```bash
# Push feature branch
git push origin feature/my-new-feature

# Create PR: feature/my-new-feature → qf-master
```

**What happens automatically?**
- Cloudflare Pages creates preview deployment URLs
- Preview URL is automatically added to the PR by Cloudflare
- You can test your changes on the preview URL before merging

**Where to find preview URLs:**
- GitHub PR → Cloudflare automatically comments with preview links
- GitHub PR → "Checks" tab → Cloudflare Pages deployment status

### Step 4: Test on Preview Deployment

1. **Preview URL** is automatically available in the PR
2. **Test your changes** on the preview environment
3. **Verify everything works** before merging to production
4. Preview URL updates automatically with each new commit in the PR

### Step 5: Merge to Production

After testing and code review approval:

```bash
# Merge PR in GitHub (or via command line)
# PR: feature/my-new-feature → qf-master
```

**What happens automatically?**
- PR is merged into `qf-master`
- Cloudflare Pages automatically deploys to `portal.qfnetwork.xyz`
- Preview deployment is automatically cleaned up

**Important:** Code review is **required** for all PRs to `qf-master` (production branch).

## Cloudflare Pages URLs

### Preview URLs (for Pull Requests)

When you create a PR from any feature branch to `qf-master`, Cloudflare Pages automatically generates preview URLs:

- **Preview URL (commit-specific)**: `https://[commit-hash].portal-prod-67d.pages.dev`
  - Unique URL for each commit
  - Updates with every new commit in PR
  - Use to test a specific commit state
  
- **Branch Preview URL**: `https://[branch-name].portal-prod-67d.pages.dev`
  - Stable URL for the entire branch
  - Always shows the latest commit from the branch
  - Use for continuous testing

**Note:** Preview URLs are automatically added to the PR by Cloudflare and cleaned up when PR is closed.

### Production URL (after merge)

After merging to `qf-master`:
- **Production environment**: `https://portal.qfnetwork.xyz`
  - Deploys automatically when merging to `qf-master`

## URL Summary Table

| Event                          | URL Type       | Example                                          | Purpose                    |
| ------------------------------ | -------------- | ------------------------------------------------ | -------------------------- |
| PR: `feature/xxx` → `qf-master` | Commit Preview | `https://abc123.portal-prod-67d.pages.dev`       | Test specific commit       |
| PR: `feature/xxx` → `qf-master` | Branch Preview | `https://feature-xxx.portal-prod-67d.pages.dev`  | Test latest branch state   |
| Merge to `qf-master`           | Production     | `https://portal.qfnetwork.xyz`                   | Production environment     |

## Quick Reference

### Common Commands

```bash
# Create feature branch
git checkout qf-master && git pull origin qf-master && git checkout -b feature/my-feature

# Push and create PR
git push origin feature/my-feature
# Then create PR in GitHub: feature/my-feature → qf-master
```

### Deployment Flow Diagram

```
┌─────────────────────────────────────────────────────────┐
│  1. Create feature branch from qf-master              │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│  2. Develop → Commit → Push                           │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│  3. Create PR: feature → qf-master                    │
│     → Cloudflare creates preview URL automatically    │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│  4. Test on preview URL                                │
│     (URL added to PR by Cloudflare)                    │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│  5. Code review and approval                           │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│  6. Merge → Deploy to portal.qfnetwork.xyz           │
└─────────────────────────────────────────────────────────┘
```

## Code Review Policy

- **Production branch (`qf-master`)**: Review **required**
  - All PRs must be reviewed and approved before merging
  - Cannot push directly (branch protection)
  - Preview URLs allow testing before merge

## Notes

- **Preview URLs** are automatically created by Cloudflare Pages for every PR
- **Preview URLs** are automatically cleaned up when PR is closed
- **Production deployments** happen automatically after merge to `qf-master`
- **Direct push** to `qf-master` is **not allowed** (requires PR with review)
- Preview deployments use the same build configuration as production, ensuring consistency
- Each commit in a PR gets its own preview URL for isolated testing
- Any feature branch created from `qf-master` will get deployed automatically to the preview env and the URL will be added to the PR by Cloudflare
- When the PR is merged to `qf-master`, Cloudflare Pages will deploy it to production: `portal.qfnetwork.xyz`
