/**
 * Video Block
 * Embed YouTube, Vimeo, or custom video
 */

import React, { useState } from "react";
import { PlayIcon } from "@heroicons/react/24/solid";
import type { PageBlock, VideoContent } from "../../../types";

interface VideoProps {
  block: PageBlock;
  isPreview?: boolean;
  isEditing?: boolean;
}

const Video: React.FC<VideoProps> = ({
  block,
  isPreview,
  isEditing = true,
}) => {
  const content = block.content as unknown as VideoContent;
  const style = block.style;
  // Autoplay by default if no thumbnail is set, or if explicitly enabled
  const [isPlaying, setIsPlaying] = useState(
    content.autoplay || !content.thumbnail,
  );

  const containerStyle: React.CSSProperties = {
    backgroundColor: style.backgroundColor,
    borderRadius: style.borderRadius,
    padding: style.padding
      ? `${style.padding.top}px ${style.padding.right}px ${style.padding.bottom}px ${style.padding.left}px`
      : undefined,
  };

  // Extract video ID from URL
  const getVideoEmbed = () => {
    const url = content.url;
    if (!url) return null;

    if (
      content.provider === "youtube" ||
      url.includes("youtube.com") ||
      url.includes("youtu.be")
    ) {
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
        className="flex flex-col items-center justify-center w-full h-full min-h-[200px] border-2 border-dashed border-periwinkle-300 dark:border-periwinkle-400/50 bg-periwinkle-50/30 dark:bg-periwinkle-500/5"
        style={containerStyle}
      >
        <PlayIcon className="w-10 h-10 text-periwinkle-400 dark:text-periwinkle-300 mb-3" />
        <p className="text-periwinkle-400 dark:text-periwinkle-300 text-sm font-medium">
          Add a video URL in the settings panel
        </p>
      </div>
    );
  }

  const embedUrl = getVideoEmbed();

  return (
    <div
      style={{ ...containerStyle, flex: 1, minHeight: 0 }}
      className="w-full h-full flex flex-col"
    >
      <div className="relative flex-1 overflow-hidden rounded-2xl bg-slate-900/90 backdrop-blur-sm border border-slate-200/20 dark:border-white/10 shadow-[0_4px_24px_rgba(0,0,0,0.12)]">
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
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] group-hover:bg-slate-900/50 transition-all duration-300 flex items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-white/90 dark:bg-white/80 backdrop-blur-xl flex items-center justify-center shadow-[0_8px_32px_rgba(0,0,0,0.2)] group-hover:scale-110 group-hover:shadow-[0_12px_40px_rgba(0,0,0,0.25)] transition-all duration-300 ease-out">
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
          className="mt-3 text-sm text-center text-slate-500 dark:text-slate-400 flex-shrink-0"
          style={{ color: style.textColor }}
        >
          {content.caption}
        </p>
      )}
    </div>
  );
};

export default Video;
