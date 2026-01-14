/**
 * Countdown Timer Block
 * Displays a countdown to a specific date/time
 */

import React, { useState, useEffect } from "react";
import Link from "next/link";
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

  const TimeBox = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center">
      <div
        className="w-20 h-20 md:w-24 md:h-24 flex items-center justify-center bg-white/10 rounded-lg"
        style={{ color: style.textColor || "#ffffff" }}
      >
        <span className="text-3xl md:text-4xl font-bold">
          {String(value).padStart(2, "0")}
        </span>
      </div>
      <span
        className="mt-2 text-sm uppercase tracking-wide opacity-80"
        style={{ color: style.textColor || "#ffffff" }}
      >
        {label}
      </span>
    </div>
  );

  if (isExpired) {
    return (
      <div style={containerStyle}>
        <div className="max-w-4xl mx-auto text-center">
          <p
            className="text-2xl font-semibold"
            style={{ color: style.textColor || "#ffffff" }}
          >
            {content.expiredMessage || "This offer has ended"}
          </p>
        </div>
      </div>
    );
  }

  // Check if there's an overlay to render
  const hasOverlay = style.backgroundOverlay && style.backgroundOverlay > 0;

  return (
    <div className="relative" style={containerStyle}>
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
      <div className="relative max-w-4xl mx-auto">
        {content.heading && (
          <h2
            className="text-2xl md:text-3xl font-bold mb-2"
            style={{ color: style.textColor || "#ffffff" }}
          >
            {content.heading}
          </h2>
        )}

        {content.subheading && (
          <p
            className="text-lg mb-8 opacity-90"
            style={{ color: style.textColor || "#ffffff" }}
          >
            {content.subheading}
          </p>
        )}

        <div className="flex justify-center gap-4 md:gap-6 mb-8">
          <TimeBox value={timeLeft.days} label="Days" />
          <TimeBox value={timeLeft.hours} label="Hours" />
          <TimeBox value={timeLeft.minutes} label="Min" />
          <TimeBox value={timeLeft.seconds} label="Sec" />
        </div>

        {content.buttonText && content.buttonLink && (
          <Link
            href={isPreview ? "#" : content.buttonLink}
            className="inline-flex items-center px-8 py-3 bg-white text-slate-900 font-semibold rounded-lg hover:bg-slate-100 transition-colors"
          >
            {content.buttonText}
          </Link>
        )}
      </div>
    </div>
  );
};

export default CountdownTimer;
