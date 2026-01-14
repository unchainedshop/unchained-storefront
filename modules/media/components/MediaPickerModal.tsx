/**
 * MediaPickerModal Component
 * Modal for selecting media assets from the DAM library
 */

import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";
import classNames from "classnames";
import {
  XMarkIcon,
  MagnifyingGlassIcon,
  PhotoIcon,
  FolderIcon,
  CloudArrowUpIcon,
  ArrowPathIcon,
  CheckIcon,
  ChevronLeftIcon,
} from "@heroicons/react/24/outline";
import type { MediaAsset, MediaFolder } from "../types";
import { formatFileSize } from "../utils/mediaUtils";

interface MediaPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (asset: MediaAsset) => void;
  allowedTypes?: string[];
  multiple?: boolean;
  currentValue?: string;
}

type Tab = "browse" | "upload";

const MediaPickerModal: React.FC<MediaPickerModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  allowedTypes = ["image/*"],
  multiple = false,
  currentValue,
}) => {
  const [activeTab, setActiveTab] = useState<Tab>("browse");
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [folders, setFolders] = useState<MediaFolder[]>([]);
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [breadcrumb, setBreadcrumb] = useState<
    { id: string | null; name: string }[]
  >([{ id: null, name: "All Media" }]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<MediaAsset | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Memoize allowedTypes to prevent infinite re-renders
  // (array props create new references on each render)
  const allowedTypesKey = allowedTypes.join(",");
  const stableAllowedTypes = useMemo(() => allowedTypes, [allowedTypesKey]);

  // Fetch assets
  const fetchAssets = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (currentFolderId) {
        params.set("folderId", currentFolderId);
      } else {
        params.set("folderId", "null");
      }
      params.set("sortBy", "date");
      params.set("sortOrder", "desc");
      params.set("limit", "50");

      // Filter by allowed types
      if (
        stableAllowedTypes.length === 1 &&
        stableAllowedTypes[0].endsWith("/*")
      ) {
        params.set("mimeType", stableAllowedTypes[0].replace("/*", "/"));
      }

      try {
        const res = await fetch(`/api/media?${params.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setAssets(data.assets || []);
        } else {
          setAssets([]);
        }
      } catch {
        // Network error - silently set empty assets
        setAssets([]);
      }

      // Fetch folders
      try {
        const folderParams = new URLSearchParams();
        if (currentFolderId) {
          folderParams.set("parentId", currentFolderId);
        } else {
          folderParams.set("parentId", "null");
        }
        const foldersRes = await fetch(
          `/api/media/folders?${folderParams.toString()}`,
        );
        if (foldersRes.ok) {
          const foldersData = await foldersRes.json();
          setFolders(foldersData.folders || []);
        } else {
          setFolders([]);
        }
      } catch {
        // Network error - silently set empty folders
        setFolders([]);
      }
    } catch (err) {
      console.error("Failed to fetch assets:", err);
      setAssets([]);
      setFolders([]);
    } finally {
      setIsLoading(false);
    }
  }, [currentFolderId, stableAllowedTypes]);

  useEffect(() => {
    if (isOpen) {
      fetchAssets();
    }
  }, [isOpen, fetchAssets]);

  // Filter by search
  const filteredAssets = assets.filter((asset) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      asset.originalName.toLowerCase().includes(query) ||
      asset.title.toLowerCase().includes(query) ||
      asset.tags.some((t) => t.toLowerCase().includes(query))
    );
  });

  // Navigation
  const navigateToFolder = (folderId: string | null, folderName: string) => {
    setCurrentFolderId(folderId);
    setSelectedAsset(null);

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

  const goBack = () => {
    if (breadcrumb.length > 1) {
      const parent = breadcrumb[breadcrumb.length - 2];
      navigateToFolder(parent.id, parent.name);
    }
  };

  // Handle selection
  const handleSelect = () => {
    if (selectedAsset) {
      onSelect(selectedAsset);
      onClose();
      resetState();
    }
  };

  const handleAssetClick = (asset: MediaAsset) => {
    setSelectedAsset(asset);
  };

  const handleAssetDoubleClick = (asset: MediaAsset) => {
    onSelect(asset);
    onClose();
    resetState();
  };

  // Upload
  const handleUpload = async (files: FileList | File[]) => {
    if (!files.length) return;

    setIsUploading(true);

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

      if (res.ok) {
        const data = await res.json();
        await fetchAssets();
        // Select the newly uploaded asset
        if (data.asset) {
          setSelectedAsset(data.asset);
        } else if (data.assets?.length > 0) {
          setSelectedAsset(data.assets[0]);
        }
        setActiveTab("browse");
      }
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setIsUploading(false);
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

  const resetState = () => {
    setSelectedAsset(null);
    setSearchQuery("");
    setCurrentFolderId(null);
    setBreadcrumb([{ id: null, name: "All Media" }]);
    setActiveTab("browse");
  };

  // Keyboard handling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "Enter" && selectedAsset) {
        handleSelect();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, selectedAsset, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1050] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-[fadeIn_150ms_ease-out]"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-4xl max-h-[85vh] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-[modalIn_150ms_cubic-bezier(0.16,1,0.3,1)]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 dark:bg-white/10 dark:backdrop-blur-sm dark:border dark:border-white/20 flex items-center justify-center">
              <PhotoIcon className="w-5 h-5 text-white dark:text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                Select Media
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Choose an image from your library or upload a new one
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 px-6 py-3 border-b border-slate-100 dark:border-slate-800">
          <button
            onClick={() => setActiveTab("browse")}
            className={classNames(
              "px-4 py-2 text-sm font-medium rounded-lg transition-colors",
              activeTab === "browse"
                ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800",
            )}
          >
            Browse Library
          </button>
          <button
            onClick={() => setActiveTab("upload")}
            className={classNames(
              "px-4 py-2 text-sm font-medium rounded-lg transition-colors",
              activeTab === "upload"
                ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800",
            )}
          >
            Upload New
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {activeTab === "browse" ? (
            <>
              {/* Search and breadcrumb */}
              <div className="px-6 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center gap-4">
                {/* Back button */}
                {breadcrumb.length > 1 && (
                  <button
                    onClick={goBack}
                    className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                  >
                    <ChevronLeftIcon className="w-5 h-5" />
                  </button>
                )}

                {/* Breadcrumb */}
                <div className="flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400">
                  {breadcrumb.map((item, index) => (
                    <React.Fragment key={item.id ?? "root"}>
                      {index > 0 && <span>/</span>}
                      <button
                        onClick={() => navigateToFolder(item.id, item.name)}
                        className={classNames(
                          "hover:text-slate-900 dark:hover:text-white",
                          index === breadcrumb.length - 1 &&
                            "font-medium text-slate-700 dark:text-slate-300",
                        )}
                      >
                        {item.name}
                      </button>
                    </React.Fragment>
                  ))}
                </div>

                {/* Search */}
                <div className="relative flex-1 max-w-xs ml-auto">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search..."
                    className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-800 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400 dark:focus:ring-slate-500"
                  />
                </div>
              </div>

              {/* Grid */}
              <div className="flex-1 overflow-auto p-6">
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <ArrowPathIcon className="w-8 h-8 text-slate-400 animate-spin" />
                  </div>
                ) : (
                  <>
                    {/* Folders */}
                    {folders.length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase mb-3">
                          Folders
                        </h3>
                        <div className="grid grid-cols-6 gap-3">
                          {folders.map((folder) => (
                            <button
                              key={folder.id}
                              onClick={() =>
                                navigateToFolder(folder.id, folder.name)
                              }
                              className="flex flex-col items-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                            >
                              <FolderIcon className="w-8 h-8 text-amber-400" />
                              <span className="mt-1 text-xs text-slate-700 dark:text-slate-300 truncate max-w-full">
                                {folder.name}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Assets */}
                    {filteredAssets.length > 0 ? (
                      <div className="grid grid-cols-6 gap-3">
                        {filteredAssets.map((asset) => {
                          const isSelected = selectedAsset?.id === asset.id;
                          const isImage = asset.mimeType.startsWith("image/");

                          return (
                            <button
                              key={asset.id}
                              onClick={() => handleAssetClick(asset)}
                              onDoubleClick={() =>
                                handleAssetDoubleClick(asset)
                              }
                              className={classNames(
                                "relative group flex flex-col rounded-lg overflow-hidden border transition-all",
                                isSelected
                                  ? "border-slate-900 dark:border-white ring-2 ring-slate-900 dark:ring-white"
                                  : "border-slate-200 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500",
                              )}
                            >
                              {/* Thumbnail */}
                              <div className="aspect-square bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden">
                                {isImage && asset.thumbnailUrl ? (
                                  <img
                                    src={asset.thumbnailUrl}
                                    alt={asset.altText || asset.originalName}
                                    className="w-full h-full object-cover"
                                    loading="lazy"
                                    onError={(e) => {
                                      (e.target as HTMLImageElement).src =
                                        asset.url || "";
                                    }}
                                  />
                                ) : (
                                  <PhotoIcon className="w-8 h-8 text-slate-400" />
                                )}
                              </div>

                              {/* Selected indicator */}
                              {isSelected && (
                                <div className="absolute top-2 right-2 w-6 h-6 bg-slate-900 dark:bg-white rounded-full flex items-center justify-center">
                                  <CheckIcon className="w-4 h-4 text-white dark:text-slate-900" />
                                </div>
                              )}

                              {/* Name */}
                              <div className="p-2">
                                <p className="text-xs text-slate-700 dark:text-slate-300 truncate">
                                  {asset.originalName}
                                </p>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    ) : folders.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <PhotoIcon className="w-12 h-12 text-slate-300 dark:text-slate-600" />
                        <p className="mt-4 text-slate-500 dark:text-slate-400">
                          No media found
                        </p>
                        <button
                          onClick={() => setActiveTab("upload")}
                          className="mt-2 text-slate-900 dark:text-white text-sm underline hover:no-underline"
                        >
                          Upload your first image
                        </button>
                      </div>
                    ) : null}
                  </>
                )}
              </div>
            </>
          ) : (
            /* Upload Tab */
            <div
              className={classNames(
                "flex-1 flex items-center justify-center p-6",
                isDragging && "bg-slate-100 dark:bg-slate-800",
              )}
              onDrop={handleDrop}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
            >
              <div className="text-center">
                {isUploading ? (
                  <>
                    <ArrowPathIcon className="w-12 h-12 text-slate-700 dark:text-slate-300 animate-spin mx-auto" />
                    <p className="mt-4 text-slate-700 dark:text-slate-300">
                      Uploading...
                    </p>
                  </>
                ) : (
                  <>
                    <CloudArrowUpIcon className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto" />
                    <p className="mt-4 text-lg font-medium text-slate-700 dark:text-slate-300">
                      Drag & drop files here
                    </p>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      or click to browse
                    </p>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="mt-6 px-6 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-medium rounded-lg hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors"
                    >
                      Browse Files
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept={allowedTypes.join(",")}
                      className="hidden"
                      onChange={(e) =>
                        e.target.files && handleUpload(e.target.files)
                      }
                    />
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
          {/* Selected preview */}
          {selectedAsset ? (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded bg-slate-200 dark:bg-slate-700 overflow-hidden">
                {selectedAsset.mimeType.startsWith("image/") &&
                selectedAsset.thumbnailUrl ? (
                  <img
                    src={selectedAsset.thumbnailUrl}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <PhotoIcon className="w-5 h-5 text-slate-400 m-auto mt-2.5" />
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900 dark:text-white">
                  {selectedAsset.originalName}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {formatFileSize(selectedAsset.size)}
                  {selectedAsset.dimensions &&
                    ` • ${selectedAsset.dimensions.width}×${selectedAsset.dimensions.height}`}
                </p>
              </div>
            </div>
          ) : (
            <span className="text-sm text-slate-500 dark:text-slate-400">
              Select an image to continue
            </span>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSelect}
              disabled={!selectedAsset}
              className="px-6 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-medium rounded-lg hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Select
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaPickerModal;
