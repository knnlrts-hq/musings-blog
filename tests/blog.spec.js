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
