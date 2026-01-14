/**
 * Media Library
 * Admin page to manage all media assets (DAM)
 */

import React, { useState, useCallback, useMemo, useRef } from "react";
import Link from "next/link";
import { useIntl } from "react-intl";
import {
  TrashIcon,
  MagnifyingGlassIcon,
  ArrowPathIcon,
  PhotoIcon,
  FolderIcon,
  FolderPlusIcon,
  CloudArrowUpIcon,
  Squares2X2Icon,
  ListBulletIcon,
  TagIcon,
  ChevronRightIcon,
  DocumentIcon,
  FilmIcon,
  CheckIcon,
  XMarkIcon,
  ArrowDownTrayIcon,
} from "@heroicons/react/24/outline";
import MetaTags from "../../../modules/common/components/MetaTags";
import { useMedia } from "../../../modules/media/hooks/useMedia";
import UnchainedLogo from "../../../modules/page-builder/components/UnchainedLogo";
import AdminNavIsland from "../../../modules/page-builder/components/AdminNavIsland";
import { formatFileSize } from "../../../modules/media/utils/formatters";
import type {
  MediaAsset,
  MediaFolder,
  SortField,
} from "../../../modules/media/types";

type ViewMode = "grid" | "list";

const MediaAdmin: React.FC = () => {
  const { formatDate } = useIntl();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    assets,
    folders,
    folderTree,
    tags,
    total,
    isLoading,
    error,
    refresh,
    deleteAsset,
    bulkDelete,
    createFolder,
    currentFolderId,
    setCurrentFolderId,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
  } = useMedia();

  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [selectedAssets, setSelectedAssets] = useState<Set<string>>(new Set());
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const currentFolder = useMemo(() => {
    if (!currentFolderId) return null;
    return folders.find((f) => f.id === currentFolderId) || null;
  }, [currentFolderId, folders]);

  const breadcrumbs = useMemo(() => {
    const path: MediaFolder[] = [];
    let folder = currentFolder;
    while (folder) {
      path.unshift(folder);
      folder = folders.find((f) => f.id === folder?.parentId) || null;
    }
    return path;
  }, [currentFolder, folders]);

  const subfolders = useMemo(() => {
    return folders.filter((f) => f.parentId === currentFolderId);
  }, [folders, currentFolderId]);

  const stats = useMemo(() => {
    const images = assets.filter((a) => a.mimeType.startsWith("image/")).length;
    const videos = assets.filter((a) => a.mimeType.startsWith("video/")).length;
    const documents = assets.filter(
      (a) =>
        a.mimeType.includes("pdf") ||
        a.mimeType.includes("document") ||
        a.mimeType.startsWith("text/"),
    ).length;
    const totalSize = assets.reduce((sum, a) => sum + a.size, 0);
    return { images, videos, documents, totalSize };
  }, [assets]);

  const handleSelectAsset = useCallback(
    (assetId: string, selected: boolean) => {
      setSelectedAssets((prev) => {
        const next = new Set(prev);
        if (selected) next.add(assetId);
        else next.delete(assetId);
        return next;
      });
    },
    [],
  );

  const handleBulkDelete = useCallback(async () => {
    const success = await bulkDelete(Array.from(selectedAssets));
    if (success) setSelectedAssets(new Set());
  }, [bulkDelete, selectedAssets]);

  const handleCreateFolder = useCallback(async () => {
    if (!newFolderName.trim()) return;
    const folder = await createFolder(newFolderName.trim(), currentFolderId);
    if (folder) {
      setNewFolderName("");
      setIsCreatingFolder(false);
    }
  }, [createFolder, currentFolderId, newFolderName]);

  const handleUpload = useCallback(
    async (files: FileList) => {
      setIsUploading(true);
      try {
        for (const file of Array.from(files)) {
          const formData = new FormData();
          formData.append("file", file);
          if (currentFolderId) formData.append("folderId", currentFolderId);
          const res = await fetch("/api/media/upload", {
            method: "POST",
            body: formData,
          });
          if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            console.error("Upload failed:", res.status, errorData);
            alert(`Upload failed: ${errorData.error || res.statusText}`);
            break;
          }
        }
        await refresh();
      } catch (err) {
        console.error("Upload failed:", err);
        alert(
          `Upload failed: ${err instanceof Error ? err.message : "Network error"}`,
        );
      } finally {
        setIsUploading(false);
      }
    },
    [currentFolderId, refresh],
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0)
        handleUpload(e.target.files);
    },
    [handleUpload],
  );

  return (
    <>
      <MetaTags title="Media Library - Admin" />
      <div className="min-h-screen bg-gradient-to-b from-slate-100 to-slate-50 dark:from-slate-950 dark:to-slate-900">
        <div className="relative overflow-hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
          <div
            className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
            style={{
              backgroundImage:
                "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-slate-200 dark:bg-slate-800 rounded-full opacity-20 blur-3xl" />
          <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-slate-300 dark:bg-slate-700 rounded-full opacity-15 blur-3xl" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-10 md:py-14">
              <div className="flex items-center gap-3 mb-8">
                <div className="flex items-center gap-3 px-4 py-2 bg-slate-50 dark:bg-slate-800/50 rounded-full border border-slate-200 dark:border-slate-700">
                  <UnchainedLogo
                    size={20}
                    className="text-slate-900 dark:text-white"
                  />
                  <div className="h-4 w-px bg-slate-300 dark:bg-slate-600" />
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Digital Asset Management
                  </span>
                  <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full">
                    v0.2
                  </span>
                </div>
              </div>

              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
                <div className="space-y-3">
                  <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white">
                    Media Library
                  </h1>
                  <p className="text-lg text-slate-600 dark:text-slate-400 max-w-md">
                    Upload, organize, and manage all your digital assets in one
                    place
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={refresh}
                    disabled={isLoading}
                    className="p-3 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-white dark:bg-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md"
                    title="Refresh"
                  >
                    <ArrowPathIcon
                      className={"w-5 h-5 " + (isLoading ? "animate-spin" : "")}
                    />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="group inline-flex items-center gap-2 px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold rounded-xl hover:bg-slate-800 dark:hover:bg-slate-100 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                  >
                    <CloudArrowUpIcon className="w-5 h-5" />
                    {isUploading ? "Uploading..." : "Upload Files"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="lg:w-64 flex-shrink-0">
              <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-4 sticky top-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                    Folders
                  </h3>
                  <button
                    onClick={() => setIsCreatingFolder(true)}
                    className="p-1.5 text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                    title="New Folder"
                  >
                    <FolderPlusIcon className="w-4 h-4" />
                  </button>
                </div>

                {isCreatingFolder && (
                  <div className="flex items-center gap-2 mb-3">
                    <input
                      type="text"
                      value={newFolderName}
                      onChange={(e) => setNewFolderName(e.target.value)}
                      placeholder="Folder name"
                      className="flex-1 px-3 py-1.5 text-sm bg-slate-50 dark:bg-slate-800 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleCreateFolder();
                        if (e.key === "Escape") setIsCreatingFolder(false);
                      }}
                    />
                    <button
                      onClick={handleCreateFolder}
                      className="p-1.5 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg"
                    >
                      <CheckIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setIsCreatingFolder(false)}
                      className="p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                    >
                      <XMarkIcon className="w-4 h-4" />
                    </button>
                  </div>
                )}

                <button
                  onClick={() => setCurrentFolderId(null)}
                  className={
                    "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors " +
                    (currentFolderId === null
                      ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900"
                      : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800")
                  }
                >
                  <FolderIcon className="w-4 h-4" />
                  All Assets
                </button>

                <div className="mt-2 space-y-1">
                  {folderTree.map((folder) => (
                    <FolderItem
                      key={folder.id}
                      folder={folder}
                      currentFolderId={currentFolderId}
                      onSelect={setCurrentFolderId}
                      depth={0}
                    />
                  ))}
                </div>

                {tags.length > 0 && (
                  <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800">
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">
                      Tags
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {tags.slice(0, 10).map(({ tag, count }) => (
                        <button
                          key={tag}
                          className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                        >
                          <TagIcon className="w-3 h-3" />
                          {tag}
                          <span className="text-slate-400 dark:text-slate-500">
                            {count}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex-1 min-w-0">
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-6">
                  <p className="text-red-700 dark:text-red-400">{error}</p>
                </div>
              )}

              <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-4 mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <nav className="flex items-center gap-1 text-sm">
                    <button
                      onClick={() => setCurrentFolderId(null)}
                      className="text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
                    >
                      All Assets
                    </button>
                    {breadcrumbs.map((folder) => (
                      <React.Fragment key={folder.id}>
                        <ChevronRightIcon className="w-4 h-4 text-slate-400" />
                        <button
                          onClick={() => setCurrentFolderId(folder.id)}
                          className="text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
                        >
                          {folder.name}
                        </button>
                      </React.Fragment>
                    ))}
                  </nav>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={
                        "p-2 rounded-lg transition-colors " +
                        (viewMode === "grid"
                          ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900"
                          : "text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800")
                      }
                    >
                      <Squares2X2Icon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={
                        "p-2 rounded-lg transition-colors " +
                        (viewMode === "list"
                          ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900"
                          : "text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800")
                      }
                    >
                      <ListBulletIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 mt-4">
                  <div className="relative flex-1">
                    <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search assets..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white text-slate-900 dark:text-white placeholder:text-slate-400"
                    />
                  </div>
                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as SortField)}
                      className="appearance-none pl-4 pr-10 py-3 bg-slate-50 dark:bg-slate-800 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white text-slate-900 dark:text-white cursor-pointer"
                    >
                      <option value="date">Date</option>
                      <option value="name">Name</option>
                      <option value="size">Size</option>
                      <option value="usage">Usage</option>
                    </select>
                    <svg
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>

                {selectedAssets.size > 0 && (
                  <div className="flex items-center gap-3 mt-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      {selectedAssets.size} selected
                    </span>
                    <button
                      onClick={handleBulkDelete}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      <TrashIcon className="w-4 h-4" />
                      Delete
                    </button>
                    <button
                      onClick={() => setSelectedAssets(new Set())}
                      className="text-sm text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
                    >
                      Clear selection
                    </button>
                  </div>
                )}
              </div>

              {subfolders.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-3">
                    Folders
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {subfolders.map((folder) => (
                      <button
                        key={folder.id}
                        onClick={() => setCurrentFolderId(folder.id)}
                        className="flex items-center gap-3 p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-600 transition-all hover:shadow-md"
                      >
                        <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                          <FolderIcon className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                        </div>
                        <span className="text-sm font-medium text-slate-900 dark:text-white truncate">
                          {folder.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                {isLoading ? (
                  <div className="flex items-center justify-center py-16">
                    <ArrowPathIcon className="w-8 h-8 text-slate-400 animate-spin" />
                  </div>
                ) : assets.length > 0 ? (
                  viewMode === "grid" ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-4">
                      {assets.map((asset) => (
                        <AssetCard
                          key={asset.id}
                          asset={asset}
                          isSelected={selectedAssets.has(asset.id)}
                          onSelect={handleSelectAsset}
                          onDelete={deleteAsset}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-100 dark:divide-slate-800">
                      {assets.map((asset) => (
                        <AssetRow
                          key={asset.id}
                          asset={asset}
                          isSelected={selectedAssets.has(asset.id)}
                          onSelect={handleSelectAsset}
                          onDelete={deleteAsset}
                          formatDate={formatDate}
                        />
                      ))}
                    </div>
                  )
                ) : (
                  <div className="text-center py-16">
                    <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
                      <PhotoIcon className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                      No assets found
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 mb-6">
                      {searchQuery
                        ? "Try adjusting your search"
                        : "Upload your first asset to get started"}
                    </p>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold rounded-lg hover:bg-slate-800 dark:hover:bg-slate-100 transition-all"
                    >
                      <CloudArrowUpIcon className="w-5 h-5" />
                      Upload Files
                    </button>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-center gap-2 mt-8 text-sm text-slate-400 dark:text-slate-500">
                <UnchainedLogo
                  size={12}
                  className="text-slate-400 dark:text-slate-500"
                />
                <span>Powered by Unchained Commerce</span>
              </div>
            </div>

            <div className="lg:w-64 flex-shrink-0">
              <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-5 sticky top-8">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">
                  Overview
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                        <PhotoIcon className="w-4 h-4 text-slate-500" />
                      </div>
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        Images
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-slate-900 dark:text-white">
                      {stats.images}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                        <FilmIcon className="w-4 h-4 text-slate-500" />
                      </div>
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        Videos
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-slate-900 dark:text-white">
                      {stats.videos}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                        <DocumentIcon className="w-4 h-4 text-slate-500" />
                      </div>
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        Documents
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-slate-900 dark:text-white">
                      {stats.documents}
                    </span>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500 dark:text-slate-400">
                      Total assets
                    </span>
                    <span className="text-sm font-semibold text-slate-900 dark:text-white">
                      {total}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm text-slate-500 dark:text-slate-400">
                      Storage used
                    </span>
                    <span className="text-sm font-semibold text-slate-900 dark:text-white">
                      {formatFileSize(stats.totalSize)}
                    </span>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800">
                  <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
                    Quick Actions
                  </h4>
                  <div className="space-y-2">
                    <Link
                      href="/admin/pages"
                      className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                    >
                      <DocumentIcon className="w-4 h-4" />
                      Go to Pages
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Island */}
      <AdminNavIsland />
    </>
  );
};

interface FolderItemProps {
  folder: { id: string; name: string; children: any[]; assetCount: number };
  currentFolderId: string | null;
  onSelect: (id: string) => void;
  depth: number;
}

const FolderItem: React.FC<FolderItemProps> = ({
  folder,
  currentFolderId,
  onSelect,
  depth,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isSelected = currentFolderId === folder.id;
  const hasChildren = folder.children.length > 0;

  return (
    <div>
      <button
        onClick={() => onSelect(folder.id)}
        className={
          "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors " +
          (isSelected
            ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900"
            : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800")
        }
        style={{ paddingLeft: 12 + depth * 12 + "px" }}
      >
        {hasChildren && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            className="p-0.5"
          >
            <ChevronRightIcon
              className={
                "w-3 h-3 transition-transform " +
                (isExpanded ? "rotate-90" : "")
              }
            />
          </button>
        )}
        <FolderIcon className="w-4 h-4" />
        <span className="truncate">{folder.name}</span>
        {folder.assetCount > 0 && (
          <span
            className={
              "text-xs " +
              (isSelected
                ? "text-white/60 dark:text-slate-900/60"
                : "text-slate-400")
            }
          >
            {folder.assetCount}
          </span>
        )}
      </button>
      {isExpanded && hasChildren && (
        <div className="ml-2">
          {folder.children.map((child) => (
            <FolderItem
              key={child.id}
              folder={child}
              currentFolderId={currentFolderId}
              onSelect={onSelect}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

interface AssetCardProps {
  asset: MediaAsset;
  isSelected: boolean;
  onSelect: (id: string, selected: boolean) => void;
  onDelete: (asset: MediaAsset) => void;
}

const AssetCard: React.FC<AssetCardProps> = ({
  asset,
  isSelected,
  onSelect,
  onDelete,
}) => {
  const isImage = asset.mimeType.startsWith("image/");
  return (
    <div
      className={
        "group relative rounded-xl border-2 overflow-hidden transition-all cursor-pointer " +
        (isSelected
          ? "border-slate-900 dark:border-white ring-2 ring-slate-900 dark:ring-white"
          : "border-transparent hover:border-slate-300 dark:hover:border-slate-600")
      }
      onClick={() => onSelect(asset.id, !isSelected)}
    >
      <div className="aspect-square bg-slate-100 dark:bg-slate-800">
        {isImage && asset.thumbnailUrl ? (
          <img
            src={asset.thumbnailUrl}
            alt={asset.altText || asset.originalName}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <PhotoIcon className="w-12 h-12 text-slate-300 dark:text-slate-600" />
          </div>
        )}
      </div>
      <div
        className={
          "absolute top-2 left-2 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all " +
          (isSelected
            ? "bg-slate-900 dark:bg-white border-slate-900 dark:border-white"
            : "bg-white/80 dark:bg-slate-900/80 border-slate-300 dark:border-slate-600 opacity-0 group-hover:opacity-100")
        }
      >
        {isSelected && (
          <CheckIcon className="w-3 h-3 text-white dark:text-slate-900" />
        )}
      </div>
      <div className="p-2">
        <p className="text-xs font-medium text-slate-900 dark:text-white truncate">
          {asset.originalName}
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {formatFileSize(asset.size)}
        </p>
      </div>
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(asset);
          }}
          className="p-1.5 bg-white dark:bg-slate-800 text-slate-400 hover:text-red-500 rounded-lg shadow-sm transition-colors"
        >
          <TrashIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

interface AssetRowProps {
  asset: MediaAsset;
  isSelected: boolean;
  onSelect: (id: string, selected: boolean) => void;
  onDelete: (asset: MediaAsset) => void;
  formatDate: (date: Date, options: any) => string;
}

const AssetRow: React.FC<AssetRowProps> = ({
  asset,
  isSelected,
  onSelect,
  onDelete,
  formatDate,
}) => {
  const isImage = asset.mimeType.startsWith("image/");
  const Icon = isImage
    ? PhotoIcon
    : asset.mimeType.startsWith("video/")
      ? FilmIcon
      : DocumentIcon;
  return (
    <div
      className={
        "group flex items-center gap-4 p-4 cursor-pointer transition-colors " +
        (isSelected
          ? "bg-slate-50 dark:bg-slate-800/50"
          : "hover:bg-slate-50 dark:hover:bg-slate-800/50")
      }
      onClick={() => onSelect(asset.id, !isSelected)}
    >
      <div
        className={
          "w-5 h-5 rounded border-2 flex items-center justify-center transition-all " +
          (isSelected
            ? "bg-slate-900 dark:bg-white border-slate-900 dark:border-white"
            : "border-slate-300 dark:border-slate-600")
        }
      >
        {isSelected && (
          <CheckIcon className="w-3 h-3 text-white dark:text-slate-900" />
        )}
      </div>
      <div className="w-12 h-12 rounded-lg bg-slate-100 dark:bg-slate-800 flex-shrink-0 overflow-hidden">
        {isImage && asset.thumbnailUrl ? (
          <img
            src={asset.thumbnailUrl}
            alt={asset.altText || asset.originalName}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Icon className="w-6 h-6 text-slate-400" />
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
          {asset.originalName}
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {formatFileSize(asset.size)} •{" "}
          {formatDate(new Date(asset.updatedAt), {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </p>
      </div>
      {asset.tags.length > 0 && (
        <div className="hidden sm:flex items-center gap-1">
          {asset.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 text-xs bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <a
          href={asset.url}
          download
          onClick={(e) => e.stopPropagation()}
          className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
        >
          <ArrowDownTrayIcon className="w-4 h-4" />
        </a>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(asset);
          }}
          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
        >
          <TrashIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default MediaAdmin;
