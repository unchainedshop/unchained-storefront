/**
 * Instagram Feed Block
 * Display Instagram posts in a grid, masonry, or carousel layout
 */

import React, { useState } from "react";
import {
  PhotoIcon,
  PlayIcon,
  Square2StackIcon,
  HeartIcon,
  ChatBubbleOvalLeftIcon,
} from "@heroicons/react/24/solid";
import type { PageBlock, InstagramFeedContent, InstagramPost } from "../../../types";

interface InstagramFeedProps {
  block: PageBlock;
  isPreview?: boolean;
}

// Instagram SVG Icon
const InstagramIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
);

const InstagramFeed: React.FC<InstagramFeedProps> = ({ block, isPreview }) => {
  const content = block.content as InstagramFeedContent;
  const style = block.style;

  const [hoveredPost, setHoveredPost] = useState<string | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const containerStyle: React.CSSProperties = {
    backgroundColor: style.backgroundColor,
    color: style.textColor,
    borderRadius: style.borderRadius,
    padding: style.padding
      ? `${style.padding.top}px ${style.padding.right}px ${style.padding.bottom}px ${style.padding.left}px`
      : undefined,
  };

  // Get visible posts based on limit
  const visiblePosts = content.posts.slice(0, content.limit);

  // Calculate grid columns
  const getGridColumns = () => {
    return {
      gridTemplateColumns: `repeat(${content.columns}, minmax(0, 1fr))`,
      gap: `${content.gap}px`,
    };
  };

  // Get mobile grid columns
  const getMobileGridColumns = () => ({
    gridTemplateColumns: `repeat(${content.mobileColumns}, minmax(0, 1fr))`,
  });

  // Render media type icon overlay
  const renderMediaTypeIcon = (post: InstagramPost) => {
    if (post.mediaType === "VIDEO") {
      return (
        <div className="absolute top-2 right-2">
          <PlayIcon className="w-6 h-6 text-white drop-shadow-lg" />
        </div>
      );
    }
    if (post.mediaType === "CAROUSEL_ALBUM") {
      return (
        <div className="absolute top-2 right-2">
          <Square2StackIcon className="w-6 h-6 text-white drop-shadow-lg" />
        </div>
      );
    }
    return null;
  };

  // Empty state
  if (content.posts.length === 0) {
    return (
      <div
        style={containerStyle}
        className="flex flex-col items-center justify-center py-16 px-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600"
      >
        <InstagramIcon className="w-12 h-12 text-slate-400 mb-3" />
        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium text-center">
          Connect your Instagram account or add posts manually
        </p>
        <p className="text-slate-400 dark:text-slate-500 text-xs mt-1">
          @{content.username || "username"}
        </p>
      </div>
    );
  }

  // Render post item
  const renderPost = (post: InstagramPost) => {
    const isHovered = hoveredPost === post.id;
    const showCaption =
      content.showCaption === "always" ||
      (content.showCaption === "hover" && isHovered);

    return (
      <a
        key={post.id}
        href={post.permalink}
        target="_blank"
        rel="noopener noreferrer"
        className="relative block overflow-hidden group bg-slate-100 dark:bg-slate-800"
        style={{
          aspectRatio: content.aspectRatio === "square" ? "1/1" : undefined,
        }}
        onMouseEnter={() => setHoveredPost(post.id)}
        onMouseLeave={() => setHoveredPost(null)}
      >
        <img
          src={post.imageUrl}
          alt={post.caption || "Instagram post"}
          className={`w-full h-full object-cover transition-transform duration-300 ${
            isHovered ? "scale-105" : ""
          }`}
          loading="lazy"
        />

        {/* Media type icon */}
        {renderMediaTypeIcon(post)}

        {/* Hover overlay */}
        <div
          className={`absolute inset-0 bg-black/50 flex items-center justify-center transition-opacity duration-300 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="flex items-center gap-4 text-white">
            <div className="flex items-center gap-1">
              <HeartIcon className="w-5 h-5" />
            </div>
            <div className="flex items-center gap-1">
              <ChatBubbleOvalLeftIcon className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Caption */}
        {showCaption && post.caption && (
          <div
            className={`absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent transition-opacity duration-300 ${
              content.showCaption === "always" || isHovered
                ? "opacity-100"
                : "opacity-0"
            }`}
          >
            <p className="text-white text-xs line-clamp-2">{post.caption}</p>
          </div>
        )}
      </a>
    );
  };

  // Carousel navigation
  const handlePrevSlide = () => {
    setCurrentSlide((prev) =>
      prev === 0 ? Math.max(0, visiblePosts.length - content.columns) : prev - 1
    );
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) =>
      prev >= visiblePosts.length - content.columns ? 0 : prev + 1
    );
  };

  return (
    <div style={containerStyle} className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          {content.heading && (
            <h3 className="text-2xl font-bold mb-1">{content.heading}</h3>
          )}
          {content.subheading && (
            <p className="text-slate-600 dark:text-slate-400">
              {content.subheading}
            </p>
          )}
        </div>

        {/* Follow Button */}
        {content.showFollowButton && content.username && (
          <a
            href={`https://instagram.com/${content.username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white font-medium text-sm hover:opacity-90 transition-opacity"
          >
            <InstagramIcon className="w-4 h-4" />
            {content.followButtonText || `Follow @${content.username}`}
          </a>
        )}
      </div>

      {/* Grid Layout */}
      {content.layout === "grid" && (
        <div
          className="grid"
          style={{
            ...getGridColumns(),
          }}
        >
          {visiblePosts.map(renderPost)}
        </div>
      )}

      {/* Masonry Layout */}
      {content.layout === "masonry" && (
        <div
          className="columns-3 md:columns-4 lg:columns-5"
          style={{
            columnCount: content.columns,
            columnGap: `${content.gap}px`,
          }}
        >
          {visiblePosts.map((post) => (
            <div key={post.id} className="mb-3 break-inside-avoid">
              {renderPost(post)}
            </div>
          ))}
        </div>
      )}

      {/* Carousel Layout */}
      {content.layout === "carousel" && (
        <div className="relative">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-300 ease-in-out"
              style={{
                transform: `translateX(-${currentSlide * (100 / content.columns)}%)`,
                gap: `${content.gap}px`,
              }}
            >
              {visiblePosts.map((post) => (
                <div
                  key={post.id}
                  className="flex-shrink-0"
                  style={{ width: `calc(${100 / content.columns}% - ${content.gap}px)` }}
                >
                  {renderPost(post)}
                </div>
              ))}
            </div>
          </div>

          {/* Carousel Navigation */}
          {visiblePosts.length > content.columns && (
            <>
              <button
                onClick={handlePrevSlide}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-10 h-10 rounded-full bg-white dark:bg-slate-800 shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
              >
                <svg
                  className="w-5 h-5 text-slate-700 dark:text-slate-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <button
                onClick={handleNextSlide}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-10 h-10 rounded-full bg-white dark:bg-slate-800 shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
              >
                <svg
                  className="w-5 h-5 text-slate-700 dark:text-slate-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </>
          )}
        </div>
      )}

      {/* Instagram Username Link */}
      {content.username && !content.showFollowButton && (
        <div className="text-center">
          <a
            href={`https://instagram.com/${content.username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
          >
            <InstagramIcon className="w-5 h-5" />
            @{content.username}
          </a>
        </div>
      )}
    </div>
  );
};

export default InstagramFeed;
