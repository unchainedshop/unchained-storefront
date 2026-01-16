/**
 * Collection List Block
 * Display entries from a content collection
 */

import React, { useEffect, useState } from "react";
import classNames from "classnames";
import Link from "next/link";
import { RectangleStackIcon } from "@heroicons/react/24/outline";
import type { PageBlock, CollectionListContent } from "../../../types";
import { usePageBuilder } from "../../../context/PageBuilderContext";
import InlineRichText from "../../InlineRichText";

interface CollectionEntry {
  id: string;
  slug: string;
  content: Record<string, unknown>;
  publishedAt?: string;
}

interface CollectionListProps {
  block: PageBlock;
  isPreview?: boolean;
  isEditing?: boolean;
}

const CollectionList: React.FC<CollectionListProps> = ({
  block,
  isPreview,
  isEditing = true,
}) => {
  const content = block.content as unknown as CollectionListContent;
  const style = block.style;
  const { state } = usePageBuilder();
  const canEdit = isEditing && !state.isPreviewMode;

  const [entries, setEntries] = useState<CollectionEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch collection entries
  useEffect(() => {
    if (!content.collectionSlug) {
      setEntries([]);
      return;
    }

    const fetchEntries = async () => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams({
          limit: String(content.limit || 6),
          sortBy: content.sortBy || "createdAt",
          sortOrder: content.sortOrder || "desc",
        });

        const res = await fetch(
          `/api/collections/public/${content.collectionSlug}?${params}`,
        );

        if (!res.ok) {
          throw new Error("Failed to fetch entries");
        }

        const data = await res.json();
        setEntries(data.items || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error loading entries");
        setEntries([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEntries();
  }, [
    content.collectionSlug,
    content.limit,
    content.sortBy,
    content.sortOrder,
  ]);

  const containerStyle: React.CSSProperties = {
    backgroundColor: style.backgroundColor,
    padding: style.padding
      ? `${style.padding.top}px ${style.padding.right}px ${style.padding.bottom}px ${style.padding.left}px`
      : undefined,
  };

  const columnClasses = {
    2: "md:grid-cols-2",
    3: "md:grid-cols-3",
    4: "md:grid-cols-4",
  };

  const mobileColumnClasses = {
    1: "grid-cols-1",
    2: "grid-cols-2",
  };

  // Get display fields from content or use defaults
  const displayFields = content.displayFields?.length
    ? content.displayFields
    : ["title", "excerpt", "image"];

  // Helper to get field value
  const getFieldValue = (
    entry: CollectionEntry,
    fieldName: string,
  ): string | undefined => {
    const value = entry.content[fieldName];
    if (typeof value === "string") return value;
    if (value && typeof value === "object" && "text" in value)
      return (value as { text?: string }).text;
    return undefined;
  };

  // Helper to get image
  const getImage = (entry: CollectionEntry): string | undefined => {
    // Try common image field names
    for (const field of ["image", "thumbnail", "featuredImage", "cover"]) {
      const value = entry.content[field];
      if (typeof value === "string" && value) return value;
      if (value && typeof value === "object") {
        const obj = value as { url?: string; src?: string };
        if (obj.url) return obj.url;
        if (obj.src) return obj.src;
      }
    }
    return undefined;
  };

  // Helper to get title
  const getTitle = (entry: CollectionEntry): string => {
    for (const field of ["title", "name", "heading"]) {
      const value = getFieldValue(entry, field);
      if (value) return value;
    }
    return entry.slug;
  };

  // Helper to get excerpt
  const getExcerpt = (entry: CollectionEntry): string | undefined => {
    for (const field of [
      "excerpt",
      "description",
      "summary",
      "content",
      "body",
    ]) {
      const value = getFieldValue(entry, field);
      if (value) {
        // Strip HTML and truncate
        const text = value.replace(/<[^>]*>/g, "");
        return text.length > 150 ? text.slice(0, 150) + "..." : text;
      }
    }
    return undefined;
  };

  // Build link URL
  const getEntryLink = (entry: CollectionEntry): string => {
    if (content.linkPattern) {
      return content.linkPattern
        .replace("{slug}", entry.slug)
        .replace("{collection}", content.collectionSlug);
    }
    return `/${content.collectionSlug}/${entry.slug}`;
  };

  // Empty state
  if (!content.collectionSlug && canEdit) {
    return (
      <div
        className="flex flex-col items-center justify-center py-16 px-4 bg-periwinkle-50/30 dark:bg-periwinkle-500/5 rounded-xl border-2 border-dashed border-periwinkle-300 dark:border-periwinkle-400/50"
        style={containerStyle}
      >
        <RectangleStackIcon className="w-10 h-10 text-periwinkle-400 dark:text-periwinkle-300 mb-3" />
        <p className="text-periwinkle-400 dark:text-periwinkle-300 text-sm font-medium">
          Select a collection in the settings panel
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={containerStyle} className="min-h-[200px]">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/3 mb-4" />
            <div
              className={classNames(
                "grid gap-6",
                mobileColumnClasses[content.mobileColumns || 1],
                columnClasses[content.columns || 3],
              )}
            >
              {[...Array(content.limit || 3)].map((_, i) => (
                <div
                  key={i}
                  className="bg-slate-100 dark:bg-slate-800 rounded-xl overflow-hidden"
                >
                  <div className="h-40 bg-slate-200 dark:bg-slate-700" />
                  <div className="p-4 space-y-2">
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
                    <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400"
        style={containerStyle}
      >
        {error}
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center py-16 px-4 bg-periwinkle-50/30 dark:bg-periwinkle-500/5 rounded-xl"
        style={containerStyle}
      >
        <RectangleStackIcon className="w-10 h-10 text-periwinkle-400 dark:text-periwinkle-300 mb-3" />
        <p className="text-periwinkle-400 dark:text-periwinkle-300 text-sm font-medium">
          No entries found in this collection
        </p>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        {(content.heading || content.subheading || canEdit) && (
          <div className="text-center mb-12">
            <InlineRichText
              blockId={block.id}
              field="heading"
              value={content.heading || ""}
              tag="h2"
              className="text-3xl md:text-4xl font-bold mb-3"
              style={{ color: style.textColor }}
              placeholder="Add heading..."
              multiline={false}
              enableLinks={false}
            />
            <InlineRichText
              blockId={block.id}
              field="subheading"
              value={content.subheading || ""}
              tag="p"
              className="text-lg opacity-80"
              style={{ color: style.textColor }}
              placeholder="Add subheading..."
              multiline={false}
            />
          </div>
        )}

        {/* Grid Layout */}
        {(content.layout === "grid" || content.layout === "cards") && (
          <div
            className={classNames(
              "grid",
              mobileColumnClasses[content.mobileColumns || 1],
              columnClasses[content.columns || 3],
            )}
            style={{ gap: content.gap || 24 }}
          >
            {entries.map((entry) => {
              const image = content.showImage ? getImage(entry) : undefined;
              const title = getTitle(entry);
              const excerpt = content.showExcerpt
                ? getExcerpt(entry)
                : undefined;
              const link = getEntryLink(entry);

              return (
                <Link
                  key={entry.id}
                  href={link}
                  className="group block bg-white dark:bg-slate-800 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-all hover:shadow-lg"
                >
                  {image && (
                    <div className="aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-slate-700">
                      <img
                        src={image}
                        alt={title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="p-5">
                    <h3
                      className="font-semibold text-lg mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2"
                      style={{ color: style.textColor }}
                    >
                      {title}
                    </h3>
                    {excerpt && (
                      <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3">
                        {excerpt}
                      </p>
                    )}
                    {content.showReadMore && (
                      <span className="inline-block mt-3 text-sm font-medium text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {content.readMoreText || "Read more"} &rarr;
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* List Layout */}
        {content.layout === "list" && (
          <div className="space-y-4">
            {entries.map((entry) => {
              const image = content.showImage ? getImage(entry) : undefined;
              const title = getTitle(entry);
              const excerpt = content.showExcerpt
                ? getExcerpt(entry)
                : undefined;
              const link = getEntryLink(entry);

              return (
                <Link
                  key={entry.id}
                  href={link}
                  className="group flex gap-6 p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-all hover:shadow-lg"
                >
                  {image && (
                    <div className="w-32 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-700">
                      <img
                        src={image}
                        alt={title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3
                      className="font-semibold text-lg mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
                      style={{ color: style.textColor }}
                    >
                      {title}
                    </h3>
                    {excerpt && (
                      <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                        {excerpt}
                      </p>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default CollectionList;
