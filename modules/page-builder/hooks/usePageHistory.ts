/**
 * usePageHistory Hook
 * Manages version history state and API calls
 */

import { useState, useCallback, useEffect } from 'react';
import type { GitCommit, HistoryState } from '../types/history';
import type { Page } from '../types';

interface UsePageHistoryOptions {
  slug: string;
  enabled?: boolean;
}

export function usePageHistory({ slug, enabled = true }: UsePageHistoryOptions) {
  const [state, setState] = useState<HistoryState>({
    commits: [],
    isLoading: false,
    error: null,
    selectedCommit: null,
    previewPage: null,
    isPreviewLoading: false,
    diff: null,
    isDiffLoading: false,
  });

  // Fetch commit history
  const fetchHistory = useCallback(async () => {
    if (!enabled || !slug) return;

    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const res = await fetch(`/api/pages/${slug}/history`);
      if (!res.ok) throw new Error('Failed to load history');
      const data = await res.json();
      setState((prev) => ({
        ...prev,
        commits: data.history || [],
        isLoading: false,
      }));
    } catch (err) {
      setState((prev) => ({
        ...prev,
        error: err instanceof Error ? err.message : 'Failed to load history',
        isLoading: false,
      }));
    }
  }, [slug, enabled]);

  // Preview a specific version
  const previewVersion = useCallback(
    async (commit: GitCommit) => {
      setState((prev) => ({
        ...prev,
        selectedCommit: commit,
        isPreviewLoading: true,
      }));
      try {
        const res = await fetch(
          `/api/pages/${slug}/history?commit=${commit.hash}`,
        );
        if (!res.ok) throw new Error('Failed to load version');
        const data = await res.json();
        setState((prev) => ({
          ...prev,
          previewPage: data.page,
          isPreviewLoading: false,
        }));
      } catch (err) {
        setState((prev) => ({
          ...prev,
          isPreviewLoading: false,
          error: err instanceof Error ? err.message : 'Failed to load version',
        }));
      }
    },
    [slug],
  );

  // Restore a version
  const restoreVersion = useCallback(
    async (commit: GitCommit): Promise<Page | null> => {
      try {
        const res = await fetch(`/api/pages/${slug}/history`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'restore', commit: commit.hash }),
        });
        if (!res.ok) throw new Error('Failed to restore version');
        const data = await res.json();
        if (data.restored) {
          await fetchHistory();
          return data.page;
        }
        return null;
      } catch (err) {
        setState((prev) => ({
          ...prev,
          error: err instanceof Error ? err.message : 'Failed to restore',
        }));
        return null;
      }
    },
    [slug, fetchHistory],
  );

  // Commit current changes with message
  const commitChanges = useCallback(
    async (message: string): Promise<boolean> => {
      try {
        const res = await fetch(`/api/pages/${slug}/history`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'commit', message }),
        });
        if (!res.ok) throw new Error('Failed to commit');
        const data = await res.json();
        if (data.committed) {
          await fetchHistory();
          return true;
        }
        return false;
      } catch (err) {
        setState((prev) => ({
          ...prev,
          error: err instanceof Error ? err.message : 'Failed to commit',
        }));
        return false;
      }
    },
    [slug, fetchHistory],
  );

  // Clear preview
  const clearPreview = useCallback(() => {
    setState((prev) => ({
      ...prev,
      selectedCommit: null,
      previewPage: null,
      diff: null,
    }));
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  return {
    ...state,
    fetchHistory,
    previewVersion,
    restoreVersion,
    commitChanges,
    clearPreview,
  };
}
