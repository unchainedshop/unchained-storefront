/**
 * usePages Hook
 * Manages pages list operations - fetching, deleting, duplicating
 */

import { useState, useCallback, useEffect } from 'react';
import type { Page } from '../types';

interface UsePagesOptions {
  autoFetch?: boolean;
}

interface UsePagesReturn {
  pages: Page[];
  isLoading: boolean;
  error: string | null;
  fetchPages: () => Promise<void>;
  deletePage: (page: Page) => Promise<boolean>;
  duplicatePage: (page: Page) => Promise<Page | null>;
}

export function usePages(options: UsePagesOptions = {}): UsePagesReturn {
  const { autoFetch = true } = options;

  const [pages, setPages] = useState<Page[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPages = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/pages');
      if (!res.ok) throw new Error('Failed to fetch pages');
      const data = await res.json();
      setPages(data.pages);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load pages');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deletePage = useCallback(
    async (page: Page): Promise<boolean> => {
      if (!window.confirm(`Are you sure you want to delete "${page.title}"?`)) {
        return false;
      }

      try {
        const res = await fetch(`/api/pages/${page.slug}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Failed to delete page');
        await fetchPages();
        return true;
      } catch (err) {
        alert(err instanceof Error ? err.message : 'Failed to delete page');
        return false;
      }
    },
    [fetchPages]
  );

  const duplicatePage = useCallback(async (page: Page): Promise<Page | null> => {
    const newSlug = `${page.slug}-copy-${Date.now()}`;

    try {
      const res = await fetch(`/api/pages/${page.slug}/duplicate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newSlug }),
      });
      if (!res.ok) throw new Error('Failed to duplicate page');
      const data = await res.json();
      return data.page;
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to duplicate page');
      return null;
    }
  }, []);

  useEffect(() => {
    if (autoFetch) {
      fetchPages();
    }
  }, [autoFetch, fetchPages]);

  return {
    pages,
    isLoading,
    error,
    fetchPages,
    deletePage,
    duplicatePage,
  };
}

export default usePages;
