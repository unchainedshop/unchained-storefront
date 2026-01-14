/**
 * Store Locator Block
 * Interactive map with store locations and search functionality
 */

import React, { useState, useMemo } from "react";
import {
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  ClockIcon,
  MagnifyingGlassIcon,
  MapIcon,
} from "@heroicons/react/24/outline";
import type { PageBlock, StoreLocatorContent, StoreLocation } from "../../../types";

interface StoreLocatorProps {
  block: PageBlock;
  isPreview?: boolean;
}

const StoreLocator: React.FC<StoreLocatorProps> = ({ block, isPreview }) => {
  const content = block.content as unknown as StoreLocatorContent;
  const style = block.style;

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStore, setSelectedStore] = useState<StoreLocation | null>(null);

  const containerStyle: React.CSSProperties = {
    backgroundColor: style.backgroundColor,
    color: style.textColor,
    borderRadius: style.borderRadius,
    padding: style.padding
      ? `${style.padding.top}px ${style.padding.right}px ${style.padding.bottom}px ${style.padding.left}px`
      : undefined,
  };

  // Filter stores based on search
  const filteredStores = useMemo(() => {
    if (!searchQuery.trim()) return content.stores;

    const query = searchQuery.toLowerCase();
    return content.stores.filter(
      (store) =>
        store.name.toLowerCase().includes(query) ||
        store.city.toLowerCase().includes(query) ||
        store.address.toLowerCase().includes(query) ||
        store.postalCode?.toLowerCase().includes(query) ||
        store.country.toLowerCase().includes(query)
    );
  }, [content.stores, searchQuery]);

  // Generate Google Maps directions URL
  const getDirectionsUrl = (store: StoreLocation) => {
    const address = encodeURIComponent(
      `${store.address}, ${store.city}, ${store.state || ""} ${store.postalCode || ""}, ${store.country}`
    );
    return `https://www.google.com/maps/dir/?api=1&destination=${address}`;
  };

  // Generate static map URL (using OpenStreetMap tiles)
  const getMapUrl = (store: StoreLocation | null) => {
    const lat = store?.lat || content.defaultCenter?.lat || 40.7128;
    const lng = store?.lng || content.defaultCenter?.lng || -74.006;
    const zoom = content.defaultZoom || 12;

    // Using OpenStreetMap static tiles
    return `https://staticmap.openstreetmap.de/staticmap.php?center=${lat},${lng}&zoom=${zoom}&size=800x400&markers=${lat},${lng},red-pushpin`;
  };

  // Empty state
  if (content.stores.length === 0) {
    return (
      <div
        style={containerStyle}
        className="flex flex-col items-center justify-center py-16 px-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600"
      >
        <MapIcon className="w-12 h-12 text-slate-400 mb-3" />
        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
          Add store locations in the settings panel
        </p>
      </div>
    );
  }

  const listPositionClasses = {
    left: "flex-row",
    right: "flex-row-reverse",
    bottom: "flex-col",
  };

  return (
    <div style={containerStyle} className="space-y-6">
      {/* Header */}
      {(content.heading || content.subheading) && (
        <div className="text-center">
          {content.heading && (
            <h3 className="text-2xl font-bold mb-2">{content.heading}</h3>
          )}
          {content.subheading && (
            <p className="text-slate-600 dark:text-slate-400">{content.subheading}</p>
          )}
        </div>
      )}

      {/* Search */}
      {content.showSearch && (
        <div className="relative max-w-md mx-auto">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by city, zip code, or store name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      )}

      {/* Map and List Container */}
      <div
        className={`flex gap-6 ${listPositionClasses[content.listPosition || "left"]} ${
          content.listPosition === "bottom" ? "" : "max-lg:flex-col"
        }`}
      >
        {/* Store List */}
        {content.showList && (
          <div
            className={`${
              content.listPosition === "bottom"
                ? "w-full"
                : "w-full lg:w-96 flex-shrink-0"
            }`}
          >
            <div
              className={`space-y-3 ${
                content.listPosition === "bottom"
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                  : "max-h-[500px] overflow-y-auto pr-2"
              }`}
            >
              {filteredStores.map((store) => (
                <div
                  key={store.id}
                  onClick={() => setSelectedStore(store)}
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                    selectedStore?.id === store.id
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                      : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-800"
                  }`}
                >
                  {/* Store Image */}
                  {store.image && (
                    <img
                      src={store.image}
                      alt={store.name}
                      className="w-full h-32 object-cover rounded-lg mb-3"
                    />
                  )}

                  {/* Store Info */}
                  <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">
                    {store.name}
                  </h4>

                  <div className="space-y-1.5 text-sm text-slate-600 dark:text-slate-400">
                    <p className="flex items-start gap-2">
                      <MapPinIcon className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <span>
                        {store.address}
                        <br />
                        {store.city}
                        {store.state && `, ${store.state}`} {store.postalCode}
                        <br />
                        {store.country}
                      </span>
                    </p>

                    {store.phone && content.showPhoneLink && (
                      <a
                        href={`tel:${store.phone}`}
                        className="flex items-center gap-2 hover:text-blue-600 dark:hover:text-blue-400"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <PhoneIcon className="w-4 h-4" />
                        {store.phone}
                      </a>
                    )}

                    {store.email && (
                      <a
                        href={`mailto:${store.email}`}
                        className="flex items-center gap-2 hover:text-blue-600 dark:hover:text-blue-400"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <EnvelopeIcon className="w-4 h-4" />
                        {store.email}
                      </a>
                    )}

                    {store.hours && (
                      <p className="flex items-start gap-2">
                        <ClockIcon className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        <span className="whitespace-pre-line">{store.hours}</span>
                      </p>
                    )}
                  </div>

                  {/* Features */}
                  {store.features && store.features.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {store.features.map((feature) => (
                        <span
                          key={feature}
                          className="px-2 py-0.5 text-xs rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Directions Link */}
                  {content.showDirectionsLink && (
                    <a
                      href={getDirectionsUrl(store)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 mt-3 text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Get Directions
                      <svg
                        className="w-3 h-3"
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
                  )}
                </div>
              ))}

              {/* No results */}
              {filteredStores.length === 0 && (
                <div className="text-center py-8 text-slate-400 dark:text-slate-500">
                  No stores found matching your search
                </div>
              )}
            </div>
          </div>
        )}

        {/* Map */}
        <div className={`flex-grow ${content.listPosition === "bottom" ? "order-first" : ""}`}>
          <div
            className="relative rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800"
            style={{ minHeight: 400 }}
          >
            {/* Static Map Image (placeholder - in production, use Google Maps or Mapbox) */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <MapIcon className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                <p className="text-slate-500 dark:text-slate-400 text-sm">
                  {selectedStore
                    ? `${selectedStore.name} - ${selectedStore.city}`
                    : "Select a store to view on map"}
                </p>
                {selectedStore && (
                  <a
                    href={`https://www.google.com/maps?q=${selectedStore.lat},${selectedStore.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 mt-3 text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    View on Google Maps
                    <svg
                      className="w-3 h-3"
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
                )}
              </div>
            </div>

            {/* Store Markers (visual representation) */}
            {content.stores.map((store) => (
              <div
                key={store.id}
                className={`absolute transform -translate-x-1/2 -translate-y-full cursor-pointer transition-all ${
                  selectedStore?.id === store.id ? "scale-125 z-10" : "hover:scale-110"
                }`}
                style={{
                  // Simplified positioning (in production, use proper map projection)
                  left: `${((store.lng + 180) / 360) * 100}%`,
                  top: `${((90 - store.lat) / 180) * 100}%`,
                }}
                onClick={() => setSelectedStore(store)}
              >
                <MapPinIcon
                  className="w-8 h-8"
                  style={{ color: content.markerColor || "#3B82F6" }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreLocator;
