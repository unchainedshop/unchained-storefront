/**
 * Countdown Timer Block
 * Displays a countdown to a specific date/time
 *
 * Design System: Frost (Glassmorphism Minimalist)
 */

import React, { useState, useEffect } from "react";
import Link from "next/link";
import classNames from "classnames";
import type { PageBlock, CountdownTimerContent } from "../../../types";

interface CountdownTimerProps {
  block: PageBlock;
  isPreview?: boolean;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({
  block,
  isPreview,
}) => {
  const content = block.content as unknown as CountdownTimerContent;
  const style = block.style;
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference =
        new Date(content.endDate).getTime() - new Date().getTime();

      if (difference <= 0) {
        setIsExpired(true);
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [content.endDate]);

  // Calculate background position from focal point
  const focalPoint = style.backgroundFocalPoint || { x: 50, y: 50 };
  const backgroundPosition = `${focalPoint.x}% ${focalPoint.y}%`;

  const containerStyle: React.CSSProperties = {
    padding: style.padding
      ? `${style.padding.top}px ${style.padding.right}px ${style.padding.bottom}px ${style.padding.left}px`
      : undefined,
    backgroundColor: style.backgroundColor,
    textAlign: style.alignmentX || "center",
    backgroundImage: style.backgroundImage
      ? `url(${style.backgroundImage})`
      : undefined,
    backgroundSize: style.backgroundObjectFit || "cover",
    backgroundPosition,
    backgroundRepeat: "no-repeat",
  };

  // Frost-style time unit component
  const TimeUnit = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center gap-1">
      {/* Glassmorphism card */}
      <div
        className={classNames(
          "relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24",
          "flex items-center justify-center",
          "rounded-2xl",
          // Frost glassmorphism
          "bg-white/10 dark:bg-white/5",
          "backdrop-blur-xl backdrop-saturate-150",
          "border border-white/20 dark:border-white/10",
          "shadow-[0_4px_24px_rgba(0,0,0,0.08)]",
        )}
      >
        {/* Subtle inner glow */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />

        {/* Number */}
        <span
          className="relative text-2xl sm:text-3xl md:text-4xl font-light tracking-tight tabular-nums"
          style={{ color: style.textColor || "#ffffff" }}
        >
          {String(value).padStart(2, "0")}
        </span>
      </div>

      {/* Label */}
      <span
        className="text-[10px] sm:text-xs uppercase tracking-widest font-medium opacity-60"
        style={{ color: style.textColor || "#ffffff" }}
      >
        {label}
      </span>
    </div>
  );

  // Separator dots between units
  const Separator = () => (
    <div className="flex flex-col gap-2 justify-center h-16 sm:h-20 md:h-24 opacity-40">
      <div
        className="w-1 h-1 rounded-full"
        style={{ backgroundColor: style.textColor || "#ffffff" }}
      />
      <div
        className="w-1 h-1 rounded-full"
        style={{ backgroundColor: style.textColor || "#ffffff" }}
      />
    </div>
  );

  if (isExpired) {
    return (
      <div style={containerStyle} className="py-12">
        <div className="max-w-4xl mx-auto text-center">
          {/* Frost-style expired message card */}
          <div
            className={classNames(
              "inline-block px-8 py-4 rounded-2xl",
              "bg-white/10 backdrop-blur-xl backdrop-saturate-150",
              "border border-white/20",
              "shadow-[0_4px_24px_rgba(0,0,0,0.08)]",
            )}
          >
            <p
              className="text-base sm:text-lg font-medium"
              style={{ color: style.textColor || "#ffffff" }}
            >
              {content.expiredMessage || "This offer has ended"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Check if there's an overlay to render
  const hasOverlay = style.backgroundOverlay && style.backgroundOverlay > 0;

  return (
    <div className="relative py-8 sm:py-12" style={containerStyle}>
      {/* Background overlay */}
      {hasOverlay && (
        <div
          className="absolute inset-0"
          style={{
            backgroundColor: style.backgroundOverlayColor || "#000000",
            opacity: style.backgroundOverlay! / 100,
          }}
        />
      )}

      <div className="relative max-w-4xl mx-auto px-4">
        {/* Header section */}
        {(content.heading || content.subheading) && (
          <div className="text-center mb-6 sm:mb-8">
            {content.heading && (
              <h2
                className="text-lg sm:text-xl md:text-2xl font-medium tracking-tight mb-1"
                style={{ color: style.textColor || "#ffffff" }}
              >
                {content.heading}
              </h2>
            )}

            {content.subheading && (
              <p
                className="text-xs sm:text-sm opacity-70 font-light"
                style={{ color: style.textColor || "#ffffff" }}
              >
                {content.subheading}
              </p>
            )}
          </div>
        )}

        {/* Countdown units */}
        <div className="flex items-start justify-center gap-2 sm:gap-3 md:gap-4 mb-6 sm:mb-8">
          <TimeUnit value={timeLeft.days} label="Days" />
          <Separator />
          <TimeUnit value={timeLeft.hours} label="Hours" />
          <Separator />
          <TimeUnit value={timeLeft.minutes} label="Min" />
          <Separator />
          <TimeUnit value={timeLeft.seconds} label="Sec" />
        </div>

        {/* CTA Button - Frost style */}
        {content.buttonText && content.buttonLink && (
          <div className="text-center">
            <Link
              href={isPreview ? "#" : content.buttonLink}
              className={classNames(
                "inline-flex items-center gap-2 px-6 py-2.5",
                "text-xs sm:text-sm font-medium",
                "rounded-full",
                // Frost glassmorphism button
                "bg-white/90 dark:bg-white/10",
                "backdrop-blur-xl backdrop-saturate-150",
                "border border-white/60 dark:border-white/20",
                "shadow-[0_4px_16px_rgba(0,0,0,0.1)]",
                "text-slate-800 dark:text-white",
                "hover:bg-white hover:shadow-[0_4px_20px_rgba(0,0,0,0.15)]",
                "transition-all duration-200",
              )}
            >
              {content.buttonText}
              <svg
                className="w-3.5 h-3.5 opacity-60"
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
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default CountdownTimer;
