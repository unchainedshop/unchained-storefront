/**
 * MediaPickerModal Component
 * Modal for selecting media assets from the DAM library
 *
 * Design System: Frost (Glassmorphism Minimalist)
 */

import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";
import { createPortal } from "react-dom";
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
  ScissorsIcon,
} from "@heroicons/react/24/outline";
import type { MediaAsset, MediaFolder } from "../types";
import { formatFileSize } from "../utils/mediaUtils";
import CropEditor, { CropArea, AspectRatioPreset } from "./CropEditor";

/**
 * Truncate a filename with "..." in the middle, preserving the extension
 */
function truncateFilename(filename: string, maxLength = 40): string {
  if (filename.length <= maxLength) return filename;

  const extIndex = filename.lastIndexOf(".");
  const ext = extIndex > 0 ? filename.slice(extIndex) : "";
  const name = extIndex > 0 ? filename.slice(0, extIndex) : filename;

  const availableLength = maxLength - ext.length - 3;
  if (availableLength <= 0) return filename.slice(0, maxLength - 3) + "...";

  const startLength = Math.ceil(availableLength / 2);
  const endLength = Math.floor(availableLength / 2);

  return name.slice(0, startLength) + "..." + name.slice(-endLength) + ext;
}

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
  const [showCropEditor, setShowCropEditor] = useState(false);
  const [isCropping, setIsCropping] = useState(false);

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
      } else {
        const errorData = await res.json().catch(() => ({}));
        console.error("Upload failed:", res.status, errorData);
        alert(`Upload failed: ${errorData.error || res.statusText}`);
      }
    } catch (err) {
      console.error("Upload failed:", err);
      alert(
        `Upload failed: ${err instanceof Error ? err.message : "Network error"}`,
      );
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

  // Crop functionality
  const handleCropSave = async (
    crop: CropArea,
    aspectRatio: AspectRatioPreset,
  ) => {
    if (!selectedAsset) return;

    setIsCropping(true);
    setShowCropEditor(false);

    try {
      const res = await fetch("/api/media/crop", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assetId: selectedAsset.id,
          crop: {
            x: crop.x,
            y: crop.y,
            width: crop.width,
            height: crop.height,
          },
          format: "webp",
          quality: 85,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.asset) {
          // Select the newly cropped asset
          setSelectedAsset(data.asset);
          // Refresh assets list to show the new cropped image
          await fetchAssets();
        }
      } else {
        console.error("Crop failed:", await res.text());
      }
    } catch (err) {
      console.error("Crop error:", err);
    } finally {
      setIsCropping(false);
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

  // Use portal to render at document body level (escape sidebar overflow)
  const modalContent = (
    <div className="fixed inset-0 z-[1050] flex justify-end">
      {/* Frost Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-[fadeIn_150ms_ease-out]"
        onClick={onClose}
      />

      {/* Frost Panel */}
      <div
        className={classNames(
          "relative w-3/4 max-w-5xl h-[calc(100vh-24px)] my-3 mr-3",
          "flex flex-col overflow-hidden",
          "rounded-2xl",
          // Frost glassmorphism
          "bg-white/80 dark:bg-slate-900/80",
          "backdrop-blur-2xl backdrop-saturate-150",
          "border border-white/60 dark:border-white/10",
          "shadow-[0_8px_32px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)]",
          "animate-[slideInRight_200ms_cubic-bezier(0.16,1,0.3,1)]",
        )}
      >
        {/* Frost Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200/50 dark:border-slate-700/50">
          <div className="flex items-center gap-3">
            <div
              className={classNames(
                "w-9 h-9 rounded-xl flex items-center justify-center",
                "bg-slate-900/90 dark:bg-white/10",
                "backdrop-blur-sm",
                "border border-slate-800 dark:border-white/20",
              )}
            >
              <PhotoIcon className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-medium text-slate-700 dark:text-slate-200">
                Select Media
              </h2>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
                Choose from library or upload new
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 rounded-lg transition-colors"
          >
            <XMarkIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Frost Tabs */}
        <div className="flex items-center gap-1 px-5 py-2.5 border-b border-slate-200/50 dark:border-slate-700/50">
          <button
            onClick={() => setActiveTab("browse")}
            className={classNames(
              "px-3 py-1.5 text-[11px] font-medium rounded-lg transition-all",
              activeTab === "browse"
                ? "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 shadow-sm border border-slate-200/80 dark:border-slate-700/80"
                : "text-slate-500 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-800/50",
            )}
          >
            Browse Library
          </button>
          <button
            onClick={() => setActiveTab("upload")}
            className={classNames(
              "px-3 py-1.5 text-[11px] font-medium rounded-lg transition-all",
              activeTab === "upload"
                ? "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 shadow-sm border border-slate-200/80 dark:border-slate-700/80"
                : "text-slate-500 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-800/50",
            )}
          >
            Upload New
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {activeTab === "browse" ? (
            <>
              {/* Frost Search and breadcrumb */}
              <div className="px-5 py-2.5 border-b border-slate-200/50 dark:border-slate-700/50 flex items-center gap-3">
                {/* Back button */}
                {breadcrumb.length > 1 && (
                  <button
                    onClick={goBack}
                    className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-white/50 dark:hover:bg-slate-800/50 rounded-lg transition-colors"
                  >
                    <ChevronLeftIcon className="w-4 h-4" />
                  </button>
                )}

                {/* Breadcrumb */}
                <div className="flex items-center gap-1 text-[11px] text-slate-400 dark:text-slate-500">
                  {breadcrumb.map((item, index) => (
                    <React.Fragment key={item.id ?? "root"}>
                      {index > 0 && <span className="opacity-50">/</span>}
                      <button
                        onClick={() => navigateToFolder(item.id, item.name)}
                        className={classNames(
                          "hover:text-slate-700 dark:hover:text-slate-300 transition-colors",
                          index === breadcrumb.length - 1 &&
                            "font-medium text-slate-600 dark:text-slate-400",
                        )}
                      >
                        {item.name}
                      </button>
                    </React.Fragment>
                  ))}
                </div>

                {/* Frost Search */}
                <div className="relative flex-1 max-w-[200px] ml-auto">
                  <MagnifyingGlassIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search..."
                    className={classNames(
                      "w-full pl-8 pr-3 py-1.5 text-[11px]",
                      "bg-white/60 dark:bg-slate-800/60",
                      "backdrop-blur-sm",
                      "border border-slate-200/80 dark:border-slate-700/50",
                      "rounded-lg",
                      "text-slate-600 dark:text-slate-300",
                      "placeholder:text-slate-400 dark:placeholder:text-slate-500",
                      "focus:outline-none focus:bg-white dark:focus:bg-slate-800",
                      "focus:border-slate-300 dark:focus:border-slate-600",
                      "transition-all",
                    )}
                  />
                </div>
              </div>

              {/* Frost Grid */}
              <div className="flex-1 overflow-auto p-4">
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <ArrowPathIcon className="w-6 h-6 text-slate-400 animate-spin" />
                  </div>
                ) : (
                  <>
                    {/* Frost Folders */}
                    {folders.length > 0 && (
                      <div className="mb-5">
                        <h3 className="text-[10px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2.5">
                          Folders
                        </h3>
                        <div className="grid grid-cols-5 gap-2">
                          {folders.map((folder) => (
                            <button
                              key={folder.id}
                              onClick={() =>
                                navigateToFolder(folder.id, folder.name)
                              }
                              className={classNames(
                                "flex flex-col items-center p-2.5 rounded-xl transition-all",
                                "bg-white/50 dark:bg-slate-800/50",
                                "border border-slate-200/60 dark:border-slate-700/40",
                                "hover:bg-white dark:hover:bg-slate-800",
                                "hover:border-slate-300 dark:hover:border-slate-600",
                                "hover:shadow-sm",
                              )}
                            >
                              <FolderIcon className="w-6 h-6 text-slate-400 dark:text-slate-500" />
                              <span className="mt-1 text-[10px] text-slate-600 dark:text-slate-400 truncate max-w-full">
                                {folder.name}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Frost Assets */}
                    {filteredAssets.length > 0 ? (
                      <div className="grid grid-cols-5 gap-2">
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
                                "relative group flex flex-col rounded-xl overflow-hidden transition-all",
                                "border",
                                isSelected
                                  ? "border-slate-400 dark:border-slate-400 ring-1 ring-slate-400 dark:ring-slate-400 bg-white dark:bg-slate-800 shadow-md"
                                  : "border-slate-200/60 dark:border-slate-700/40 bg-white/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-sm",
                              )}
                            >
                              {/* Thumbnail */}
                              <div className="aspect-square bg-slate-50 dark:bg-slate-800/80 flex items-center justify-center overflow-hidden">
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
                                  <PhotoIcon className="w-6 h-6 text-slate-300 dark:text-slate-600" />
                                )}
                              </div>

                              {/* Selected indicator */}
                              {isSelected && (
                                <div className="absolute top-1.5 right-1.5 w-5 h-5 bg-slate-500 dark:bg-slate-400 rounded-full flex items-center justify-center shadow-sm">
                                  <CheckIcon className="w-3 h-3 text-white dark:text-slate-900" />
                                </div>
                              )}

                              {/* Name */}
                              <div className="p-2">
                                <p className="text-[10px] text-slate-600 dark:text-slate-400 truncate">
                                  {asset.originalName}
                                </p>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    ) : folders.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <PhotoIcon className="w-10 h-10 text-slate-300 dark:text-slate-600" />
                        <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
                          No media found
                        </p>
                        <button
                          onClick={() => setActiveTab("upload")}
                          className="mt-1 text-slate-600 dark:text-slate-300 text-[11px] underline hover:no-underline"
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
            /* Frost Upload Tab */
            <div
              className={classNames(
                "flex-1 flex items-center justify-center p-6",
                isDragging && "bg-white/50 dark:bg-slate-800/50",
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
                    <ArrowPathIcon className="w-10 h-10 text-slate-500 dark:text-slate-400 animate-spin mx-auto" />
                    <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
                      Uploading...
                    </p>
                  </>
                ) : (
                  <>
                    <div
                      className={classNames(
                        "w-20 h-20 mx-auto rounded-2xl flex items-center justify-center",
                        "bg-white/60 dark:bg-slate-800/60",
                        "border border-slate-200/60 dark:border-slate-700/40",
                      )}
                    >
                      <CloudArrowUpIcon className="w-10 h-10 text-slate-300 dark:text-slate-600" />
                    </div>
                    <p className="mt-4 text-sm font-medium text-slate-600 dark:text-slate-300">
                      Drag & drop files here
                    </p>
                    <p className="mt-0.5 text-[11px] text-slate-400 dark:text-slate-500">
                      or click to browse
                    </p>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className={classNames(
                        "mt-5 px-5 py-2 text-xs font-medium rounded-full transition-all",
                        "bg-slate-800 dark:bg-white/90",
                        "text-white dark:text-slate-800",
                        "hover:bg-slate-700 dark:hover:bg-white",
                        "shadow-sm hover:shadow-md",
                      )}
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

        {/* Frost Footer */}
        <div className="px-5 py-3 border-t border-slate-200/50 dark:border-slate-700/50 bg-white/40 dark:bg-slate-900/40 backdrop-blur-sm flex items-center justify-between">
          {/* Selected preview */}
          {selectedAsset ? (
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 overflow-hidden border border-slate-200/60 dark:border-slate-700/40">
                {selectedAsset.mimeType.startsWith("image/") &&
                selectedAsset.thumbnailUrl ? (
                  <img
                    src={selectedAsset.thumbnailUrl}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <PhotoIcon className="w-4 h-4 text-slate-400 m-auto mt-2" />
                )}
              </div>
              <div>
                <p className="text-[11px] font-medium text-slate-700 dark:text-slate-200">
                  {truncateFilename(selectedAsset.originalName, 30)}
                </p>
                <p className="text-[10px] text-slate-400 dark:text-slate-500">
                  {formatFileSize(selectedAsset.size)}
                  {selectedAsset.dimensions &&
                    ` • ${selectedAsset.dimensions.width}×${selectedAsset.dimensions.height}`}
                </p>
              </div>
            </div>
          ) : (
            <span className="text-[11px] text-slate-400 dark:text-slate-500">
              Select an image to continue
            </span>
          )}

          {/* Frost Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 text-[11px] text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100/50 dark:hover:bg-slate-800/50 rounded-lg transition-colors"
            >
              Cancel
            </button>
            {selectedAsset && selectedAsset.mimeType.startsWith("image/") && (
              <button
                onClick={() => setShowCropEditor(true)}
                disabled={isCropping}
                className={classNames(
                  "flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium rounded-lg transition-all",
                  "text-slate-600 dark:text-slate-300",
                  "bg-white dark:bg-slate-800",
                  "border border-slate-200/80 dark:border-slate-700/80",
                  "hover:bg-slate-50 dark:hover:bg-slate-700",
                  "disabled:opacity-50",
                )}
              >
                {isCropping ? (
                  <ArrowPathIcon className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <ScissorsIcon className="w-3.5 h-3.5" />
                )}
                Crop
              </button>
            )}
            <button
              onClick={handleSelect}
              disabled={!selectedAsset}
              className={classNames(
                "px-4 py-1.5 text-[11px] font-medium rounded-lg transition-all",
                "bg-slate-800 dark:bg-white/90",
                "text-white dark:text-slate-800",
                "hover:bg-slate-700 dark:hover:bg-white",
                "disabled:opacity-50 disabled:cursor-not-allowed",
              )}
            >
              Select
            </button>
          </div>
        </div>
      </div>

      {/* Crop Editor Modal */}
      {showCropEditor && selectedAsset && selectedAsset.url && (
        <CropEditor
          imageUrl={selectedAsset.url}
          onSave={handleCropSave}
          onCancel={() => setShowCropEditor(false)}
        />
      )}
    </div>
  );

  // Render to document body via portal
  if (typeof document !== "undefined") {
    return createPortal(modalContent, document.body);
  }

  return modalContent;
};

export default MediaPickerModal;
