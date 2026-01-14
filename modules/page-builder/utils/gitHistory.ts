/**
 * Git History Integration
 * Provides version history for pages using Git
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';

const execAsync = promisify(exec);

const PAGES_DIR = path.join(process.cwd(), 'content', 'pages');

export interface GitCommit {
  hash: string;
  shortHash: string;
  author: string;
  date: string;
  message: string;
}

export interface GitDiff {
  additions: number;
  deletions: number;
  patch: string;
}

/**
 * Get git log for a specific page file
 */
export async function getPageHistory(slug: string, limit = 20): Promise<GitCommit[]> {
  const filePath = path.join(PAGES_DIR, `${slug}.json`);

  try {
    const { stdout } = await execAsync(
      `git log --format="%H|%h|%an|%aI|%s" -n ${limit} -- "${filePath}"`,
      { cwd: process.cwd() }
    );

    if (!stdout.trim()) {
      return [];
    }

    return stdout
      .trim()
      .split('\n')
      .map((line) => {
        const [hash, shortHash, author, date, message] = line.split('|');
        return { hash, shortHash, author, date, message };
      });
  } catch (error) {
    console.error('Error getting git history:', error);
    return [];
  }
}

/**
 * Get the content of a page at a specific commit
 */
export async function getPageAtCommit(slug: string, commitHash: string): Promise<string | null> {
  const filePath = `content/pages/${slug}.json`;

  try {
    const { stdout } = await execAsync(
      `git show ${commitHash}:"${filePath}"`,
      { cwd: process.cwd() }
    );

    return stdout;
  } catch (error) {
    console.error('Error getting page at commit:', error);
    return null;
  }
}

/**
 * Get diff between two commits for a page
 */
export async function getPageDiff(
  slug: string,
  fromCommit: string,
  toCommit: string
): Promise<GitDiff | null> {
  const filePath = `content/pages/${slug}.json`;

  try {
    const { stdout } = await execAsync(
      `git diff --stat ${fromCommit}..${toCommit} -- "${filePath}"`,
      { cwd: process.cwd() }
    );

    const { stdout: patch } = await execAsync(
      `git diff ${fromCommit}..${toCommit} -- "${filePath}"`,
      { cwd: process.cwd() }
    );

    // Parse stat output for additions/deletions
    const statMatch = stdout.match(/(\d+) insertions?\(\+\).*?(\d+) deletions?\(-\)/);
    const additions = statMatch ? parseInt(statMatch[1], 10) : 0;
    const deletions = statMatch ? parseInt(statMatch[2], 10) : 0;

    return { additions, deletions, patch };
  } catch (error) {
    console.error('Error getting page diff:', error);
    return null;
  }
}

/**
 * Stage and commit a page change
 */
export async function commitPageChange(
  slug: string,
  message: string,
  author?: { name: string; email: string }
): Promise<string | null> {
  const filePath = `content/pages/${slug}.json`;

  try {
    // Stage the file
    await execAsync(`git add "${filePath}"`, { cwd: process.cwd() });

    // Build commit command
    let commitCmd = `git commit -m "${message.replace(/"/g, '\\"')}"`;

    if (author) {
      commitCmd += ` --author="${author.name} <${author.email}>"`;
    }

    // Commit
    const { stdout } = await execAsync(commitCmd, { cwd: process.cwd() });

    // Extract commit hash
    const hashMatch = stdout.match(/\[.*?\s+([a-f0-9]+)\]/);
    return hashMatch ? hashMatch[1] : null;
  } catch (error) {
    // If nothing to commit, that's OK
    if ((error as Error).message?.includes('nothing to commit')) {
      return null;
    }
    console.error('Error committing page change:', error);
    throw error;
  }
}

/**
 * Restore a page to a previous version
 */
export async function restorePageVersion(slug: string, commitHash: string): Promise<boolean> {
  const filePath = `content/pages/${slug}.json`;

  try {
    // Checkout the file at the specific commit
    await execAsync(
      `git checkout ${commitHash} -- "${filePath}"`,
      { cwd: process.cwd() }
    );

    return true;
  } catch (error) {
    console.error('Error restoring page version:', error);
    return false;
  }
}

/**
 * Check if a page file is tracked by git
 */
export async function isPageTracked(slug: string): Promise<boolean> {
  const filePath = `content/pages/${slug}.json`;

  try {
    await execAsync(
      `git ls-files --error-unmatch "${filePath}"`,
      { cwd: process.cwd() }
    );
    return true;
  } catch {
    return false;
  }
}

/**
 * Check if a page has uncommitted changes
 */
export async function hasUncommittedChanges(slug: string): Promise<boolean> {
  const filePath = `content/pages/${slug}.json`;

  try {
    const { stdout } = await execAsync(
      `git status --porcelain "${filePath}"`,
      { cwd: process.cwd() }
    );
    return stdout.trim().length > 0;
  } catch {
    return false;
  }
}
