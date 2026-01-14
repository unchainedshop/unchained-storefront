/**
 * Version History Types
 */

import type { Page, PageBlock } from './index';

export interface GitCommit {
  hash: string;
  shortHash: string;
  author: string;
  date: string;
  message: string;
}

export interface PageVersionPreview {
  commit: GitCommit;
  page: Page | null;
  isLoading: boolean;
}

export interface BlockChange {
  type: 'added' | 'removed' | 'modified';
  blockId: string;
  blockType: string;
  blockLabel: string;
  oldContent?: Partial<PageBlock>;
  newContent?: Partial<PageBlock>;
}

export interface VersionDiff {
  fromCommit: GitCommit;
  toCommit: GitCommit;
  additions: number;
  deletions: number;
  blockChanges: BlockChange[];
  rawPatch?: string;
}

export interface HistoryState {
  commits: GitCommit[];
  isLoading: boolean;
  error: string | null;
  selectedCommit: GitCommit | null;
  previewPage: Page | null;
  isPreviewLoading: boolean;
  diff: VersionDiff | null;
  isDiffLoading: boolean;
}
