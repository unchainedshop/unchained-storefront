/**
 * Video Block
 * Embed YouTube, Vimeo, or custom video
 */

import React, { useState } from "react";
import classNames from "classnames";
import { PlayIcon, PlusIcon } from "@heroicons/react/24/solid";
import type { PageBlock, VideoContent } from "../../../types";

interface VideoProps {
  block: PageBlock;
  isPreview?: boolean;
  isEditing?: boolean;
}

const Video: React.FC<VideoProps> = ({ block, isPreview, isEditing = true }) => {
  const content = block.content as VideoContent;
  const style = block.style;
  const [isPlaying, setIsPlaying] = useState(content.autoplay);

  const containerStyle: React.CSSProperties = {
    backgroundColor: style.backgroundColor,
    borderRadius: style.borderRadius,
    padding: style.padding
      ? `${style.padding.top}px ${style.padding.right}px ${style.padding.bottom}px ${style.padding.left}px`
      : undefined,
  };

  const aspectRatioClasses = {
    "16:9": "aspect-video",
    "4:3": "aspect-[4/3]",
    "1:1": "aspect-square",
    "9:16": "aspect-[9/16]",
  };

  // Extract video ID from URL
  const getVideoEmbed = () => {
    const url = content.url;
    if (!url) return null;

    if (content.provider === "youtube" || url.includes("youtube.com") || url.includes("youtu.be")) {
      let videoId = "";
      if (url.includes("youtu.be/")) {
        videoId = url.split("youtu.be/")[1]?.split(/[?&]/)[0] || "";
      } else if (url.includes("watch?v=")) {
        videoId = url.split("watch?v=")[1]?.split(/[?&]/)[0] || "";
      } else if (url.includes("embed/")) {
        videoId = url.split("embed/")[1]?.split(/[?&]/)[0] || "";
      }
      if (videoId) {
        const params = new URLSearchParams({
          autoplay: isPlaying ? "1" : "0",
          mute: content.muted ? "1" : "0",
          loop: content.loop ? "1" : "0",
          controls: content.controls ? "1" : "0",
          rel: "0",
        });
        return `https://www.youtube.com/embed/${videoId}?${params}`;
      }
    }

    if (content.provider === "vimeo" || url.includes("vimeo.com")) {
      const videoId = url.split("vimeo.com/")[1]?.split(/[?&/]/)[0] || "";
      if (videoId) {
        const params = new URLSearchParams({
          autoplay: isPlaying ? "1" : "0",
          muted: content.muted ? "1" : "0",
          loop: content.loop ? "1" : "0",
          controls: content.controls ? "1" : "0",
        });
        return `https://player.vimeo.com/video/${videoId}?${params}`;
      }
    }

    return url;
  };

  if (!content.url && isEditing) {
    return (
      <div
        className="flex flex-col items-center justify-center py-16 px-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600"
        style={containerStyle}
      >
        <PlayIcon className="w-10 h-10 text-slate-400 mb-3" />
        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
          Add a video URL in the settings panel
        </p>
      </div>
    );
  }

  const embedUrl = getVideoEmbed();

  return (
    <div style={containerStyle}>
      <div
        className={classNames(
          "max-w-4xl mx-auto",
          style.maxWidth && `max-w-[${style.maxWidth}px]`,
        )}
      >
        <div
          className={classNames(
            "relative overflow-hidden rounded-xl bg-slate-900",
            aspectRatioClasses[content.aspectRatio || "16:9"],
          )}
        >
          {/* Thumbnail with play button (if not auto-playing) */}
          {!isPlaying && content.thumbnail && (
            <button
              onClick={() => setIsPlaying(true)}
              className="absolute inset-0 z-10 group"
            >
              <img
                src={content.thumbnail}
                alt=""
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-white/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <PlayIcon className="w-8 h-8 text-slate-900 ml-1" />
                </div>
              </div>
            </button>
          )}

          {/* Video iframe */}
          {(isPlaying || !content.thumbnail) && embedUrl && (
            <iframe
              src={embedUrl}
              className="absolute inset-0 w-full h-full"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          )}

          {/* Native video (for custom provider) */}
          {content.provider === "custom" && content.url && (
            <video
              src={content.url}
              className="absolute inset-0 w-full h-full object-cover"
              autoPlay={content.autoplay}
              muted={content.muted}
              loop={content.loop}
              controls={content.controls}
              playsInline
            />
          )}
        </div>

        {/* Caption */}
        {content.caption && (
          <p
            className="text-sm text-center mt-3 opacity-70"
            style={{ color: style.textColor }}
          >
            {content.caption}
          </p>
        )}
      </div>
    </div>
  );
};

export default Video;
