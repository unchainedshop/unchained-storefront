/**
 * Collection Picker Field
 * Allows selecting a content collection (Blog, FAQ, Team, etc.) for use in page builder blocks
 */

import { useEffect, useState } from "react";
import type { CollectionSchema } from "../../../collections/types";

interface CollectionPickerFieldProps {
  value?: string;
  onChange: (collectionSlug: string | undefined) => void;
  onBlur?: () => void;
}

export default function CollectionPickerField({
  value,
  onChange,
  onBlur,
}: CollectionPickerFieldProps) {
  const [collections, setCollections] = useState<CollectionSchema[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const response = await fetch("/api/collections/schemas");
        if (response.ok) {
          const data = await response.json();
          // Filter to only show active content collections
          setCollections(
            data.filter(
              (c: CollectionSchema) =>
                c.status === "active" && c.type === "content"
            )
          );
        }
      } catch (error) {
        console.error("Failed to fetch collections:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCollections();
  }, []);

  const getLocalizedValue = (
    value: Record<string, string> | string | undefined,
    locale = "de"
  ): string => {
    if (!value) return "";
    if (typeof value === "string") return value;
    return value[locale] || value.de || value.en || Object.values(value)[0] || "";
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-neutral-400">
        <svg
          className="h-4 w-4 animate-spin"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
        Loading collections...
      </div>
    );
  }

  if (collections.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-neutral-600 p-4 text-center">
        <p className="text-sm text-neutral-400">No collections available</p>
        <a
          href="/admin/collections/new"
          className="mt-2 inline-block text-sm text-blue-400 hover:text-blue-300"
        >
          Create a collection
        </a>
      </div>
    );
  }

  const selectedCollection = collections.find((c) => c.slug === value);

  return (
    <div className="space-y-2">
      <select
        value={value || ""}
        onChange={(e) => onChange(e.target.value || undefined)}
        onBlur={onBlur}
        className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
      >
        <option value="">Select a collection...</option>
        {collections.map((collection) => (
          <option key={collection.slug} value={collection.slug}>
            {getLocalizedValue(collection.name)}
          </option>
        ))}
      </select>

      {selectedCollection && (
        <div className="flex items-center gap-2 rounded-lg bg-neutral-800/50 p-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/20">
            <svg
              className="h-4 w-4 text-blue-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="truncate text-sm font-medium text-white">
              {getLocalizedValue(selectedCollection.name)}
            </p>
            <p className="text-xs text-neutral-400">
              {selectedCollection.fields.length} fields
            </p>
          </div>
          <a
            href={`/admin/collections/${selectedCollection.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-400 hover:text-white"
            title="Edit collection"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
        </div>
      )}
    </div>
  );
}
