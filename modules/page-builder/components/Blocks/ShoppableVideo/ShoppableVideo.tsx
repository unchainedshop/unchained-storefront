/**
 * Shoppable Video Block
 * Video with clickable product hotspots that appear at specific timestamps
 */

import React, { useState, useRef, useEffect } from "react";
import {
  PlayIcon,
  PauseIcon,
  VideoCameraIcon,
} from "@heroicons/react/24/solid";
import type {
  PageBlock,
  ShoppableVideoContent,
  VideoHotspot,
} from "../../../types";
import VideoHotspotMarker from "./VideoHotspotMarker";
import ProductCard from "./ProductCard";

interface ShoppableVideoProps {
  block: PageBlock;
  isPreview?: boolean;
}

const ShoppableVideo: React.FC<ShoppableVideoProps> = ({
  block,
  isPreview,
}) => {
  const content = block.content as unknown as ShoppableVideoContent;
  const style = block.style;

  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(content.autoplay);
  const [currentTime, setCurrentTime] = useState(0);
  const [activeHotspot, setActiveHotspot] = useState<VideoHotspot | null>(null);

  const containerStyle: React.CSSProperties = {
    maxWidth: style.maxWidth || undefined,
    margin: style.alignmentX === "center" ? "0 auto" : undefined,
    borderRadius: style.borderRadius || 0,
  };

  const aspectRatioClasses = {
    "16:9": "aspect-video",
    "4:3": "aspect-[4/3]",
    "1:1": "aspect-square",
    "9:16": "aspect-[9/16]",
  };

  // Track video time for hotspot visibility
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    return () => video.removeEventListener("timeupdate", handleTimeUpdate);
  }, []);

  // Determine which hotspots should be visible based on current time
  const visibleHotspots = content.hotspots.filter((hotspot) => {
    if (content.showHotspots === "never") return false;
    if (content.showHotspots === "paused" && isPlaying) return false;
    return currentTime >= hotspot.startTime && currentTime <= hotspot.endTime;
  });

  const handlePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
    setIsPlaying(!isPlaying);
  };

  // Extract video ID for embeds
  const getVideoEmbed = () => {
    const url = content.videoUrl;
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
          autoplay: content.autoplay ? "1" : "0",
          mute: content.muted ? "1" : "0",
          loop: content.loop ? "1" : "0",
          controls: content.controls ? "1" : "0",
          rel: "0",
          enablejsapi: "1",
        });
        return `https://www.youtube.com/embed/${videoId}?${params}`;
      }
    }

    if (content.provider === "vimeo" || url.includes("vimeo.com")) {
      const videoId = url.split("vimeo.com/")[1]?.split(/[?&/]/)[0] || "";
      if (videoId) {
        const params = new URLSearchParams({
          autoplay: content.autoplay ? "1" : "0",
          muted: content.muted ? "1" : "0",
          loop: content.loop ? "1" : "0",
          controls: content.controls ? "1" : "0",
        });
        return `https://player.vimeo.com/video/${videoId}?${params}`;
      }
    }

    return null;
  };

  // Empty state
  if (!content.videoUrl) {
    return (
      <div
        style={containerStyle}
        className="relative aspect-video rounded-lg overflow-hidden border-2 border-dashed border-periwinkle-300 dark:border-periwinkle-400/50 bg-periwinkle-50/30 dark:bg-periwinkle-500/5"
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-periwinkle-400 dark:text-periwinkle-300">
            <VideoCameraIcon className="w-12 h-12 mx-auto" />
            <p className="mt-3 text-sm font-medium">
              Add a video URL to create shoppable hotspots
            </p>
          </div>
        </div>
      </div>
    );
  }

  const embedUrl = getVideoEmbed();
  const isNativeVideo =
    content.provider === "custom" || content.provider === "hosted";

  return (
    <div style={containerStyle} className="relative overflow-hidden group">
      <div
        className={`relative rounded-lg overflow-hidden bg-slate-900 ${
          aspectRatioClasses[content.aspectRatio || "16:9"]
        }`}
        style={{ borderRadius: style.borderRadius || 0 }}
      >
        {/* Native Video (for custom/hosted) */}
        {isNativeVideo && (
          <>
            {/* Thumbnail with play button */}
            {!isPlaying && content.thumbnail && (
              <button
                onClick={handlePlayPause}
                className="absolute inset-0 z-10 group/play"
              >
                <img
                  src={content.thumbnail}
                  alt=""
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/30 group-hover/play:bg-black/40 transition-colors flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full bg-white/90 flex items-center justify-center shadow-lg group-hover/play:scale-110 transition-transform">
                    <PlayIcon className="w-8 h-8 text-slate-900 ml-1" />
                  </div>
                </div>
              </button>
            )}

            <video
              ref={videoRef}
              src={content.videoUrl}
              className="absolute inset-0 w-full h-full object-cover"
              autoPlay={content.autoplay}
              muted={content.muted}
              loop={content.loop}
              controls={false}
              playsInline
              poster={!isPlaying ? content.thumbnail : undefined}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />

            {/* Custom play/pause control for native video */}
            {(isPlaying || !content.thumbnail) && (
              <button
                onClick={handlePlayPause}
                className="absolute bottom-4 left-4 z-20 w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center transition-colors"
              >
                {isPlaying ? (
                  <PauseIcon className="w-5 h-5 text-white" />
                ) : (
                  <PlayIcon className="w-5 h-5 text-white ml-0.5" />
                )}
              </button>
            )}
          </>
        )}

        {/* Embedded Video (YouTube/Vimeo) */}
        {!isNativeVideo && embedUrl && (
          <iframe
            src={embedUrl}
            className="absolute inset-0 w-full h-full"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        )}

        {/* Hotspots overlay */}
        <div className="absolute inset-0 pointer-events-none">
          {visibleHotspots.map((hotspot) => (
            <VideoHotspotMarker
              key={hotspot.id}
              hotspot={hotspot}
              style={content.hotspotStyle}
              color={content.hotspotColor}
              isSelected={activeHotspot?.id === hotspot.id}
              isEditing={!isPreview}
              onMouseEnter={() => setActiveHotspot(hotspot)}
              onMouseLeave={() => setActiveHotspot(null)}
              onClick={() => {
                if (isPreview) {
                  setActiveHotspot(
                    activeHotspot?.id === hotspot.id ? null : hotspot,
                  );
                }
              }}
            />
          ))}
        </div>

        {/* Product Card (shown on hover in preview mode) */}
        {activeHotspot && isPreview && (
          <ProductCard
            hotspot={activeHotspot}
            position={activeHotspot.position}
            onClose={() => setActiveHotspot(null)}
          />
        )}
      </div>

      {/* Empty hotspots state for editor */}
      {!isPreview && content.hotspots.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 pointer-events-none rounded-lg">
          <div className="px-4 py-2 bg-white/90 dark:bg-slate-800/90 rounded-lg text-sm text-slate-600 dark:text-slate-300">
            Add product hotspots in the settings panel
          </div>
        </div>
      )}
    </div>
  );
};

export default ShoppableVideo;
