/**
 * Product Collection Picker Field
 * Allows selecting a product collection for ProductGrid/ProductCarousel blocks
 */

import React, { useState, useEffect, useCallback } from "react";
import {
  MagnifyingGlassIcon,
  ChevronDownIcon,
  XMarkIcon,
  ShoppingBagIcon,
  ArrowPathIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";
import { getLocalizedValue } from "../../../collections/utils/helpers";
import { cmsConfig } from "../../../../lib/cms.config";
import type { ProductCollection } from "../../../collections/types";

interface ProductCollectionPickerFieldProps {
  value?: string;
  onChange: (collectionId: string | undefined) => void;
  onBlur?: () => void;
}

const ProductCollectionPickerField: React.FC<
  ProductCollectionPickerFieldProps
> = ({ value, onChange, onBlur }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [collections, setCollections] = useState<ProductCollection[]>([]);
  const [selectedCollection, setSelectedCollection] =
    useState<ProductCollection | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchCollections = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        status: "published",
        limit: "50",
      });
      if (searchQuery) {
        params.set("search", searchQuery);
      }

      const res = await fetch(`/api/collections/products?${params}`);
      if (res.ok) {
        const data = await res.json();
        setCollections(data.items || []);
      }
    } catch (error) {
      console.error("Failed to fetch collections:", error);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery]);

  // Fetch selected collection details
  useEffect(() => {
    if (value && !selectedCollection) {
      const fetchSelected = async () => {
        try {
          const res = await fetch(`/api/collections/products/${value}`);
          if (res.ok) {
            const data = await res.json();
            setSelectedCollection(data.collection);
          }
        } catch (error) {
          console.error("Failed to fetch selected collection:", error);
        }
      };
      fetchSelected();
    }
  }, [value, selectedCollection]);

  // Fetch collections when dropdown opens
  useEffect(() => {
    if (isOpen) {
      fetchCollections();
    }
  }, [isOpen, fetchCollections]);

  // Debounced search
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(fetchCollections, 300);
      return () => clearTimeout(timer);
    }
  }, [searchQuery, isOpen]);

  const handleSelect = (collection: ProductCollection) => {
    setSelectedCollection(collection);
    onChange(collection.id);
    setIsOpen(false);
    setSearchQuery("");
    onBlur?.();
  };

  const handleClear = () => {
    setSelectedCollection(null);
    onChange(undefined);
    onBlur?.();
  };

  return (
    <div className="relative">
      {/* Selected Collection Display / Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-2 px-2 py-1.5 text-[11px] bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-md hover:border-slate-300 dark:hover:border-slate-600 focus:outline-none focus:ring-1 focus:ring-slate-400 transition-colors text-left"
      >
        <ShoppingBagIcon className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
        <span
          className={`flex-1 truncate ${
            selectedCollection
              ? "text-slate-900 dark:text-white"
              : "text-slate-400 dark:text-slate-500"
          }`}
        >
          {selectedCollection
            ? getLocalizedValue(selectedCollection.name, cmsConfig.defaultLocale)
            : "Select collection..."}
        </span>
        {selectedCollection ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleClear();
            }}
            className="p-0.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
          >
            <XMarkIcon className="w-3.5 h-3.5" />
          </button>
        ) : (
          <ChevronDownIcon
            className={`w-3.5 h-3.5 text-slate-400 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />

          {/* Dropdown Content */}
          <div className="absolute left-0 right-0 mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl z-50 overflow-hidden">
            {/* Search */}
            <div className="p-2 border-b border-slate-200 dark:border-slate-700">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search collections..."
                  className="w-full pl-7 pr-2 py-1.5 text-[11px] bg-slate-50 dark:bg-slate-900/50 border-0 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-400 text-slate-900 dark:text-white placeholder-slate-400"
                  autoFocus
                />
              </div>
            </div>

            {/* Collection List */}
            <div className="max-h-48 overflow-y-auto">
              {isLoading ? (
                <div className="flex items-center justify-center py-6">
                  <ArrowPathIcon className="w-4 h-4 text-slate-400 animate-spin" />
                </div>
              ) : collections.length === 0 ? (
                <div className="text-center py-6">
                  <ShoppingBagIcon className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-600 mb-2" />
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {searchQuery
                      ? "No collections found"
                      : "No product collections yet"}
                  </p>
                </div>
              ) : (
                <div className="py-1">
                  {collections.map((collection) => (
                    <button
                      key={collection.id}
                      type="button"
                      onClick={() => handleSelect(collection)}
                      className={`w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors ${
                        value === collection.id
                          ? "bg-slate-100 dark:bg-slate-700"
                          : ""
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-medium text-slate-900 dark:text-white truncate">
                          {getLocalizedValue(
                            collection.name,
                            cmsConfig.defaultLocale,
                          )}
                        </p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400">
                          {collection.productIds?.length || 0} products •{" "}
                          {collection.status}
                        </p>
                      </div>
                      {value === collection.id && (
                        <CheckIcon className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Create New Link */}
            <div className="p-2 border-t border-slate-200 dark:border-slate-700">
              <a
                href="/admin/collections/products"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 px-3 py-1.5 text-[11px] font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-50 dark:bg-slate-900/50 rounded-md hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
              >
                <ShoppingBagIcon className="w-3.5 h-3.5" />
                Manage Collections
              </a>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ProductCollectionPickerField;
