import { useState, useEffect } from "react";
import { BookmarkIcon } from "@heroicons/react/20/solid";
import classNames from "classnames";
import BookmarkToast from "./BookmarkToast";
import RippleEffect from "./RippleEffect";

interface AnimatedBookmarkButtonProps {
  isBookmarked: boolean;
  onToggle: () => void;
  disabled?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "h-3 w-3",
  md: "h-4 w-4",
  lg: "h-5 w-5",
};

const AnimatedBookmarkButton = ({
  isBookmarked,
  onToggle,
  disabled = false,
  className = "",
  size = "md",
}: AnimatedBookmarkButtonProps) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastBookmarked, setToastBookmarked] = useState(false);
  const [showParticles, setShowParticles] = useState(false);

  // Check for reduced motion preference
  const prefersReducedMotion =
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false;

  const handleClick = () => {
    if (disabled) return;

    setIsPressed(true);
    setIsAnimating(true);

    // Show particles effect when bookmarking
    if (!isBookmarked) {
      setShowParticles(true);
      setTimeout(() => setShowParticles(false), 800);
    }

    // Show toast notification
    setToastBookmarked(!isBookmarked);
    setShowToast(true);

    // Trigger the bookmark action
    onToggle();

    // Reset animation states after animation completes
    setTimeout(
      () => {
        setIsPressed(false);
        setIsAnimating(false);
      },
      prefersReducedMotion ? 100 : 800,
    );
  };

  const animationClasses = prefersReducedMotion
    ? ""
    : classNames("transition-all duration-300 ease-out", {
        "animate-bookmark-bounce": isAnimating && !isBookmarked,
        "animate-heart-beat": isAnimating && isBookmarked,
        "scale-125 rotate-12": isPressed && !isBookmarked,
        "scale-110 -rotate-6": isPressed && isBookmarked,
        "scale-100 rotate-0": !isPressed,
      });

  const iconClasses = classNames(sizeClasses[size], animationClasses, {
    "text-amber-500 hover:text-amber-600 drop-shadow-lg": isBookmarked,
    "text-slate-600 hover:text-slate-800 dark:text-slate-300 dark:hover:text-white":
      !isBookmarked,
    "opacity-50 cursor-not-allowed": disabled,
    "filter drop-shadow-[0_0_8px_rgba(245,158,11,0.6)]": isBookmarked && isAnimating,
  });

  const buttonClasses = classNames(
    "rounded-full bg-white/90 p-3 shadow-sm backdrop-blur-sm transition-all duration-300 hover:shadow-lg dark:bg-slate-900/90 relative overflow-hidden",
    {
      "opacity-0 group-hover:opacity-100": !isBookmarked,
      "opacity-100": isBookmarked,
      "hover:scale-110 hover:shadow-xl": !disabled && !isPressed,
      "scale-95": isPressed,
      "cursor-not-allowed": disabled,
      "bg-amber-50/95 dark:bg-amber-950/95 shadow-amber-200/50 dark:shadow-amber-800/50": isBookmarked,
      "shadow-xl ring-2 ring-amber-300/50 dark:ring-amber-600/50": isBookmarked && isAnimating,
    },
    className,
  );

  return (
    <>
      <RippleEffect
        color={
          isBookmarked ? "rgba(245, 158, 11, 0.4)" : "rgba(71, 85, 105, 0.3)"
        }
      >
        <button
          type="button"
          className={buttonClasses}
          onClick={handleClick}
          disabled={disabled}
          aria-label={
            isBookmarked ? "Remove from bookmarks" : "Add to bookmarks"
          }
        >
          <BookmarkIcon className={iconClasses} />
          {showParticles && !prefersReducedMotion && (
            <>
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className={`absolute w-1 h-1 bg-amber-400 rounded-full animate-ping`}
                  style={{
                    left: `${50 + (Math.random() - 0.5) * 60}%`,
                    top: `${50 + (Math.random() - 0.5) * 60}%`,
                    animationDelay: `${i * 100}ms`,
                    animationDuration: '800ms',
                  }}
                />
              ))}
            </>
          )}
        </button>
      </RippleEffect>
      <BookmarkToast
        isVisible={showToast}
        isBookmarked={toastBookmarked}
        onClose={() => setShowToast(false)}
      />
    </>
  );
};

export default AnimatedBookmarkButton;
