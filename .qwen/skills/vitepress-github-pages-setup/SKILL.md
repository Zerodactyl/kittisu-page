---
name: vitepress-github-pages-setup
description: Build and deploy a VitePress project documentation site to GitHub Pages with automated deployment via GitHub Actions
source: auto-skill
extracted_at: '2026-06-03T19:28:53.504Z'
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

### 5. Working with data files (JSON/JS/TS imports)

VitePress pages can import static data from `.json`, `.js`, or `.ts` files using standard ES imports:

```markdown
<script setup>
import data from '../data.json'
</script>

<table>
  <tr v-for="item in data" :key="item.key">
    <td>{{ item.field }}</td>
  </tr>
</table>
```

When importing from a page in a subdirectory, the path is relative to that page (e.g., from `docs/guide/unofficial-devices.md`, `../data.json` resolves to `docs/data.json`).

If the imported file doesn't exist, the build will fail with:

```
Could not resolve "../data.json" from "docs/guide/page.md"
```

#### Common pattern: empty data structure as starter

For community-maintained tables (device lists, compatibility matrices, showcase pages), create an initially empty data file that gets populated over time via PRs:

```json
[]
```

For object-based data:

```json
{}
```

#### Recommended workflow

1. Create the page that imports the data file
2. Create the data file with an empty starter structure (`[]` or `{}`)
3. Build and verify (`npx vitepress build docs`)
4. The page will render an empty table; contributors can add entries later

This avoids the "Could not resolve" build error and lets the page go live immediately.

### 7. Custom Theme & Visual Effects (matching a reference site)

To replicate the visual design of a reference VitePress site (e.g., ReSukiSU), create a custom theme with CSS overrides.

#### Directory structure

```
docs/.vitepress/theme/
├── index.js     # Custom theme entry
├── custom.css   # All visual overrides
```

#### Theme entry (`docs/.vitepress/theme/index.js`)

Use `vitepress/theme-without-fonts` when loading custom fonts to avoid conflicts:

```javascript
import DefaultTheme from 'vitepress/theme-without-fonts'
import './custom.css'

export default DefaultTheme
```

#### CSS variables — brand colors

Override VitePress's CSS custom properties to change the color scheme:

```css
:root {
  /* Brand colors */
  --vp-c-brand-1: #a855f7;       /* purple; pink alternative: #f472b6 */
  --vp-c-brand-2: #9333ea;       /* darker; pink alt: #ec4899 */
  --vp-c-brand-3: #7e22ce;       /* darkest; pink alt: #db2777 */
  --vp-c-brand-soft: rgba(168, 85, 247, 0.14);

  /* Gradient for accents */
  --accent-gradient: linear-gradient(135deg, #a855f7 0%, #d946ef 100%);
  --accent-glow: 0 0 40px rgba(168, 85, 247, 0.3);
}

.dark {
  --vp-c-brand-1: #c084fc;
  --vp-c-brand-2: #a855f7;
  --vp-c-brand-3: #9333ea;
  --vp-c-brand-soft: rgba(192, 132, 252, 0.16);
}
```

#### Fonts (MiSans VF + JetBrains Mono)

Load custom fonts via `@font-face` and set CSS variables:

```css
@font-face {
  font-family: 'MiSans VF';
  src: url('https://cdn.jsdelivr.net/npm/misans-vf-4web@latest/dist/MiSansVF.woff2') format('woff2');
  font-weight: 100 900;
  font-display: swap;
}

:root {
  --vp-font-family-base: 'MiSans VF', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  --vp-font-family-mono: 'JetBrains Mono', monospace;
}
```

Also add the JetBrains Mono CDN link to `config.mjs` head:

```javascript
head: [
  ['link', { rel: 'preconnect', href: 'https://cdn.jsdelivr.net/' }],
  ['link', { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/jetbrains-mono-webfont@latest/jetbrains-mono.css' }],
]
```

#### Hero section effects

Gradient text, floating logo, pulsing glow:

```css
:root {
  --vp-home-hero-name-color: transparent;
  --vp-home-hero-name-background: linear-gradient(135deg, #a855f7 0%, #d946ef 50%, #ec4899 100%);
  --vp-home-hero-image-background-image: radial-gradient(circle, #c084fc 0%, #a855f7 40%, #9333ea 70%, transparent 100%);
  --vp-home-hero-image-filter: blur(56px);
}

@media (min-width: 640px) { :root { --vp-home-hero-image-filter: blur(68px); } }
@media (min-width: 960px) { :root { --vp-home-hero-image-filter: blur(80px); } }

/* Center image bg behind logo */
.VPHero .image-bg {
  transform: translate(-50%, -50%) !important;
  left: 50% !important; top: 50% !important;
  width: 100% !important; height: 100% !important;
}

/* Floating logo animation */
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-12px); }
}
@keyframes pulseGlow {
  0%, 100% { opacity: 0.85; }
  50% { opacity: 1; }
}
.VPHero .image-container { animation: float 5s ease-in-out infinite; }
.VPHero .image-bg { animation: pulseGlow 5s ease-in-out infinite !important; }

/* Action buttons */
.VPHero .actions .VPButton {
  border-radius: 12px !important;
  padding: 12px 24px !important;
  font-weight: 600 !important;
  transition: all 0.3s ease !important;
}
.VPHero .actions .VPButton.brand {
  box-shadow: 0 4px 14px rgba(168, 85, 247, 0.4);
}
.VPHero .actions .VPButton.brand:hover {
  box-shadow: 0 6px 20px rgba(168, 85, 247, 0.55);
  transform: translateY(-2px);
}
.VPHero .actions .VPButton.alt:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
  transform: translateY(-2px);
}
```

#### Feature cards with hover effects

Cards with rounded corners, top gradient bar on hover, lift + shadow, icon containers:

```css
.VPFeature {
  border-radius: 16px !important;
  border: 1px solid var(--vp-c-divider) !important;
  background: var(--vp-c-bg-soft) !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  overflow: hidden;
  position: relative;
}

/* Top accent bar that appears on hover */
.VPFeature::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 3px;
  background: var(--accent-gradient);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.VPFeature:hover {
  border-color: var(--vp-c-brand-1) !important;
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
}
.dark .VPFeature:hover {
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.3);
}
.VPFeature:hover::before { opacity: 1; }

/* Icon container */
.VPFeature .icon {
  font-size: 1.8rem !important;
  display: inline-flex !important;
  align-items: center; justify-content: center;
  width: 52px; height: 52px;
  background: var(--vp-c-brand-soft) !important;
  border-radius: 14px;
  margin-bottom: 12px;
  -webkit-background-clip: unset !important;
  background-clip: unset !important;
  -webkit-text-fill-color: unset !important;
  color: var(--vp-c-brand-2);
  transition: transform 0.3s ease, background 0.3s ease;
}
.VPFeature:hover .icon {
  transform: scale(1.1);
  background: var(--accent-gradient) !important;
  color: white;
}
```

#### Adding icons to feature cards

In `index.md`, use the `icon` field with HTML (requires remixicon CDN in `config.mjs` head):

```markdown
features:
  - title: Feature Name
    details: Description text
    icon: <i class="ri-android-fill"></i>
```

Add the CDN to `config.mjs`:
```javascript
head: [
  ['link', { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/remixicon@latest/fonts/remixicon.css' }],
]
```

Available icon classes: `ri-android-fill`, `ri-smartphone-fill`, `ri-flashlight-fill`, `ri-puzzle-2-fill`, `ri-shield-check-fill`, `ri-telegram-fill`, etc. (see [Remixicon](https://remixicon.com/)).

#### Navigation effects

Blur backdrop, hover underline animation:

```css
.VPNavBar { backdrop-filter: blur(12px) !important; }
.VPNav { border-bottom: 1px solid var(--vp-c-divider); }

.VPNavBarMenuLink { position: relative; }
.VPNavBarMenuLink::after {
  content: "";
  position: absolute;
  bottom: 6px; left: 12px; right: 12px;
  height: 2px;
  background: var(--vp-c-brand-1);
  border-radius: 1px;
  transform: scaleX(0);
  transition: transform 0.25s ease;
  transform-origin: center;
}
.VPNavBarMenuLink:hover::after,
.VPNavBarMenuLink.active::after { transform: scaleX(1); }
```

#### Content enhancements

Headings with accent bars, table styling, inline code:

```css
/* H2 underline accent */
.vp-doc h2 {
  position: relative;
  padding-bottom: 0.5rem;
}
.vp-doc h2::after {
  content: "";
  position: absolute;
  bottom: 0; left: 0;
  width: 48px; height: 3px;
  background: var(--accent-gradient);
  border-radius: 2px;
}
.vp-doc h3 { color: var(--vp-c-brand-2); }

/* Tables */
.vp-doc table {
  border-radius: 12px;
  overflow: hidden;
  border-collapse: separate !important;
  border-spacing: 0;
  border: 1px solid var(--vp-c-divider) !important;
  width: 100%;
}
.vp-doc thead tr { background: var(--vp-c-brand-soft) !important; }
.vp-doc thead th { color: var(--vp-c-brand-2); font-weight: 600; }
.vp-doc tbody tr:nth-child(even) td { background: var(--vp-c-bg-soft); }
.vp-doc tbody tr:hover td { background: var(--vp-c-brand-soft); }

/* Inline code */
.vp-doc :not(pre) > code {
  background-color: var(--vp-c-brand-soft) !important;
  color: var(--vp-c-brand-2) !important;
  border: 1px solid rgba(147, 51, 234, 0.15);
  border-radius: 5px;
}
```

#### Page fade-in animation

```css
.VPContent {
  animation: fadeIn 0.3s ease;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
```

#### Scrollbar styling

```css
::-webkit-scrollbar { width: 8px; height: 8px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: var(--vp-c-divider); border-radius: 4px; }
::-webkit-scrollbar-thumb:hover { background: var(--vp-c-text-3); }
```

### 8. GitHub Actions deployment (`.github/workflows/deploy.yml`)

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

### 9. Update `package.json` scripts

```json
{
  "scripts": {
    "dev": "vitepress dev docs",
    "build": "vitepress build docs",
    "preview": "vitepress preview docs"
  }
}
```

### 10. Handle the fresh-repo scenario

If the repo has no commits yet (just initialized):
- Create all files
- `git add -A && git commit -m "Initial commit: ..."`
- Push to origin: `git push -u origin main`
- The user must enable GitHub Pages in repo settings → Source → GitHub Actions

### 11. Verify locally before pushing

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
