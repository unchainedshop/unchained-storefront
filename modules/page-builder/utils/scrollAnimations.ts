/**
 * Scroll Animations
 * CSS-only animations triggered by Intersection Observer
 * No external dependencies needed
 */

import type { CellScrollAnimation, ScrollRevealType } from "../types";

// Animation keyframes and classes
export const SCROLL_REVEAL_CSS = `
/* Scroll Reveal Base Styles */
[data-scroll-reveal] {
  opacity: 0;
  transition-property: opacity, transform, filter;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  will-change: opacity, transform;
}

[data-scroll-reveal].is-visible {
  opacity: 1;
  transform: none;
  filter: none;
}

/* Fade animations */
[data-scroll-reveal="fade"] {
  opacity: 0;
}

/* Slide Up */
[data-scroll-reveal="slide-up"] {
  opacity: 0;
  transform: translateY(40px);
}

/* Slide Down */
[data-scroll-reveal="slide-down"] {
  opacity: 0;
  transform: translateY(-40px);
}

/* Slide Left */
[data-scroll-reveal="slide-left"] {
  opacity: 0;
  transform: translateX(40px);
}

/* Slide Right */
[data-scroll-reveal="slide-right"] {
  opacity: 0;
  transform: translateX(-40px);
}

/* Scale In */
[data-scroll-reveal="scale"] {
  opacity: 0;
  transform: scale(0.9);
}

/* Scale Up (from smaller) */
[data-scroll-reveal="scale-up"] {
  opacity: 0;
  transform: scale(0.8);
}

/* Blur In */
[data-scroll-reveal="blur"] {
  opacity: 0;
  filter: blur(10px);
}

/* Flip */
[data-scroll-reveal="flip"] {
  opacity: 0;
  transform: perspective(600px) rotateX(-10deg);
}

/* Zoom */
[data-scroll-reveal="zoom"] {
  opacity: 0;
  transform: scale(1.1);
}

/* Rotate In */
[data-scroll-reveal="rotate"] {
  opacity: 0;
  transform: rotate(-5deg) scale(0.95);
}

/* Stagger animation delays for children */
[data-stagger] > *:nth-child(1) { transition-delay: calc(var(--stagger-delay, 100ms) * 0); }
[data-stagger] > *:nth-child(2) { transition-delay: calc(var(--stagger-delay, 100ms) * 1); }
[data-stagger] > *:nth-child(3) { transition-delay: calc(var(--stagger-delay, 100ms) * 2); }
[data-stagger] > *:nth-child(4) { transition-delay: calc(var(--stagger-delay, 100ms) * 3); }
[data-stagger] > *:nth-child(5) { transition-delay: calc(var(--stagger-delay, 100ms) * 4); }
[data-stagger] > *:nth-child(6) { transition-delay: calc(var(--stagger-delay, 100ms) * 5); }
[data-stagger] > *:nth-child(7) { transition-delay: calc(var(--stagger-delay, 100ms) * 6); }
[data-stagger] > *:nth-child(8) { transition-delay: calc(var(--stagger-delay, 100ms) * 7); }
[data-stagger] > *:nth-child(9) { transition-delay: calc(var(--stagger-delay, 100ms) * 8); }
[data-stagger] > *:nth-child(10) { transition-delay: calc(var(--stagger-delay, 100ms) * 9); }
[data-stagger] > *:nth-child(11) { transition-delay: calc(var(--stagger-delay, 100ms) * 10); }
[data-stagger] > *:nth-child(12) { transition-delay: calc(var(--stagger-delay, 100ms) * 11); }
`;

// Easing functions
const EASINGS: Record<string, string> = {
  ease: "cubic-bezier(0.4, 0, 0.2, 1)",
  "ease-in": "cubic-bezier(0.4, 0, 1, 1)",
  "ease-out": "cubic-bezier(0, 0, 0.2, 1)",
  "ease-in-out": "cubic-bezier(0.4, 0, 0.2, 1)",
  spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
};

// Build inline styles for scroll animation
export function buildScrollAnimationStyle(
  animation: CellScrollAnimation,
): React.CSSProperties {
  const { duration = 600, delay = 0, easing = "ease" } = animation;

  return {
    transitionDuration: `${duration}ms`,
    transitionDelay: `${delay}ms`,
    transitionTimingFunction: EASINGS[easing] || EASINGS.ease,
  };
}

// Get data attributes for scroll reveal element
export function getScrollRevealAttributes(
  animation: CellScrollAnimation,
): Record<string, string | number | boolean> {
  return {
    "data-scroll-reveal": animation.type,
    "data-once": animation.once !== false ? "true" : "false",
    "data-threshold": animation.threshold || 0.1,
  };
}

// Intersection Observer setup for scroll reveals
// This should be called once when the page loads
export function initScrollRevealObserver(): IntersectionObserver | null {
  if (typeof window === "undefined") return null;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const element = entry.target as HTMLElement;
        const once = element.dataset.once !== "false";

        if (entry.isIntersecting) {
          element.classList.add("is-visible");
        } else if (!once) {
          element.classList.remove("is-visible");
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    },
  );

  // Observe all scroll reveal elements
  document.querySelectorAll("[data-scroll-reveal]").forEach((el) => {
    observer.observe(el);
  });

  return observer;
}

// React hook for scroll reveal
export function useScrollReveal(
  ref: React.RefObject<HTMLElement>,
  animation?: CellScrollAnimation,
) {
  if (typeof window === "undefined" || !animation) return;

  const threshold = animation.threshold || 0.1;
  const once = animation.once !== false;

  // Create observer
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          if (once) {
            observer.unobserve(entry.target);
          }
        } else if (!once) {
          entry.target.classList.remove("is-visible");
        }
      });
    },
    {
      threshold,
      rootMargin: "0px 0px -50px 0px",
    },
  );

  // Observe element
  if (ref.current) {
    observer.observe(ref.current);
  }

  // Cleanup
  return () => {
    observer.disconnect();
  };
}

// Animation type labels for UI
export const SCROLL_ANIMATION_OPTIONS: Array<{
  value: ScrollRevealType;
  label: string;
  description: string;
}> = [
  { value: "none", label: "None", description: "No animation" },
  { value: "fade", label: "Fade", description: "Simple fade in" },
  { value: "slide-up", label: "Slide Up", description: "Slide up with fade" },
  {
    value: "slide-down",
    label: "Slide Down",
    description: "Slide down with fade",
  },
  {
    value: "slide-left",
    label: "Slide Left",
    description: "Slide from right",
  },
  {
    value: "slide-right",
    label: "Slide Right",
    description: "Slide from left",
  },
  { value: "scale", label: "Scale", description: "Scale up from 90%" },
  { value: "scale-up", label: "Pop", description: "Pop up from smaller" },
  { value: "blur", label: "Blur", description: "Blur to sharp" },
  { value: "flip", label: "Flip", description: "3D flip effect" },
  { value: "zoom", label: "Zoom", description: "Zoom in from larger" },
  { value: "rotate", label: "Rotate", description: "Rotate with scale" },
];

// Duration presets
export const DURATION_PRESETS = [
  { value: 300, label: "Fast" },
  { value: 600, label: "Normal" },
  { value: 1000, label: "Slow" },
  { value: 1500, label: "Very Slow" },
];

// Delay presets
export const DELAY_PRESETS = [
  { value: 0, label: "None" },
  { value: 100, label: "100ms" },
  { value: 200, label: "200ms" },
  { value: 400, label: "400ms" },
];
