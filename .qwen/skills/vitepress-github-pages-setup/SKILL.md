---
name: vitepress-github-pages-setup
description: Build and deploy a VitePress project documentation site to GitHub Pages with automated deployment via GitHub Actions
source: auto-skill
extracted_at: '2026-06-03T19:14:00.000Z'
---

## Goal

Create a project website / documentation site using VitePress, deployed to GitHub Pages, with a look-and-feel matching a reference site (e.g., another project's VitePress site).

## Approach

### 1. Research the reference site first

Before writing any code, use `web_fetch` to analyze the reference site:

```python
# Fetch reference to understand structure, layout, color scheme, sections
web_fetch(url="https://referencesite.github.io/", prompt="Describe the visual design, layout, structure, navigation, and all sections of this website in detail.")
web_fetch(url="https://github.com/owner/repo", prompt="What files are in this repository? What is the repository structure?")
```

Key things to identify from the reference:
- Static site generator (VitePress, VuePress, Hugo, etc.) — look for clues: search modals ("Search K"), nav patterns, theme toggles, language switchers, class names like `VP*`
- Navigation structure (pages, links, sidebar)
- Content sections (hero, features, footer)
- Color scheme and branding

### 2. Set up VitePress project

```bash
npm init -y
npm install vitepress --save-dev
mkdir -p docs/.vitepress docs/public .github/workflows
```

### 3. Configure VitePress (`docs/.vitepress/config.mjs`)

```javascript
import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Project Name',
  description: 'Project description',
  base: '/',  // '/' for user/org site, '/repo/' for project site
  head: [
    ['link', { rel: 'icon', href: '/logo.png' }],
    ['meta', { name: 'theme-color', content: '#a855f7' }],
  ],
  themeConfig: {
    logo: '/logo.png',
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/guide' },
      { text: 'Links', link: '/links' },
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/owner/repo' },
    ],
    footer: {
      message: 'Documented with ❤️ by Project Development',
      copyright: 'Copyright © 2025-2026 Project, under MIT License',
    },
  },
})
```

### 4. Create content pages

**Landing page** (`docs/index.md`) uses the `home` layout:

```markdown
---
layout: home

hero:
  name: Project Name
  text: TAGLINE
  tagline: Subtitle
  image:
    src: /logo.png
    alt: Logo
  actions:
    - theme: brand
      text: Get Started
      link: /guide
    - theme: alt
      text: GitHub
      link: https://github.com/owner/repo

features:
  - title: Feature 1
    details: Description
  - title: Feature 2
    details: Description
---
```

### 5. Set up GitHub Actions deployment (`.github/workflows/deploy.yml`)

```yaml
name: Deploy VitePress site to Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - uses: actions/setup-node@v4
        with:
          node-version: 24
          cache: npm
      - run: npm ci
      - run: npx vitepress build docs
      - uses: actions/upload-pages-artifact@v3
        with:
          path: docs/.vitepress/dist

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    needs: build
    runs-on: ubuntu-latest
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

### 6. Update `package.json` scripts

```json
{
  "scripts": {
    "dev": "vitepress dev docs",
    "build": "vitepress build docs",
    "preview": "vitepress preview docs"
  }
}
```

### 7. Handle the fresh-repo scenario

If the repo has no commits yet (just initialized):
- Create all files
- `git add -A && git commit -m "Initial commit: ..."`
- Push to origin: `git push -u origin main`
- The user must enable GitHub Pages in repo settings → Source → GitHub Actions

### 8. Verify locally before pushing

```bash
npx vitepress build docs
```

Check the output at `docs/.vitepress/dist/` — ensure all pages render and assets are present.

## Troubleshooting & Management

### GitHub Pages not configured (deploy step fails with API error)

If the deploy step fails with an `@octokit/request` error, it likely means GitHub Pages hasn't been enabled in the repo settings yet. Fix via CLI:

```bash
# Enable Pages with GitHub Actions as the build source
gh api -X POST repos/owner/repo/pages -f build_type=workflow

# Verify configuration
gh api repos/owner/repo/pages --jq '{html_url: .html_url, build_type: .build_type}'

# Rerun the failed workflow
gh run rerun <run-id>
```

### Repo renamed — redeploy

When a repo is renamed (e.g., `old-name` → `terebiko.github.io`), the Git remote and Pages deployment both need refreshing:

```bash
# 1. Update local remote
git remote set-url origin https://github.com/owner/new-repo-name

# 2. Push (may show "Everything up-to-date" if rename preserved commits)
git push -u origin main

# 3. Verify Pages config carried over
gh api repos/owner/new-repo-name/pages

# 4. Trigger a fresh workflow run (even if the old one succeeded, the URL changed)
gh workflow run "Deploy VitePress site to Pages" --repo owner/new-repo-name
```

### Checking workflow status via CLI

```bash
# List recent runs
gh run list --repo owner/repo --limit 3 --json conclusion,databaseId,status,displayTitle

# Watch a run until completion
gh run watch <run-id> --repo owner/repo

# View logs for a specific job
gh run view <run-id> --log --job <job-id>

# Get job IDs from a run
gh run view <run-id> --json jobs
```

### GitHub Pages API reference

```bash
# Check current Pages config
gh api repos/owner/repo/pages

# Key fields to check:
# - html_url: the actual site URL
# - build_type: "workflow" means GitHub Actions deploys
# - status: null = deployed and active
# - source: branch/path for branch-based deployment
```

## Why this works

- **VitePress** gives the same modern, clean look as ReSukiSU/KernelSU documentation sites for free
- **GitHub Actions with deploy-pages** is the official recommended approach for GitHub Pages — no need for a separate `gh-pages` branch
- **Research-first approach** prevents guessing the wrong format/site generator
- **CLI-first troubleshooting** saves time: no need to open the browser to check workflow logs or Pages settings
