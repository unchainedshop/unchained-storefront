/**
 * useMedia Hook
 * Manages media assets for the admin interface
 */

import { useState, useEffect, useCallback } from "react";
import type {
  MediaAsset,
  MediaFolder,
  MediaListParams,
  SortField,
  SortOrder,
  FolderTreeItem,
} from "../types";

interface UseMediaState {
  assets: MediaAsset[];
  folders: MediaFolder[];
  folderTree: FolderTreeItem[];
  tags: { tag: string; count: number }[];
  total: number;
  isLoading: boolean;
  error: string | null;
}

interface UseMediaReturn extends UseMediaState {
  // Fetching
  fetchAssets: (params?: MediaListParams) => Promise<void>;
  fetchFolders: () => Promise<void>;
  fetchTags: () => Promise<void>;
  refresh: () => Promise<void>;

  // Asset operations
  deleteAsset: (asset: MediaAsset) => Promise<boolean>;
  bulkDelete: (assetIds: string[]) => Promise<boolean>;
  moveAssets: (assetIds: string[], folderId: string | null) => Promise<boolean>;
  updateAsset: (
    id: string,
    updates: Partial<MediaAsset>,
  ) => Promise<MediaAsset | null>;

  // Folder operations
  createFolder: (
    name: string,
    parentId?: string | null,
  ) => Promise<MediaFolder | null>;
  deleteFolder: (
    folder: MediaFolder,
    deleteContents?: boolean,
  ) => Promise<boolean>;

  // State
  currentFolderId: string | null;
  setCurrentFolderId: (id: string | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sortBy: SortField;
  setSortBy: (field: SortField) => void;
  sortOrder: SortOrder;
  setSortOrder: (order: SortOrder) => void;
}

export function useMedia(): UseMediaReturn {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [folders, setFolders] = useState<MediaFolder[]>([]);
  const [folderTree, setFolderTree] = useState<FolderTreeItem[]>([]);
  const [tags, setTags] = useState<{ tag: string; count: number }[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter state
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortField>("date");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  const fetchAssets = useCallback(
    async (params?: MediaListParams) => {
      setIsLoading(true);
      setError(null);

      try {
        const queryParams = new URLSearchParams();
        const finalParams = {
          folderId: currentFolderId,
          search: searchQuery,
          sortBy,
          sortOrder,
          ...params,
        };

        if (finalParams.folderId !== undefined) {
          queryParams.set(
            "folderId",
            finalParams.folderId === null ? "null" : finalParams.folderId,
          );
        }
        if (finalParams.search) queryParams.set("search", finalParams.search);
        if (finalParams.sortBy) queryParams.set("sortBy", finalParams.sortBy);
        if (finalParams.sortOrder)
          queryParams.set("sortOrder", finalParams.sortOrder);

        const response = await fetch(`/api/media?${queryParams.toString()}`);
        if (!response.ok) throw new Error("Failed to fetch assets");

        const data = await response.json();
        setAssets(data.assets || []);
        setTotal(data.total || 0);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch assets");
        setAssets([]);
      } finally {
        setIsLoading(false);
      }
    },
    [currentFolderId, searchQuery, sortBy, sortOrder],
  );

  const fetchFolders = useCallback(async () => {
    try {
      const response = await fetch("/api/media/folders");
      if (!response.ok) throw new Error("Failed to fetch folders");

      const data = await response.json();
      setFolders(data.folders || []);
      setFolderTree(data.tree || []);
    } catch (err) {
      console.error("Failed to fetch folders:", err);
    }
  }, []);

  const fetchTags = useCallback(async () => {
    try {
      const response = await fetch("/api/media/tags");
      if (!response.ok) throw new Error("Failed to fetch tags");

      const data = await response.json();
      setTags(data.tags || []);
    } catch (err) {
      console.error("Failed to fetch tags:", err);
    }
  }, []);

  const refresh = useCallback(async () => {
    await Promise.all([fetchAssets(), fetchFolders(), fetchTags()]);
  }, [fetchAssets, fetchFolders, fetchTags]);

  // Initial load
  useEffect(() => {
    refresh();
  }, []);

  // Refetch when filters change
  useEffect(() => {
    fetchAssets();
  }, [currentFolderId, searchQuery, sortBy, sortOrder, fetchAssets]);

  const deleteAsset = useCallback(
    async (asset: MediaAsset): Promise<boolean> => {
      if (
        !window.confirm(
          `Delete "${asset.originalName}"? This cannot be undone.`,
        )
      ) {
        return false;
      }

      try {
        const response = await fetch(`/api/media/${asset.id}`, {
          method: "DELETE",
        });
        if (!response.ok) throw new Error("Failed to delete asset");

        setAssets((prev) => prev.filter((a) => a.id !== asset.id));
        setTotal((prev) => prev - 1);
        return true;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to delete asset",
        );
        return false;
      }
    },
    [],
  );

  const bulkDelete = useCallback(
    async (assetIds: string[]): Promise<boolean> => {
      if (
        !window.confirm(
          `Delete ${assetIds.length} assets? This cannot be undone.`,
        )
      ) {
        return false;
      }

      try {
        const response = await fetch("/api/media/bulk", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ assetIds }),
        });
        if (!response.ok) throw new Error("Failed to delete assets");

        setAssets((prev) => prev.filter((a) => !assetIds.includes(a.id)));
        setTotal((prev) => prev - assetIds.length);
        return true;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to delete assets",
        );
        return false;
      }
    },
    [],
  );

  const moveAssets = useCallback(
    async (assetIds: string[], folderId: string | null): Promise<boolean> => {
      try {
        const response = await fetch("/api/media/bulk/move", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ assetIds, folderId }),
        });
        if (!response.ok) throw new Error("Failed to move assets");

        await fetchAssets();
        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to move assets");
        return false;
      }
    },
    [fetchAssets],
  );

  const updateAsset = useCallback(
    async (
      id: string,
      updates: Partial<MediaAsset>,
    ): Promise<MediaAsset | null> => {
      try {
        const response = await fetch(`/api/media/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updates),
        });
        if (!response.ok) throw new Error("Failed to update asset");

        const { asset } = await response.json();
        setAssets((prev) => prev.map((a) => (a.id === id ? asset : a)));
        return asset;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to update asset",
        );
        return null;
      }
    },
    [],
  );

  const createFolder = useCallback(
    async (
      name: string,
      parentId?: string | null,
    ): Promise<MediaFolder | null> => {
      try {
        const response = await fetch("/api/media/folders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, parentId: parentId ?? null }),
        });
        if (!response.ok) throw new Error("Failed to create folder");

        const { folder } = await response.json();
        await fetchFolders();
        return folder;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to create folder",
        );
        return null;
      }
    },
    [fetchFolders],
  );

  const deleteFolder = useCallback(
    async (folder: MediaFolder, deleteContents = false): Promise<boolean> => {
      const message = deleteContents
        ? `Delete "${folder.name}" and all its contents? This cannot be undone.`
        : `Delete "${folder.name}"? Contents will be moved to root.`;

      if (!window.confirm(message)) {
        return false;
      }

      try {
        const response = await fetch(
          `/api/media/folders/${folder.id}?deleteContents=${deleteContents}`,
          {
            method: "DELETE",
          },
        );
        if (!response.ok) throw new Error("Failed to delete folder");

        await refresh();
        return true;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to delete folder",
        );
        return false;
      }
    },
    [refresh],
  );

  return {
    // State
    assets,
    folders,
    folderTree,
    tags,
    total,
    isLoading,
    error,

    // Fetching
    fetchAssets,
    fetchFolders,
    fetchTags,
    refresh,

    // Asset operations
    deleteAsset,
    bulkDelete,
    moveAssets,
    updateAsset,

    // Folder operations
    createFolder,
    deleteFolder,

    // Filter state
    currentFolderId,
    setCurrentFolderId,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
  };
}

export default useMedia;
