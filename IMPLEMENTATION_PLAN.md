# Musings Blog - Implementation Plan

> **Purpose**: Step-by-step guide to implement the blog from scratch.
> **Audience**: Developer with strong programming skills but zero context on this codebase.
> **Principles**: DRY, YAGNI, TDD, frequent commits.

---

## Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [Architecture Overview](#2-architecture-overview)
3. [Development Environment Setup](#3-development-environment-setup)
4. [Phase 1: Core HTML Structure](#4-phase-1-core-html-structure)
5. [Phase 2: CSS Styling](#5-phase-2-css-styling)
6. [Phase 3: JavaScript Router](#6-phase-3-javascript-router)
7. [Phase 4: Content Rendering](#7-phase-4-content-rendering)
8. [Phase 5: Sample Content](#8-phase-5-sample-content)
9. [Testing Strategy](#9-testing-strategy)
10. [Deployment](#10-deployment)
11. [Task Checklist](#11-task-checklist)

---

## 1. Prerequisites

### What You Need Installed

```bash
# Check these are available:
node --version    # v18+ recommended (for local server only)
git --version     # Any recent version
```

### Files You Should Read First

| File | Why |
|------|-----|
| `DESIGN.md` | Full specification - read lines 1-250 minimum |
| This file | You're here |

### Key Concepts to Understand

1. **Single-Page Application (SPA)**: One HTML file, JavaScript handles all navigation
2. **Hash routing**: URLs like `#/post/hello-world` - the `#` part is client-side only
3. **Frontmatter**: YAML metadata at the top of markdown files between `---` delimiters
4. **Manifest file**: `content.json` lists all content so we don't scan directories at runtime

---

## 2. Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        Browser                                   │
├─────────────────────────────────────────────────────────────────┤
│  index.html                                                      │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐ │
│  │   <style>   │  │   <main>    │  │       <script>          │ │
│  │  ~200 lines │  │   #app      │  │  Router + Renderer      │ │
│  │  CSS inline │  │  (renders   │  │  ~300 lines JS inline   │ │
│  └─────────────┘  │   here)     │  └─────────────────────────┘ │
│                   └─────────────┘                               │
├─────────────────────────────────────────────────────────────────┤
│  CDN Dependencies (loaded via <script src="...">)               │
│  • marked.js (~8kb) - converts markdown to HTML                 │
│  • js-yaml (~10kb) - parses YAML frontmatter                    │
│  • highlight.js (~30kb) - syntax highlighting for code          │
└─────────────────────────────────────────────────────────────────┘
            │
            │ fetch()
            ▼
┌─────────────────────────────────────────────────────────────────┐
│  Static Files (same directory)                                   │
│  ┌──────────────┐  ┌──────────────────────────────────────────┐ │
│  │ content.json │  │ content/                                  │ │
│  │ (manifest)   │  │   posts/*.md                              │ │
│  │              │  │   quotes/*.md                             │ │
│  │              │  │   snippets/*.md                           │ │
│  │              │  │   images/**/*                             │ │
│  └──────────────┘  └──────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

### Data Flow

1. User loads `index.html`
2. JS fetches `content.json` → gets list of all posts
3. Router reads `window.location.hash` → determines what to render
4. If viewing a post: fetch the `.md` file → parse frontmatter → render markdown
5. User clicks link → hash changes → router fires → repeat step 4

---

## 3. Development Environment Setup

### Task 3.1: Create Local Server Script

**File to create**: `package.json`

**Why**: You need a local HTTP server. Browsers block `fetch()` for `file://` URLs.

```json
{
  "name": "musings-blog",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "serve": "npx serve .",
    "test": "npx playwright test",
    "test:ui": "npx playwright test --ui"
  },
  "devDependencies": {
    "@playwright/test": "^1.40.0"
  }
}
```

**Commit after creating this file:**
```bash
git add package.json
git commit -m "Add package.json with serve and test scripts"
```

### Task 3.2: Install Dependencies

```bash
npm install
npx playwright install chromium  # Only chromium needed for our tests
```

### Task 3.3: Create .gitignore

**File to create**: `.gitignore`

```
node_modules/
test-results/
playwright-report/
.DS_Store
```

**Commit:**
```bash
git add .gitignore
git commit -m "Add .gitignore for node_modules and test artifacts"
```

---

## 4. Phase 1: Core HTML Structure

### Task 4.1: Create Minimal index.html

**File to create**: `index.html`

**Goal**: Get a valid HTML page that loads CDN dependencies. No styling yet.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Musings</title>

  <!-- Highlight.js theme (must be in head for FOUC prevention) -->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11/build/styles/github.min.css">

  <style>
    /* CSS will go here - Task 5 */
    body { font-family: system-ui, sans-serif; }
  </style>
</head>
<body>
  <header>
    <h1><a href="#/">Musings</a></h1>
    <nav>
      <a href="#/">Home</a>
      <a href="#/archive">Archive</a>
      <a href="#/tags">Tags</a>
      <a href="#/about">About</a>
    </nav>
  </header>

  <main id="app">
    <p>Loading...</p>
  </main>

  <footer>
    <p>&copy; 2026</p>
  </footer>

  <!-- Dependencies from CDN -->
  <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/js-yaml@4/dist/js-yaml.min.js"></script>
  <script src="https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11/build/highlight.min.js"></script>

  <script>
    // JavaScript will go here - Tasks 6 and 7
    console.log('Dependencies loaded:', typeof marked, typeof jsyaml, typeof hljs);
  </script>
</body>
</html>
```

### How to Test Task 4.1

```bash
npm run serve
# Open http://localhost:3000 in browser
# Check browser console - should see: "Dependencies loaded: object object object"
```

**Commit:**
```bash
git add index.html
git commit -m "Add minimal index.html with CDN dependencies"
```

---

## 5. Phase 2: CSS Styling

### Task 5.1: Add Base Styles

**File to modify**: `index.html` (the `<style>` block)

**Goal**: Readable typography, proper spacing. Reference: `DESIGN.md` lines 321-388.

Replace the `<style>` block with:

```css
<style>
  /* ============================================
     BASE STYLES
     ============================================ */

  * {
    box-sizing: border-box;
  }

  html {
    font-size: 16px;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, sans-serif;
    line-height: 1.6;
    color: #333;
    background: #fff;
    margin: 0;
    padding: 0 1rem;
    max-width: 65ch;
    margin-left: auto;
    margin-right: auto;
  }

  /* ============================================
     HEADER & NAVIGATION
     ============================================ */

  header {
    padding: 2rem 0 1rem;
    border-bottom: 1px solid #eee;
    margin-bottom: 2rem;
  }

  header h1 {
    margin: 0 0 0.5rem;
    font-size: 1.5rem;
  }

  header h1 a {
    color: inherit;
    text-decoration: none;
  }

  nav {
    display: flex;
    gap: 1rem;
  }

  nav a {
    color: #666;
    text-decoration: none;
  }

  nav a:hover {
    color: #333;
    text-decoration: underline;
  }

  /* ============================================
     MAIN CONTENT AREA
     ============================================ */

  main {
    min-height: 60vh;
  }

  /* ============================================
     POST LIST (HOME PAGE)
     ============================================ */

  .post-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .post-item {
    margin-bottom: 2rem;
  }

  .post-date {
    font-size: 0.875rem;
    color: #666;
    margin-bottom: 0.25rem;
  }

  .post-title {
    font-size: 1.25rem;
    margin: 0;
  }

  .post-title a {
    color: #333;
    text-decoration: none;
  }

  .post-title a:hover {
    text-decoration: underline;
  }

  .post-tags {
    font-size: 0.75rem;
    color: #999;
    font-family: monospace;
    margin-top: 0.25rem;
  }

  .post-tags a {
    color: inherit;
    text-decoration: none;
  }

  .post-tags a:hover {
    text-decoration: underline;
  }

  /* ============================================
     SINGLE POST VIEW
     ============================================ */

  article h1 {
    font-size: 2rem;
    margin-bottom: 0.5rem;
  }

  article .meta {
    color: #666;
    font-size: 0.875rem;
    margin-bottom: 2rem;
  }

  article img {
    max-width: 100%;
    height: auto;
    display: block;
    margin: 1.5rem auto;
    border-radius: 4px;
  }

  article img:not([src$=".svg"]) {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  /* ============================================
     TYPOGRAPHY
     ============================================ */

  h1, h2, h3, h4 {
    line-height: 1.3;
  }

  a {
    color: #0066cc;
  }

  blockquote {
    border-left: 3px solid #ddd;
    margin-left: 0;
    padding-left: 1rem;
    color: #555;
    font-style: italic;
  }

  /* ============================================
     CODE BLOCKS
     ============================================ */

  pre {
    background: #f6f8fa;
    padding: 1rem;
    border-radius: 4px;
    overflow-x: auto;
    font-size: 0.875rem;
  }

  code {
    font-family: "SF Mono", Consolas, "Liberation Mono", Menlo, monospace;
    font-size: 0.875em;
  }

  :not(pre) > code {
    background: #f0f0f0;
    padding: 0.125rem 0.375rem;
    border-radius: 3px;
  }

  /* ============================================
     FOOTER
     ============================================ */

  footer {
    border-top: 1px solid #eee;
    padding: 2rem 0;
    margin-top: 3rem;
    color: #999;
    font-size: 0.875rem;
  }

  /* ============================================
     ARCHIVE PAGE
     ============================================ */

  .archive-year {
    font-size: 1.5rem;
    margin-top: 2rem;
    margin-bottom: 1rem;
    color: #333;
  }

  .archive-list {
    list-style: none;
    padding: 0;
  }

  .archive-item {
    display: flex;
    gap: 1rem;
    margin-bottom: 0.5rem;
  }

  .archive-item time {
    color: #999;
    font-family: monospace;
    font-size: 0.875rem;
    white-space: nowrap;
  }

  /* ============================================
     TAG CLOUD
     ============================================ */

  .tag-cloud {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .tag-cloud a {
    background: #f0f0f0;
    padding: 0.25rem 0.75rem;
    border-radius: 1rem;
    text-decoration: none;
    color: #555;
    font-size: 0.875rem;
  }

  .tag-cloud a:hover {
    background: #e0e0e0;
  }

  /* ============================================
     LOADING & ERROR STATES
     ============================================ */

  .loading {
    color: #999;
    font-style: italic;
  }

  .error {
    color: #c00;
    background: #fee;
    padding: 1rem;
    border-radius: 4px;
  }
</style>
```

### How to Test Task 5.1

```bash
npm run serve
# Visual check: Header should have border, text should be readable
# Page should be centered, max-width ~65 characters
```

**Commit:**
```bash
git add index.html
git commit -m "Add CSS styles for typography, layout, and components"
```

---

## 6. Phase 3: JavaScript Router

### Understanding the Router

The router does three things:
1. Listen for hash changes (`window.onhashchange`)
2. Parse the hash into route + params (`#/post/hello` → `{route: 'post', slug: 'hello'}`)
3. Call the appropriate render function

### Task 6.1: Implement Basic Router

**File to modify**: `index.html` (the `<script>` block at the bottom)

Replace the script with:

```javascript
<script>
  // ============================================
  // GLOBAL STATE
  // ============================================

  const state = {
    manifest: null,      // Will hold content.json data
    cache: new Map(),    // Cache for fetched markdown files
  };

  // ============================================
  // ROUTER
  // ============================================

  function parseHash() {
    const hash = window.location.hash.slice(1) || '/';
    const parts = hash.split('/').filter(Boolean);

    if (parts.length === 0) {
      return { route: 'home' };
    }

    switch (parts[0]) {
      case 'post':
        return { route: 'post', slug: parts[1] };
      case 'quote':
        return { route: 'quote', slug: parts[1] };
      case 'snippet':
        return { route: 'snippet', slug: parts[1] };
      case 'tutorial':
        return { route: 'tutorial', slug: parts.slice(1).join('/') };
      case 'archive':
        return { route: 'archive' };
      case 'tags':
        return { route: 'tags' };
      case 'tag':
        return { route: 'tag', tag: parts[1] };
      case 'about':
        return { route: 'about' };
      default:
        return { route: '404' };
    }
  }

  async function router() {
    const { route, slug, tag } = parseHash();
    const app = document.getElementById('app');

    // Ensure manifest is loaded
    if (!state.manifest) {
      app.innerHTML = '<p class="loading">Loading...</p>';
      try {
        const res = await fetch('content.json');
        state.manifest = await res.json();
      } catch (e) {
        app.innerHTML = '<p class="error">Failed to load content manifest.</p>';
        return;
      }
    }

    // Route to appropriate view
    switch (route) {
      case 'home':
        renderHome();
        break;
      case 'post':
      case 'quote':
      case 'snippet':
        await renderSinglePost(slug, route);
        break;
      case 'tutorial':
        await renderSinglePost(slug, 'tutorial');
        break;
      case 'archive':
        renderArchive();
        break;
      case 'tags':
        renderTagCloud();
        break;
      case 'tag':
        renderTagPage(tag);
        break;
      case 'about':
        renderAbout();
        break;
      default:
        app.innerHTML = '<p class="error">Page not found.</p>';
    }
  }

  // ============================================
  // INITIALIZATION
  // ============================================

  window.addEventListener('hashchange', router);
  window.addEventListener('DOMContentLoaded', router);
</script>
```

### How to Test Task 6.1

At this point, the router will fail because render functions don't exist yet. That's okay.

```bash
npm run serve
# Open browser console
# Type: parseHash()
# Should return: { route: 'home' }
# Change URL to #/post/test, run parseHash() again
# Should return: { route: 'post', slug: 'test' }
```

**Commit:**
```bash
git add index.html
git commit -m "Add hash-based router with route parsing"
```

---

## 7. Phase 4: Content Rendering

### Task 7.1: Add Utility Functions

**File to modify**: `index.html` (add inside the `<script>` block, after GLOBAL STATE)

```javascript
  // ============================================
  // UTILITY FUNCTIONS
  // ============================================

  function formatDate(dateStr) {
    const date = new Date(dateStr + 'T00:00:00'); // Ensure consistent parsing
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  function parseFrontmatter(content) {
    const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    if (!match) {
      return { meta: {}, body: content };
    }
    const meta = jsyaml.load(match[1]);
    const body = match[2];
    return { meta, body };
  }

  async function fetchContent(path) {
    if (state.cache.has(path)) {
      return state.cache.get(path);
    }
    const res = await fetch(path);
    if (!res.ok) throw new Error(`Failed to fetch ${path}`);
    const text = await res.text();
    state.cache.set(path, text);
    return text;
  }

  function renderMarkdown(md) {
    const html = marked.parse(md);
    return html;
  }

  function getContentBySlug(slug, type) {
    return state.manifest.content.find(
      item => item.slug === slug && (type ? item.type === type : true)
    );
  }

  function getContentByType(type) {
    return state.manifest.content.filter(item => item.type === type);
  }

  function getAllContent() {
    return state.manifest.content;
  }

  function getContentByTag(tag) {
    return state.manifest.content.filter(
      item => item.tags && item.tags.includes(tag)
    );
  }

  function getAllTags() {
    const tagCounts = {};
    state.manifest.content.forEach(item => {
      (item.tags || []).forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });
    return tagCounts;
  }
```

**Commit:**
```bash
git add index.html
git commit -m "Add utility functions for content fetching and parsing"
```

### Task 7.2: Add Render Functions

**File to modify**: `index.html` (add inside the `<script>` block, before INITIALIZATION)

```javascript
  // ============================================
  // RENDER FUNCTIONS
  // ============================================

  function renderHome() {
    const app = document.getElementById('app');
    const content = getAllContent()
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    if (content.length === 0) {
      app.innerHTML = '<p>No posts yet.</p>';
      return;
    }

    const html = `
      <ul class="post-list">
        ${content.map(item => `
          <li class="post-item">
            <div class="post-date">${formatDate(item.date)}</div>
            <h2 class="post-title">
              <a href="#/${item.type}/${item.slug}">${item.title}</a>
            </h2>
            <div class="post-tags">
              ${(item.tags || []).map(tag =>
                `<a href="#/tag/${tag}">${tag}</a>`
              ).join('  ')}
            </div>
          </li>
        `).join('')}
      </ul>
    `;
    app.innerHTML = html;
  }

  async function renderSinglePost(slug, type) {
    const app = document.getElementById('app');
    const item = getContentBySlug(slug, type);

    if (!item) {
      app.innerHTML = '<p class="error">Post not found.</p>';
      return;
    }

    app.innerHTML = '<p class="loading">Loading...</p>';

    try {
      const content = await fetchContent(item.path);
      const { meta, body } = parseFrontmatter(content);
      const html = renderMarkdown(body);

      app.innerHTML = `
        <article>
          <h1>${meta.title || item.title}</h1>
          <div class="meta">
            ${formatDate(meta.date || item.date)}
            ${meta.tags ? ' · ' + meta.tags.join(', ') : ''}
          </div>
          <div class="content">
            ${html}
          </div>
        </article>
      `;

      // Apply syntax highlighting to code blocks
      document.querySelectorAll('pre code').forEach(block => {
        hljs.highlightElement(block);
      });
    } catch (e) {
      app.innerHTML = `<p class="error">Failed to load post: ${e.message}</p>`;
    }
  }

  function renderArchive() {
    const app = document.getElementById('app');
    const content = getAllContent()
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    // Group by year
    const byYear = {};
    content.forEach(item => {
      const year = item.date.slice(0, 4);
      if (!byYear[year]) byYear[year] = [];
      byYear[year].push(item);
    });

    const years = Object.keys(byYear).sort((a, b) => b - a);

    const html = years.map(year => `
      <h2 class="archive-year">${year}</h2>
      <ul class="archive-list">
        ${byYear[year].map(item => `
          <li class="archive-item">
            <time>${item.date.slice(5)}</time>
            <a href="#/${item.type}/${item.slug}">${item.title}</a>
          </li>
        `).join('')}
      </ul>
    `).join('');

    app.innerHTML = html || '<p>No posts yet.</p>';
  }

  function renderTagCloud() {
    const app = document.getElementById('app');
    const tagCounts = getAllTags();
    const tags = Object.keys(tagCounts).sort();

    if (tags.length === 0) {
      app.innerHTML = '<p>No tags yet.</p>';
      return;
    }

    const html = `
      <h1>Tags</h1>
      <div class="tag-cloud">
        ${tags.map(tag => `
          <a href="#/tag/${tag}">${tag} (${tagCounts[tag]})</a>
        `).join('')}
      </div>
    `;
    app.innerHTML = html;
  }

  function renderTagPage(tag) {
    const app = document.getElementById('app');
    const content = getContentByTag(tag)
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    if (content.length === 0) {
      app.innerHTML = `<p>No posts tagged "${tag}".</p>`;
      return;
    }

    const html = `
      <h1>Tagged: ${tag}</h1>
      <ul class="post-list">
        ${content.map(item => `
          <li class="post-item">
            <div class="post-date">${formatDate(item.date)}</div>
            <h2 class="post-title">
              <a href="#/${item.type}/${item.slug}">${item.title}</a>
            </h2>
          </li>
        `).join('')}
      </ul>
    `;
    app.innerHTML = html;
  }

  function renderAbout() {
    const app = document.getElementById('app');
    app.innerHTML = `
      <h1>About</h1>
      <p>A minimalist blog about software, technology, and ideas.</p>
      <p>Built with vanilla JavaScript, no framework required.</p>
    `;
  }
```

**Commit:**
```bash
git add index.html
git commit -m "Add render functions for all views"
```

---

## 8. Phase 5: Sample Content

### Task 8.1: Create Directory Structure

```bash
mkdir -p content/posts content/quotes content/snippets content/tutorials content/images/posts content/images/shared
```

**Commit:**
```bash
git add content/.gitkeep 2>/dev/null || true  # May not have files yet
git commit -m "Create content directory structure" --allow-empty
```

### Task 8.2: Create content.json Manifest

**File to create**: `content.json`

```json
{
  "site": {
    "title": "Musings",
    "author": "Your Name",
    "description": "A personal blog about software, technology, and ideas",
    "baseUrl": "https://username.github.io/musings-blog"
  },
  "content": [
    {
      "slug": "ai-coding-guardians",
      "path": "content/posts/2026-02-04-ai-coding-guardians.md",
      "type": "post",
      "title": "Quis Custodiet Ipsos Custodes? And the Normalization of Deviance in AI Coding",
      "date": "2026-02-04",
      "tags": ["ai", "software-engineering", "philosophy", "automation"]
    }
  ]
}
```

**Commit:**
```bash
git add content.json
git commit -m "Add content.json manifest with first post"
```

### Task 8.3: Create Sample Blog Post

**File to create**: `content/posts/2026-02-04-ai-coding-guardians.md`

This is the long-form post provided in the requirements. See the actual file created separately.

**Commit:**
```bash
git add content/posts/
git commit -m "Add blog post: AI Coding Guardians"
```

---

## 9. Testing Strategy

### Why Test a Static Blog?

1. **Prevents regressions**: Changes to JS/CSS don't break existing functionality
2. **Documents behavior**: Tests show how the blog is supposed to work
3. **Catches edge cases**: Empty states, missing content, malformed markdown

### Test Categories

| Type | What It Tests | Tool |
|------|--------------|------|
| Unit | Utility functions (formatDate, parseFrontmatter) | Inline in browser console or Node |
| Integration | Router + rendering work together | Playwright |
| Visual | Layout doesn't break | Manual or screenshot comparison |

### Task 9.1: Set Up Playwright

**File to create**: `playwright.config.js`

```javascript
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30000,
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'npx serve . -l 3000',
    port: 3000,
    reuseExistingServer: true,
  },
});
```

**Commit:**
```bash
git add playwright.config.js
git commit -m "Add Playwright configuration"
```

### Task 9.2: Create Test Directory and First Test

**File to create**: `tests/blog.spec.js`

```javascript
import { test, expect } from '@playwright/test';

test.describe('Blog Navigation', () => {

  test('home page loads and shows posts', async ({ page }) => {
    await page.goto('/');

    // Wait for content to load
    await page.waitForSelector('.post-list', { timeout: 5000 });

    // Should have at least one post
    const posts = await page.locator('.post-item').count();
    expect(posts).toBeGreaterThan(0);
  });

  test('clicking post title navigates to post', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('.post-list');

    // Click first post
    await page.click('.post-title a');

    // Should show article content
    await expect(page.locator('article h1')).toBeVisible();
  });

  test('archive page groups by year', async ({ page }) => {
    await page.goto('/#/archive');

    // Should have year headers
    await expect(page.locator('.archive-year').first()).toBeVisible();
  });

  test('tags page shows tag cloud', async ({ page }) => {
    await page.goto('/#/tags');

    // Should have tag links
    await expect(page.locator('.tag-cloud a').first()).toBeVisible();
  });

  test('404 for invalid route', async ({ page }) => {
    await page.goto('/#/invalid/route/here');

    // Should show error
    await expect(page.locator('.error')).toContainText('not found');
  });

});

test.describe('Post Rendering', () => {

  test('post shows title, date, and tags', async ({ page }) => {
    await page.goto('/#/post/ai-coding-guardians');

    await expect(page.locator('article h1')).toBeVisible();
    await expect(page.locator('article .meta')).toContainText('2026');
  });

  test('code blocks have syntax highlighting', async ({ page }) => {
    await page.goto('/#/post/ai-coding-guardians');

    // Wait for hljs to run
    await page.waitForSelector('pre code.hljs', { timeout: 5000 });

    // Code should have highlighting classes
    const highlightedCode = await page.locator('pre code.hljs').first();
    await expect(highlightedCode).toBeVisible();
  });

  test('images load correctly', async ({ page }) => {
    await page.goto('/#/post/ai-coding-guardians');

    // Wait for images to load
    const images = page.locator('article img');
    const count = await images.count();

    if (count > 0) {
      for (let i = 0; i < count; i++) {
        const img = images.nth(i);
        await expect(img).toBeVisible();
      }
    }
  });

});

test.describe('Utility Functions', () => {

  test('formatDate produces readable dates', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('.post-list');

    // Execute formatDate in browser context
    const result = await page.evaluate(() => {
      return formatDate('2026-02-04');
    });

    expect(result).toContain('February');
    expect(result).toContain('2026');
  });

  test('parseFrontmatter extracts YAML correctly', async ({ page }) => {
    await page.goto('/');

    const result = await page.evaluate(() => {
      const content = `---
title: "Test Post"
date: 2026-01-01
tags: [a, b]
---
Body content here.`;
      return parseFrontmatter(content);
    });

    expect(result.meta.title).toBe('Test Post');
    expect(result.meta.tags).toEqual(['a', 'b']);
    expect(result.body.trim()).toBe('Body content here.');
  });

});
```

### How to Run Tests

```bash
# Run all tests
npm test

# Run with UI (useful for debugging)
npm run test:ui

# Run specific test file
npx playwright test tests/blog.spec.js

# Run specific test by name
npx playwright test -g "home page loads"
```

**Commit:**
```bash
git add tests/
git commit -m "Add Playwright tests for navigation, rendering, and utilities"
```

### Task 9.3: Manual Testing Checklist

Create this file for QA purposes:

**File to create**: `tests/MANUAL_CHECKLIST.md`

```markdown
# Manual Testing Checklist

Run through this before each release.

## Home Page
- [ ] Posts appear in reverse chronological order
- [ ] Date format is readable (e.g., "February 4, 2026")
- [ ] Tags are clickable and go to tag page
- [ ] No JavaScript errors in console

## Single Post
- [ ] Title, date, and tags display correctly
- [ ] Images load and are responsive
- [ ] Code blocks have syntax highlighting
- [ ] External links open in same tab (or new tab if configured)
- [ ] Long posts are scrollable

## Archive
- [ ] Posts grouped by year
- [ ] Most recent year first
- [ ] Dates shown in MM-DD format

## Tags
- [ ] All tags displayed
- [ ] Tag counts are correct
- [ ] Clicking tag shows only posts with that tag

## About
- [ ] Page loads without error

## Mobile (test in Chrome DevTools device mode)
- [ ] Text is readable without horizontal scroll
- [ ] Navigation works
- [ ] Images scale down appropriately

## Performance
- [ ] Page loads in < 2 seconds on localhost
- [ ] No visible layout shift after load
```

**Commit:**
```bash
git add tests/MANUAL_CHECKLIST.md
git commit -m "Add manual testing checklist"
```

---

## 10. Deployment

### Task 10.1: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** → **Pages**
3. Under "Source", select **Deploy from a branch**
4. Select `main` branch, `/ (root)` folder
5. Click **Save**

### Task 10.2: Verify Deployment

Wait 1-2 minutes, then visit: `https://USERNAME.github.io/musings-blog/`

### Troubleshooting Deployment

| Problem | Solution |
|---------|----------|
| 404 error | Check if `index.html` is in root directory |
| Content doesn't load | Check browser console; likely CORS or path issue |
| Styles broken | Clear cache, hard refresh (Ctrl+Shift+R) |

---

## 11. Task Checklist

Use this checklist to track progress. Each task should be a separate commit.

### Setup (Day 1)
- [ ] Read `DESIGN.md` completely
- [ ] Create `package.json`
- [ ] Create `.gitignore`
- [ ] Run `npm install`
- [ ] Install Playwright browsers

### Core Implementation (Day 1-2)
- [ ] Create `index.html` with HTML structure
- [ ] Add CDN script tags
- [ ] Test dependencies load (check console)
- [ ] Add CSS styles
- [ ] Implement `parseHash()` function
- [ ] Implement `router()` function
- [ ] Add utility functions
- [ ] Add render functions

### Content (Day 2)
- [ ] Create directory structure
- [ ] Create `content.json`
- [ ] Add first blog post
- [ ] Test locally: home page shows post
- [ ] Test locally: click through to post
- [ ] Test locally: archive, tags pages work

### Testing (Day 2-3)
- [ ] Create `playwright.config.js`
- [ ] Write navigation tests
- [ ] Write rendering tests
- [ ] Write utility function tests
- [ ] Run all tests, ensure passing
- [ ] Fix any failing tests

### Polish (Day 3)
- [ ] Test on mobile (Chrome DevTools)
- [ ] Check accessibility (tab navigation, screen reader)
- [ ] Verify images load correctly
- [ ] Check syntax highlighting works
- [ ] Run manual testing checklist

### Deploy (Day 3)
- [ ] Push to GitHub
- [ ] Enable GitHub Pages
- [ ] Verify live site works
- [ ] Test all routes on live site

---

## Appendix A: Common Errors and Solutions

### "Failed to fetch content.json"

**Cause**: Browser blocking fetch for `file://` URLs.

**Solution**: Use `npm run serve` to run a local HTTP server.

### "marked is not defined"

**Cause**: CDN script failed to load.

**Solution**:
1. Check internet connection
2. Check for typos in script src URL
3. Try a different CDN

### "Cannot read property 'content' of null"

**Cause**: `state.manifest` not loaded before trying to access it.

**Solution**: Ensure `router()` waits for manifest to load before rendering.

### Syntax highlighting not working

**Cause**: `hljs.highlightElement()` called before code blocks exist in DOM.

**Solution**: Call highlighting after setting `innerHTML`:

```javascript
app.innerHTML = html;
// Then highlight
document.querySelectorAll('pre code').forEach(block => {
  hljs.highlightElement(block);
});
```

---

## Appendix B: Adding New Content Types

If you need to add a new content type (e.g., "bookmark"):

1. **Add frontmatter format** to `DESIGN.md`
2. **Update `content.json`** with example entry
3. **Add route** in `parseHash()` function
4. **Add case** in `router()` switch statement
5. **Create render function** if different from posts
6. **Write tests** for new type
7. **Add sample content** file

---

## Appendix C: File Reference

| File | Purpose | Lines (approx) |
|------|---------|----------------|
| `index.html` | Entire SPA | ~500 |
| `content.json` | Content manifest | varies |
| `content/posts/*.md` | Blog posts | varies |
| `playwright.config.js` | Test configuration | ~20 |
| `tests/blog.spec.js` | Automated tests | ~100 |
| `package.json` | Dependencies and scripts | ~15 |

---

## Appendix D: Principles Reminder

### DRY (Don't Repeat Yourself)
- All date formatting goes through `formatDate()`
- All content fetching goes through `fetchContent()`
- All markdown parsing goes through `renderMarkdown()`

### YAGNI (You Ain't Gonna Need It)
- No search until explicitly needed
- No dark mode until explicitly needed
- No RSS until explicitly needed
- No comments until explicitly needed

### TDD (Test-Driven Development)
Ideal workflow:
1. Write a failing test for the feature
2. Write minimal code to make it pass
3. Refactor
4. Commit

Example:
```javascript
// 1. Write test first
test('archive page groups by year', async ({ page }) => {
  await page.goto('/#/archive');
  await expect(page.locator('.archive-year').first()).toBeVisible();
});

// 2. Run test - it fails
// 3. Implement renderArchive() function
// 4. Run test - it passes
// 5. Commit
```

### Frequent Commits
- Commit after each task (not each file)
- Use descriptive commit messages
- Format: `<verb>: <what changed>`
- Examples:
  - `Add: CSS styles for post list`
  - `Fix: Date parsing for Safari`
  - `Refactor: Extract formatDate utility`
  - `Test: Add navigation tests`
