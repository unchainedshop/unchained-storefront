/**
 * Media Library Admin Page
 * Full-featured DAM interface with folder navigation, grid/list views, and upload
 */

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useIntl } from "react-intl";
import {
  PlusIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  ArrowPathIcon,
  FolderIcon,
  FolderPlusIcon,
  PhotoIcon,
  Squares2X2Icon,
  ListBulletIcon,
  CloudArrowUpIcon,
  XMarkIcon,
  TagIcon,
  ArrowRightIcon,
  ChevronRightIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import MetaTags from "../../../modules/common/components/MetaTags";
import type {
  MediaAsset,
  MediaFolder,
  FolderTreeItem,
  MediaType,
} from "../../../modules/media/types";
import { formatFileSize } from "../../../modules/media/utils/formatters";

type ViewMode = "grid" | "list";
type SortField = "name" | "date" | "size";

const MediaAdmin: React.FC = () => {
  const { formatDate } = useIntl();

  // State
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [folders, setFolders] = useState<MediaFolder[]>([]);
  const [folderTree, setFolderTree] = useState<FolderTreeItem[]>([]);
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [selectedAssets, setSelectedAssets] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [sortBy, setSortBy] = useState<SortField>("date");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  // Upload state
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Detail panel
  const [selectedAsset, setSelectedAsset] = useState<MediaAsset | null>(null);

  // New folder dialog
  const [showNewFolderDialog, setShowNewFolderDialog] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");

  // Breadcrumb
  const [breadcrumb, setBreadcrumb] = useState<
    { id: string | null; name: string }[]
  >([{ id: null, name: "All Media" }]);

  // Fetch data
  const fetchAssets = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (currentFolderId) {
        params.set("folderId", currentFolderId);
      } else {
        params.set("folderId", "null");
      }
      params.set("sortBy", sortBy);
      params.set("sortOrder", "desc");
      params.set("limit", "100");

      if (typeFilter !== "all") {
        params.set("mimeType", typeFilter);
      }

      const res = await fetch(`/api/media?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch assets");
      const data = await res.json();
      setAssets(data.assets);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load assets");
    } finally {
      setIsLoading(false);
    }
  }, [currentFolderId, sortBy, typeFilter]);

  const fetchFolders = useCallback(async () => {
    try {
      const res = await fetch("/api/media/folders/tree");
      if (!res.ok) throw new Error("Failed to fetch folders");
      const data = await res.json();
      setFolderTree(data.tree);

      // Also fetch current folder's subfolders
      const params = new URLSearchParams();
      if (currentFolderId) {
        params.set("parentId", currentFolderId);
      } else {
        params.set("parentId", "null");
      }
      const foldersRes = await fetch(`/api/media/folders?${params.toString()}`);
      if (foldersRes.ok) {
        const foldersData = await foldersRes.json();
        setFolders(foldersData.folders);
      }
    } catch (err) {
      console.error("Failed to fetch folders:", err);
    }
  }, [currentFolderId]);

  useEffect(() => {
    fetchAssets();
    fetchFolders();
  }, [fetchAssets, fetchFolders]);

  // Filter assets by search
  const filteredAssets = assets.filter((asset) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      asset.originalName.toLowerCase().includes(query) ||
      asset.title.toLowerCase().includes(query) ||
      asset.tags.some((t) => t.toLowerCase().includes(query))
    );
  });

  // Upload handlers
  const handleUpload = async (files: FileList | File[]) => {
    if (!files.length) return;

    setIsUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    Array.from(files).forEach((file) => {
      formData.append("files", file);
    });

    if (currentFolderId) {
      formData.append("folderId", currentFolderId);
    }

    try {
      const res = await fetch("/api/media/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Upload failed");
      }

      await fetchAssets();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length) {
      handleUpload(files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  // Selection handlers
  const toggleAssetSelection = (id: string) => {
    const newSelection = new Set(selectedAssets);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedAssets(newSelection);
  };

  const selectAll = () => {
    if (selectedAssets.size === filteredAssets.length) {
      setSelectedAssets(new Set());
    } else {
      setSelectedAssets(new Set(filteredAssets.map((a) => a.id)));
    }
  };

  // Delete handlers
  const handleDelete = async (assetId: string) => {
    if (!window.confirm("Are you sure you want to delete this asset?")) return;

    try {
      const res = await fetch(`/api/media/${assetId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete asset");
      await fetchAssets();
      setSelectedAsset(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete asset");
    }
  };

  const handleBulkDelete = async () => {
    if (!window.confirm(`Delete ${selectedAssets.size} selected assets?`))
      return;

    try {
      const res = await fetch("/api/media/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operation: "delete",
          assetIds: Array.from(selectedAssets),
        }),
      });
      if (!res.ok) throw new Error("Failed to delete assets");
      await fetchAssets();
      setSelectedAssets(new Set());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete assets");
    }
  };

  // Folder navigation
  const navigateToFolder = async (
    folderId: string | null,
    folderName: string,
  ) => {
    setCurrentFolderId(folderId);
    setSelectedAssets(new Set());
    setSelectedAsset(null);

    // Update breadcrumb
    if (folderId === null) {
      setBreadcrumb([{ id: null, name: "All Media" }]);
    } else {
      const existingIndex = breadcrumb.findIndex((b) => b.id === folderId);
      if (existingIndex >= 0) {
        setBreadcrumb(breadcrumb.slice(0, existingIndex + 1));
      } else {
        setBreadcrumb([...breadcrumb, { id: folderId, name: folderName }]);
      }
    }
  };

  // Create folder
  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;

    try {
      const res = await fetch("/api/media/folders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newFolderName.trim(),
          parentId: currentFolderId,
        }),
      });

      if (!res.ok) throw new Error("Failed to create folder");

      setNewFolderName("");
      setShowNewFolderDialog(false);
      await fetchFolders();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create folder");
    }
  };

  return (
    <>
      <MetaTags title="Media Library - Admin" />
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex">
        {/* Left Sidebar - Folder Tree */}
        <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex-shrink-0">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
              Folders
            </h2>
          </div>
          <nav className="p-2">
            <button
              onClick={() => navigateToFolder(null, "All Media")}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                currentFolderId === null
                  ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                  : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <PhotoIcon className="w-5 h-5" />
              All Media
            </button>

            {/* Folder tree */}
            <FolderTreeNav
              folders={folderTree}
              currentFolderId={currentFolderId}
              onNavigate={navigateToFolder}
              level={0}
            />

            {/* New folder button */}
            <button
              onClick={() => setShowNewFolderDialog(true)}
              className="w-full flex items-center gap-2 px-3 py-2 mt-2 rounded-lg text-sm text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <FolderPlusIcon className="w-5 h-5" />
              New Folder
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                {/* Breadcrumb */}
                <div className="flex items-center gap-1 text-sm">
                  {breadcrumb.map((item, index) => (
                    <React.Fragment key={item.id ?? "root"}>
                      {index > 0 && (
                        <ChevronRightIcon className="w-4 h-4 text-slate-400" />
                      )}
                      <button
                        onClick={() => navigateToFolder(item.id, item.name)}
                        className={`hover:text-blue-600 dark:hover:text-blue-400 ${
                          index === breadcrumb.length - 1
                            ? "font-medium text-slate-900 dark:text-white"
                            : "text-slate-500 dark:text-slate-400"
                        }`}
                      >
                        {item.name}
                      </button>
                    </React.Fragment>
                  ))}
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                  {filteredAssets.length} assets
                  {selectedAssets.size > 0 &&
                    ` (${selectedAssets.size} selected)`}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={fetchAssets}
                  disabled={isLoading}
                  className="p-2 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
                  title="Refresh"
                >
                  <ArrowPathIcon
                    className={`w-5 h-5 ${isLoading ? "animate-spin" : ""}`}
                  />
                </button>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <CloudArrowUpIcon className="w-5 h-5" />
                  Upload
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*,video/*,application/pdf"
                  className="hidden"
                  onChange={(e) =>
                    e.target.files && handleUpload(e.target.files)
                  }
                />
              </div>
            </div>
          </header>

          {/* Toolbar */}
          <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-3">
            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search assets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>

              {/* Type filter */}
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="all">All Types</option>
                <option value="image/">Images</option>
                <option value="video/">Videos</option>
                <option value="application/pdf">PDFs</option>
              </select>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortField)}
                className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="date">Newest First</option>
                <option value="name">Name</option>
                <option value="size">Size</option>
              </select>

              {/* View mode toggle */}
              <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-1.5 rounded ${
                    viewMode === "grid"
                      ? "bg-white dark:bg-slate-700 shadow-sm"
                      : "text-slate-500"
                  }`}
                >
                  <Squares2X2Icon className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-1.5 rounded ${
                    viewMode === "list"
                      ? "bg-white dark:bg-slate-700 shadow-sm"
                      : "text-slate-500"
                  }`}
                >
                  <ListBulletIcon className="w-5 h-5" />
                </button>
              </div>

              {/* Bulk actions */}
              {selectedAssets.size > 0 && (
                <div className="flex items-center gap-2 ml-auto">
                  <button
                    onClick={handleBulkDelete}
                    className="inline-flex items-center gap-2 px-3 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <TrashIcon className="w-4 h-4" />
                    Delete ({selectedAssets.size})
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="mx-6 mt-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <p className="text-red-700 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* Content Area */}
          <div
            className={`flex-1 overflow-auto p-6 ${
              isDragging ? "bg-blue-50 dark:bg-blue-900/20" : ""
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            {/* Upload dropzone overlay */}
            {isDragging && (
              <div className="fixed inset-0 z-50 bg-blue-500/20 flex items-center justify-center pointer-events-none">
                <div className="bg-white dark:bg-slate-900 rounded-xl p-8 shadow-xl">
                  <CloudArrowUpIcon className="w-16 h-16 text-blue-500 mx-auto" />
                  <p className="mt-4 text-lg font-medium text-slate-900 dark:text-white">
                    Drop files to upload
                  </p>
                </div>
              </div>
            )}

            {/* Uploading indicator */}
            {isUploading && (
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-3">
                  <ArrowPathIcon className="w-5 h-5 text-blue-500 animate-spin" />
                  <span className="text-blue-700 dark:text-blue-400">
                    Uploading...
                  </span>
                </div>
              </div>
            )}

            {/* Folders in current view */}
            {folders.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-3">
                  Folders
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
                  {folders.map((folder) => (
                    <button
                      key={folder.id}
                      onClick={() => navigateToFolder(folder.id, folder.name)}
                      className="flex flex-col items-center p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 transition-colors group"
                    >
                      <FolderIcon
                        className="w-12 h-12 text-amber-400 group-hover:text-amber-500"
                        style={
                          folder.color ? { color: folder.color } : undefined
                        }
                      />
                      <span className="mt-2 text-sm font-medium text-slate-700 dark:text-slate-300 truncate max-w-full">
                        {folder.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Assets */}
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <ArrowPathIcon className="w-8 h-8 text-slate-400 animate-spin" />
              </div>
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
                {filteredAssets.map((asset) => (
                  <AssetGridItem
                    key={asset.id}
                    asset={asset}
                    isSelected={selectedAssets.has(asset.id)}
                    onToggleSelect={() => toggleAssetSelection(asset.id)}
                    onOpen={() => setSelectedAsset(asset)}
                  />
                ))}
              </div>
            ) : (
              <AssetListView
                assets={filteredAssets}
                selectedAssets={selectedAssets}
                onToggleSelect={toggleAssetSelection}
                onOpen={setSelectedAsset}
                formatDate={formatDate}
              />
            )}

            {!isLoading &&
              filteredAssets.length === 0 &&
              folders.length === 0 && (
                <div className="text-center py-12">
                  <PhotoIcon className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto" />
                  <p className="text-slate-500 dark:text-slate-400 mt-4">
                    No assets found
                  </p>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-2 mt-4 text-blue-600 hover:text-blue-700"
                  >
                    <CloudArrowUpIcon className="w-5 h-5" />
                    Upload your first asset
                  </button>
                </div>
              )}
          </div>
        </div>

        {/* Right Sidebar - Asset Detail */}
        {selectedAsset && (
          <AssetDetailPanel
            asset={selectedAsset}
            onClose={() => setSelectedAsset(null)}
            onDelete={() => handleDelete(selectedAsset.id)}
            onUpdate={async (updates) => {
              try {
                const res = await fetch(`/api/media/${selectedAsset.id}`, {
                  method: "PUT",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(updates),
                });
                if (!res.ok) throw new Error("Failed to update");
                const data = await res.json();
                setSelectedAsset(data.asset);
                await fetchAssets();
              } catch (err) {
                setError(err instanceof Error ? err.message : "Update failed");
              }
            }}
            formatDate={formatDate}
          />
        )}

        {/* New Folder Dialog */}
        {showNewFolderDialog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setShowNewFolderDialog(false)}
            />
            <div className="relative bg-white dark:bg-slate-900 rounded-xl shadow-xl w-full max-w-md p-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                New Folder
              </h3>
              <input
                type="text"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="Folder name"
                className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
                onKeyDown={(e) => e.key === "Enter" && handleCreateFolder()}
              />
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowNewFolderDialog(false)}
                  className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateFolder}
                  disabled={!newFolderName.trim()}
                  className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

// Folder Tree Navigation Component
interface FolderTreeNavProps {
  folders: FolderTreeItem[];
  currentFolderId: string | null;
  onNavigate: (id: string | null, name: string) => void;
  level: number;
}

const FolderTreeNav: React.FC<FolderTreeNavProps> = ({
  folders,
  currentFolderId,
  onNavigate,
  level,
}) => {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const toggleExpand = (id: string) => {
    const newExpanded = new Set(expanded);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpanded(newExpanded);
  };

  return (
    <div className="ml-2">
      {folders.map((folder) => (
        <div key={folder.id}>
          <div className="flex items-center">
            {folder.children.length > 0 && (
              <button
                onClick={() => toggleExpand(folder.id)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                {expanded.has(folder.id) ? (
                  <ChevronDownIcon className="w-4 h-4" />
                ) : (
                  <ChevronRightIcon className="w-4 h-4" />
                )}
              </button>
            )}
            <button
              onClick={() => onNavigate(folder.id, folder.name)}
              className={`flex-1 flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                currentFolderId === folder.id
                  ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                  : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
              style={{
                paddingLeft: folder.children.length === 0 ? "32px" : undefined,
              }}
            >
              <FolderIcon
                className="w-5 h-5"
                style={folder.color ? { color: folder.color } : undefined}
              />
              <span className="truncate">{folder.name}</span>
              {folder.assetCount > 0 && (
                <span className="ml-auto text-xs text-slate-400">
                  {folder.assetCount}
                </span>
              )}
            </button>
          </div>
          {expanded.has(folder.id) && folder.children.length > 0 && (
            <FolderTreeNav
              folders={folder.children}
              currentFolderId={currentFolderId}
              onNavigate={onNavigate}
              level={level + 1}
            />
          )}
        </div>
      ))}
    </div>
  );
};

// Asset Grid Item Component
interface AssetGridItemProps {
  asset: MediaAsset;
  isSelected: boolean;
  onToggleSelect: () => void;
  onOpen: () => void;
}

const AssetGridItem: React.FC<AssetGridItemProps> = ({
  asset,
  isSelected,
  onToggleSelect,
  onOpen,
}) => {
  const isImage = asset.mimeType.startsWith("image/");

  return (
    <div
      className={`relative group bg-white dark:bg-slate-800 rounded-lg border overflow-hidden transition-all cursor-pointer ${
        isSelected
          ? "border-blue-500 ring-2 ring-blue-500"
          : "border-slate-200 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500"
      }`}
      onClick={onOpen}
    >
      {/* Selection checkbox */}
      <div
        className="absolute top-2 left-2 z-10"
        onClick={(e) => {
          e.stopPropagation();
          onToggleSelect();
        }}
      >
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => {}}
          className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
        />
      </div>

      {/* Thumbnail */}
      <div className="aspect-square bg-slate-100 dark:bg-slate-700 flex items-center justify-center overflow-hidden">
        {isImage && asset.thumbnailUrl ? (
          <img
            src={asset.thumbnailUrl}
            alt={asset.altText || asset.originalName}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={(e) => {
              // Fallback to original if thumbnail fails
              (e.target as HTMLImageElement).src = asset.url || "";
            }}
          />
        ) : (
          <PhotoIcon className="w-12 h-12 text-slate-400" />
        )}
      </div>

      {/* Info */}
      <div className="p-3">
        <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
          {asset.originalName}
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          {formatFileSize(asset.size)}
        </p>
      </div>
    </div>
  );
};

// Asset List View Component
interface AssetListViewProps {
  assets: MediaAsset[];
  selectedAssets: Set<string>;
  onToggleSelect: (id: string) => void;
  onOpen: (asset: MediaAsset) => void;
  formatDate: (date: Date, options: any) => string;
}

const AssetListView: React.FC<AssetListViewProps> = ({
  assets,
  selectedAssets,
  onToggleSelect,
  onOpen,
  formatDate,
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
      <table className="w-full">
        <thead className="bg-slate-50 dark:bg-slate-800/50">
          <tr>
            <th className="w-10 px-4 py-3"></th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">
              Name
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">
              Type
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">
              Size
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">
              Modified
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
          {assets.map((asset) => (
            <tr
              key={asset.id}
              onClick={() => onOpen(asset)}
              className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
            >
              <td className="px-4 py-3">
                <input
                  type="checkbox"
                  checked={selectedAssets.has(asset.id)}
                  onChange={() => onToggleSelect(asset.id)}
                  onClick={(e) => e.stopPropagation()}
                  className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded bg-slate-100 dark:bg-slate-700 flex items-center justify-center overflow-hidden flex-shrink-0">
                    {asset.mimeType.startsWith("image/") &&
                    asset.thumbnailUrl ? (
                      <img
                        src={asset.thumbnailUrl}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <PhotoIcon className="w-5 h-5 text-slate-400" />
                    )}
                  </div>
                  <span className="font-medium text-slate-900 dark:text-white truncate">
                    {asset.originalName}
                  </span>
                </div>
              </td>
              <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                {asset.mimeType.split("/")[1]?.toUpperCase() || asset.mimeType}
              </td>
              <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                {formatFileSize(asset.size)}
              </td>
              <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                {formatDate(new Date(asset.updatedAt), {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Asset Detail Panel Component
interface AssetDetailPanelProps {
  asset: MediaAsset;
  onClose: () => void;
  onDelete: () => void;
  onUpdate: (updates: Partial<MediaAsset>) => Promise<void>;
  formatDate: (date: Date, options: any) => string;
}

const AssetDetailPanel: React.FC<AssetDetailPanelProps> = ({
  asset,
  onClose,
  onDelete,
  onUpdate,
  formatDate,
}) => {
  const [editMode, setEditMode] = useState(false);
  const [title, setTitle] = useState(asset.title);
  const [altText, setAltText] = useState(asset.altText);
  const [description, setDescription] = useState(asset.description);
  const [tags, setTags] = useState(asset.tags.join(", "));

  const handleSave = async () => {
    await onUpdate({
      title,
      altText,
      description,
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    });
    setEditMode(false);
  };

  const isImage = asset.mimeType.startsWith("image/");

  return (
    <aside className="w-80 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 flex-shrink-0 flex flex-col">
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <h3 className="font-semibold text-slate-900 dark:text-white">
          Details
        </h3>
        <button
          onClick={onClose}
          className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
        >
          <XMarkIcon className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-auto">
        {/* Preview */}
        <div className="aspect-video bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
          {isImage && asset.url ? (
            <img
              src={asset.url}
              alt={asset.altText || asset.originalName}
              className="max-w-full max-h-full object-contain"
            />
          ) : (
            <PhotoIcon className="w-16 h-16 text-slate-400" />
          )}
        </div>

        <div className="p-4 space-y-4">
          {/* Filename */}
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase mb-1">
              Filename
            </p>
            <p className="text-sm text-slate-900 dark:text-white break-all">
              {asset.originalName}
            </p>
          </div>

          {/* Dimensions */}
          {asset.dimensions && (
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase mb-1">
                Dimensions
              </p>
              <p className="text-sm text-slate-900 dark:text-white">
                {asset.dimensions.width} x {asset.dimensions.height}
              </p>
            </div>
          )}

          {/* Size */}
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase mb-1">
              Size
            </p>
            <p className="text-sm text-slate-900 dark:text-white">
              {formatFileSize(asset.size)}
            </p>
          </div>

          {/* Editable fields */}
          {editMode ? (
            <>
              <div>
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 uppercase mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 uppercase mb-1">
                  Alt Text
                </label>
                <input
                  type="text"
                  value={altText}
                  onChange={(e) => setAltText(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 uppercase mb-1">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 uppercase mb-1">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="hero, banner, homepage"
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditMode(false)}
                  className="px-4 py-2 text-slate-600 dark:text-slate-400 text-sm hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <>
              <div>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase mb-1">
                  Title
                </p>
                <p className="text-sm text-slate-900 dark:text-white">
                  {asset.title || "-"}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase mb-1">
                  Alt Text
                </p>
                <p className="text-sm text-slate-900 dark:text-white">
                  {asset.altText || "-"}
                </p>
              </div>

              {asset.tags.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase mb-1">
                    Tags
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {asset.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={() => setEditMode(true)}
                className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-medium rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                Edit Metadata
              </button>
            </>
          )}

          {/* URL */}
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase mb-1">
              URL
            </p>
            <input
              type="text"
              value={asset.url || ""}
              readOnly
              onClick={(e) => (e.target as HTMLInputElement).select()}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-mono"
            />
          </div>

          {/* Dates */}
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase mb-1">
              Uploaded
            </p>
            <p className="text-sm text-slate-900 dark:text-white">
              {formatDate(new Date(asset.createdAt), {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          {/* Usage */}
          {asset.usageLocations.length > 0 && (
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase mb-1">
                Used in
              </p>
              <div className="space-y-1">
                {asset.usageLocations.map((usage, i) => (
                  <div
                    key={i}
                    className="text-sm text-slate-700 dark:text-slate-300 flex items-center gap-2"
                  >
                    <ArrowRightIcon className="w-3 h-3 text-slate-400" />
                    {usage.entityName}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Delete */}
          <button
            onClick={onDelete}
            className="w-full px-4 py-2 text-red-600 dark:text-red-400 text-sm font-medium hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
          >
            Delete Asset
          </button>
        </div>
      </div>
    </aside>
  );
};

export default MediaAdmin;
