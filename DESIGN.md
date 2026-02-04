# Musings Blog - Design Document

A minimalist, single-page blog application inspired by [blog.fsck.com](https://blog.fsck.com). No build step required. Pure HTML/CSS/JS with runtime markdown rendering.

## Design Principles

1. **Extreme simplicity** - Single HTML file, minimal dependencies
2. **No build step** - Content is parsed at runtime
3. **Easy content management** - Add markdown file + one line to manifest
4. **Fast and lightweight** - < 50kb total (excluding content)
5. **Works offline** - After initial load, can cache aggressively

---

## Architecture Overview

```
musings-blog/
├── index.html          # The entire SPA (inline CSS + JS)
├── content.json        # Manifest of all content
└── content/
    ├── posts/
    │   └── 2026-02-04-hello-world.md
    ├── quotes/
    │   └── 2026-02-04-simplicity.md
    ├── snippets/
    │   └── 2026-02-04-git-tricks.md
    ├── tutorials/
    │   └── building-a-cli/
    │       ├── 01-introduction.md
    │       └── 02-parsing-args.md
    └── images/
        ├── posts/          # Images organized by post
        │   └── hello-world/
        │       └── screenshot.png
        └── shared/         # Reusable images (logo, etc.)
            └── logo.svg
```

---

## Content Format

All content uses **Markdown with YAML frontmatter**.

### Post

```markdown
---
title: "Hello World"
date: 2026-02-04
tags: [meta, first-post]
---

Welcome to my blog. This is the first post.
```

### Quote

```markdown
---
title: "On Simplicity"
date: 2026-02-04
type: quote
attribution: "Antoine de Saint-Exupery"
tags: [design, philosophy]
---

> Perfection is achieved, not when there is nothing more to add,
> but when there is nothing left to take away.

My thoughts on this quote...
```

### Snippet

```markdown
---
title: "Git: Undo Last Commit"
date: 2026-02-04
type: snippet
language: bash
tags: [git, cli]
---

```bash
git reset --soft HEAD~1
```

Keeps changes staged. Use `--hard` to discard changes entirely.
```

### Tutorial (Multi-part)

```markdown
---
title: "Building a CLI Tool"
date: 2026-02-04
type: tutorial
series: building-a-cli
part: 1
totalParts: 3
tags: [tutorial, cli, node]
---

In this series, we'll build a CLI tool from scratch...
```

---

## Manifest Format (`content.json`)

```json
{
  "site": {
    "title": "Musings",
    "author": "Your Name",
    "description": "A personal blog",
    "baseUrl": "https://username.github.io/musings-blog"
  },
  "content": [
    {
      "slug": "hello-world",
      "path": "content/posts/2026-02-04-hello-world.md",
      "type": "post",
      "title": "Hello World",
      "date": "2026-02-04",
      "tags": ["meta", "first-post"]
    },
    {
      "slug": "on-simplicity",
      "path": "content/quotes/2026-02-04-simplicity.md",
      "type": "quote",
      "title": "On Simplicity",
      "date": "2026-02-04",
      "tags": ["design", "philosophy"]
    },
    {
      "slug": "building-a-cli/01-introduction",
      "path": "content/tutorials/building-a-cli/01-introduction.md",
      "type": "tutorial",
      "series": "building-a-cli",
      "part": 1,
      "title": "Building a CLI Tool - Part 1",
      "date": "2026-02-04",
      "tags": ["tutorial", "cli"]
    }
  ]
}
```

**Note**: The manifest duplicates some frontmatter data. This is intentional - it allows the index page to render without fetching every markdown file.

---

## URL Routing (Hash-based)

Since this is a client-side SPA on GitHub Pages, we use hash routing:

| URL | View |
|-----|------|
| `#/` | Home - recent posts |
| `#/post/hello-world` | Single post view |
| `#/quote/on-simplicity` | Single quote view |
| `#/snippet/git-tricks` | Single snippet view |
| `#/tutorial/building-a-cli/01` | Tutorial part view |
| `#/archive` | All posts by year |
| `#/tags` | Tag cloud |
| `#/tag/javascript` | Posts with tag |
| `#/about` | About page |

---

## Dependencies (CDN)

| Library | Purpose | Size (gzip) |
|---------|---------|-------------|
| [marked.js](https://cdn.jsdelivr.net/npm/marked/marked.min.js) | Markdown → HTML | ~8kb |
| [js-yaml](https://cdn.jsdelivr.net/npm/js-yaml/dist/js-yaml.min.js) | Parse frontmatter | ~10kb |
| [highlight.js](https://cdn.jsdelivr.net/npm/highlight.js) | Syntax highlighting | ~30kb |
| highlight.js theme CSS | Code block styling | ~2kb |

**Total: ~50kb** (plus your content)

### Syntax Highlighting Setup

Include highlight.js core and a theme. Recommended theme: **GitHub** (light) for consistency with the minimal design.

```html
<!-- In <head> -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11/build/styles/github.min.css">

<!-- Before closing </body> -->
<script src="https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11/build/highlight.min.js"></script>
```

After rendering markdown, call `hljs.highlightAll()` to apply syntax highlighting to all code blocks.

**Supported languages** (auto-detected):
- JavaScript, TypeScript, Python, Bash, JSON, HTML, CSS, Go, Rust, and 180+ more

Optional additions:
- [Fuse.js](https://cdn.jsdelivr.net/npm/fuse.js) for search (~6kb)

---

## Single HTML File Structure

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Musings</title>
  <style>
    /* All CSS inline - targeting ~200 lines */
    /* Minimalist design: system fonts, good typography, mobile-friendly */
  </style>
</head>
<body>
  <header>
    <nav><!-- Home, Archive, Tags, About --></nav>
  </header>

  <main id="app">
    <!-- Content rendered here by JS -->
  </main>

  <footer>
    <!-- Minimal footer -->
  </footer>

  <!-- Dependencies from CDN -->
  <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/js-yaml@4/dist/js-yaml.min.js"></script>

  <script>
    /* All JS inline - targeting ~300 lines */
    /*
     * - Fetch content.json on load
     * - Hash-based router
     * - Render views (home, post, archive, tags)
     * - Parse frontmatter + markdown
     * - Cache fetched content in memory
     */
  </script>
</body>
</html>
```

---

## Adding New Content (Workflow)

### 1. Create the markdown file

```bash
# Create a new post
cat > content/posts/2026-02-05-new-post.md << 'EOF'
---
title: "My New Post"
date: 2026-02-05
tags: [topic1, topic2]
---

Post content here...
EOF
```

### 2. Add entry to content.json

```json
{
  "slug": "new-post",
  "path": "content/posts/2026-02-05-new-post.md",
  "type": "post",
  "title": "My New Post",
  "date": "2026-02-05",
  "tags": ["topic1", "topic2"]
}
```

### 3. Commit and push

```bash
git add .
git commit -m "Add: My New Post"
git push
```

That's it. GitHub Pages serves the new content.

---

## Optional: Auto-generate Manifest

If manually editing `content.json` feels tedious, a simple script can generate it:

```bash
# scripts/generate-manifest.js (optional convenience)
# Run: node scripts/generate-manifest.js > content.json
```

This is **not required** - just a convenience. The blog works without any build step.

---

## GitHub Pages Setup

1. Go to repo Settings → Pages
2. Set source to "Deploy from a branch"
3. Select `main` branch, `/ (root)` folder
4. Save

The site will be available at: `https://username.github.io/musings-blog/`

---

## Visual Design

Inspired by blog.fsck.com:

- **Typography**: System font stack, comfortable reading width (~65ch)
- **Colors**: Dark text on light background, minimal accent color
- **Layout**: Single column, no sidebar (keep it simple)
- **Spacing**: Generous whitespace, clear hierarchy
- **Mobile**: Responsive, readable on all devices

### Home Page Layout (blog.fsck.com style)

The home page displays a **scannable list of recent posts** - not full content or excerpts. Each entry shows:
- **Date** (above, smaller text)
- **Title** (clickable link, primary focus)
- **Tags** (below, lowercase, monospaced style)

This allows readers to quickly scan and find content of interest.

```
┌─────────────────────────────────────┐
│  Musings                            │
│  Home  Archive  Tags  About         │
├─────────────────────────────────────┤
│                                     │
│  February 4, 2026                   │
│  Hello World                        │
│  meta  first-post                   │
│                                     │
│  February 3, 2026                   │
│  On Simplicity                      │
│  design  philosophy                 │
│                                     │
│  February 2, 2026                   │
│  Git: Undo Last Commit              │
│  git  cli                           │
│                                     │
│  February 1, 2026                   │
│  Building a CLI Tool - Part 1       │
│  tutorial  cli  node                │
│                                     │
├─────────────────────────────────────┤
│  © 2026                             │
└─────────────────────────────────────┘
```

### Single Post View

When clicking a post title, the full content is displayed:

```
┌─────────────────────────────────────┐
│  Musings                            │
│  Home  Archive  Tags  About         │
├─────────────────────────────────────┤
│                                     │
│  Hello World                        │
│  February 4, 2026 · meta, first-post│
│                                     │
│  Welcome to my blog. This is the    │
│  first post with good typography    │
│  and comfortable line length...     │
│                                     │
│  [Full markdown content rendered]   │
│                                     │
├─────────────────────────────────────┤
│  © 2026                             │
└─────────────────────────────────────┘
```

---

## Content Type Rendering

### Posts
Full content on home page (like blog.fsck.com) or excerpt with "read more".

### Quotes
Styled blockquote with attribution, followed by commentary.

### Snippets
Code block with syntax highlighting, brief explanation.

### Tutorials
Part navigation (← Previous | Part 2 of 5 | Next →), series overview link.

---

## Images and Media

Posts can include images, GIFs, and other media using standard markdown syntax. The blog supports elegant display of various image formats.

### Supported Formats

- **Static images**: PNG, JPG, JPEG, WebP, SVG
- **Animated**: GIF, animated WebP
- **Other**: Any format the browser supports

### Image Storage

Store images in a dedicated folder within content:

```
content/
├── posts/
│   └── 2026-02-04-hello-world.md
└── images/
    ├── posts/
    │   └── hello-world/
    │       ├── screenshot.png
    │       └── demo.gif
    └── shared/
        └── logo.svg
```

### Markdown Syntax

```markdown
<!-- Basic image -->
![Alt text](content/images/posts/hello-world/screenshot.png)

<!-- Image with title (shows on hover) -->
![Alt text](content/images/posts/hello-world/demo.gif "Demo animation")

<!-- External image -->
![External](https://example.com/image.png)
```

### CSS Styling for Images

Images are styled for elegant display:

```css
/* Responsive images that don't overflow */
article img {
  max-width: 100%;
  height: auto;
  display: block;
  margin: 1.5rem auto;
  border-radius: 4px;
}

/* Optional: subtle shadow for screenshots */
article img:not([src$=".svg"]) {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* GIFs and animations - no extra styling needed */
/* They play automatically in browsers */
```

### Image Best Practices

1. **Optimize images** before committing (use tools like ImageOptim, TinyPNG)
2. **Use WebP** for better compression when browser support isn't a concern
3. **Keep GIFs short** - they can get large quickly
4. **Use descriptive alt text** for accessibility
5. **Relative paths** work best for portability (`content/images/...`)

### Responsive Considerations

The CSS ensures images:
- Never exceed container width
- Scale down on mobile
- Center within the content area
- Have consistent spacing

No `<picture>` element or srcset needed for this simple blog - the single responsive image approach works well for most content.

---

## Future Extensibility

The design supports future additions without major changes:

- **Search**: Add Fuse.js, generate search index from content.json
- **Dark mode**: CSS custom properties, toggle in nav
- **Comments**: Add Giscus (GitHub Discussions) embed
- **New content types**: Add to schema, add rendering logic

### RSS Feed (Planned for Later)

RSS is explicitly deferred from the initial implementation. When ready to add:

1. **Option A - Static file**: Manually maintain `feed.xml` or generate it with a script
2. **Option B - GitHub Action**: Auto-generate `feed.xml` on push using a workflow
3. **Option C - Client-side**: Generate RSS dynamically (less ideal, but possible)

The manifest (`content.json`) already contains all metadata needed to generate a valid RSS feed.

---

## File Size Budget

| Component | Target |
|-----------|--------|
| HTML structure | < 2kb |
| Inline CSS | < 5kb |
| Inline JS | < 10kb |
| CDN deps (marked + js-yaml + highlight.js) | ~50kb |
| **Total (excl. content)** | **< 67kb** |

---

## Summary

| Aspect | Choice |
|--------|--------|
| Files | Single `index.html` + content files |
| Build step | None |
| Framework | None (vanilla JS) |
| Markdown parsing | Runtime (marked.js) |
| Routing | Hash-based |
| Hosting | GitHub Pages |
| Adding content | Create .md + edit manifest |

---

## Resolved Design Decisions

1. **Home page style**: Display scannable list (date + title + tags) like blog.fsck.com - no full content or excerpts on home page
2. **Syntax highlighting**: Include highlight.js with GitHub theme for code blocks
3. **RSS feed**: Deferred to future implementation (see Future Extensibility section)
4. **Images/Media**: Full support for PNG, JPG, GIF, WebP, SVG with responsive CSS styling

---

## Next Steps

Once this design is approved:

1. Create `index.html` with inline CSS/JS
2. Create sample content (1 post, 1 quote, 1 snippet)
3. Create `content.json` manifest
4. Test locally
5. Push to GitHub, enable Pages
