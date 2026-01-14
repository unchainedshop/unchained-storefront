/**
 * File-based Page Storage
 * Stores pages as JSON files in content/pages/
 * Uses Git for version history
 */

import fs from 'fs/promises';
import path from 'path';
import type { Page } from '../types';

const PAGES_DIR = path.join(process.cwd(), 'content', 'pages');

/**
 * Ensure the pages directory exists
 */
export async function ensurePagesDir(): Promise<void> {
  try {
    await fs.access(PAGES_DIR);
  } catch {
    await fs.mkdir(PAGES_DIR, { recursive: true });
  }
}

/**
 * Get the file path for a page
 */
function getPagePath(slug: string): string {
  // Sanitize slug to prevent directory traversal
  const safeSlug = slug.replace(/[^a-zA-Z0-9-_]/g, '-');
  return path.join(PAGES_DIR, `${safeSlug}.json`);
}

/**
 * List all pages
 */
export async function listPages(): Promise<Page[]> {
  await ensurePagesDir();

  const files = await fs.readdir(PAGES_DIR);
  const jsonFiles = files.filter(f => f.endsWith('.json'));

  const pages: Page[] = [];

  for (const file of jsonFiles) {
    try {
      const content = await fs.readFile(path.join(PAGES_DIR, file), 'utf-8');
      const page = JSON.parse(content) as Page;
      pages.push(page);
    } catch (error) {
      console.error(`Error reading page ${file}:`, error);
    }
  }

  // Sort by updatedAt descending
  return pages.sort((a, b) =>
    new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
}

/**
 * Get a single page by slug
 */
export async function getPage(slug: string): Promise<Page | null> {
  await ensurePagesDir();

  const filePath = getPagePath(slug);

  try {
    const content = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(content) as Page;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return null;
    }
    throw error;
  }
}

/**
 * Get a page by ID
 */
export async function getPageById(id: string): Promise<Page | null> {
  const pages = await listPages();
  return pages.find(p => p.id === id) || null;
}

/**
 * Save a page (create or update)
 */
export async function savePage(page: Page): Promise<Page> {
  await ensurePagesDir();

  const now = new Date().toISOString();

  // Check if page exists (for update vs create)
  const existing = await getPage(page.slug);

  const updatedPage: Page = {
    ...page,
    createdAt: existing?.createdAt || page.createdAt || now,
    updatedAt: now,
  };

  const filePath = getPagePath(page.slug);
  await fs.writeFile(filePath, JSON.stringify(updatedPage, null, 2), 'utf-8');

  return updatedPage;
}

/**
 * Delete a page
 */
export async function deletePage(slug: string): Promise<boolean> {
  await ensurePagesDir();

  const filePath = getPagePath(slug);

  try {
    await fs.unlink(filePath);
    return true;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return false;
    }
    throw error;
  }
}

/**
 * Rename a page (change slug)
 */
export async function renamePage(oldSlug: string, newSlug: string): Promise<Page | null> {
  const page = await getPage(oldSlug);
  if (!page) return null;

  // Delete old file
  await deletePage(oldSlug);

  // Save with new slug
  const updatedPage = { ...page, slug: newSlug };
  return savePage(updatedPage);
}

/**
 * Duplicate a page
 */
export async function duplicatePage(slug: string, newSlug: string): Promise<Page | null> {
  const page = await getPage(slug);
  if (!page) return null;

  const now = new Date().toISOString();
  const duplicatedPage: Page = {
    ...page,
    id: `page_${Date.now()}`,
    slug: newSlug,
    title: `${page.title} (Copy)`,
    status: 'draft',
    createdAt: now,
    updatedAt: now,
    versions: [],
  };

  return savePage(duplicatedPage);
}

/**
 * Check if a slug is available
 */
export async function isSlugAvailable(slug: string, excludeId?: string): Promise<boolean> {
  const page = await getPage(slug);
  if (!page) return true;
  if (excludeId && page.id === excludeId) return true;
  return false;
}
