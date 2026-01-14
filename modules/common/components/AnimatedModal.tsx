/**
 * Animated Modal Component
 * Provides smooth entry and exit animations for modals
 */

import React, { useEffect, useState, useCallback, useLayoutEffect } from "react";
import { createPortal } from "react-dom";

interface AnimatedModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  /** Duration of animations in ms (default: 200) */
  duration?: number;
  /** Whether clicking backdrop closes the modal (default: true) */
  closeOnBackdrop?: boolean;
  /** Whether pressing Escape closes the modal (default: true) */
  closeOnEscape?: boolean;
  /** Custom backdrop className */
  backdropClassName?: string;
  /** z-index for the modal (default: 50) */
  zIndex?: number;
}

const AnimatedModal: React.FC<AnimatedModalProps> = ({
  isOpen,
  onClose,
  children,
  duration = 200,
  closeOnBackdrop = true,
  closeOnEscape = true,
  backdropClassName,
  zIndex = 50,
}) => {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  // Handle mounting/unmounting
  useEffect(() => {
    if (isOpen) {
      setMounted(true);
    } else if (mounted) {
      // Start exit animation
      setVisible(false);
      const timer = setTimeout(() => {
        setMounted(false);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isOpen, duration, mounted]);

  // Handle enter animation after mount
  useLayoutEffect(() => {
    if (mounted && isOpen) {
      // Force a reflow to ensure the initial state is painted
      document.body.offsetHeight;
      // Use double rAF for reliable animation start
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setVisible(true);
        });
      });
    }
  }, [mounted, isOpen]);

  // Handle Escape key
  useEffect(() => {
    if (!closeOnEscape || !visible) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [closeOnEscape, visible, onClose]);

  // Lock body scroll when modal is mounted
  useEffect(() => {
    if (mounted) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [mounted]);

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (closeOnBackdrop && e.target === e.currentTarget) {
        onClose();
      }
    },
    [closeOnBackdrop, onClose]
  );

  if (!mounted) return null;

  const modal = (
    <div
      className="fixed inset-0 flex items-center justify-center"
      style={{ zIndex }}
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className={`absolute inset-0 backdrop-blur-sm transition-opacity ${backdropClassName || "bg-black/50"}`}
        style={{
          opacity: visible ? 1 : 0,
          transitionDuration: `${duration}ms`,
        }}
        onClick={handleBackdropClick}
        aria-hidden="true"
      />

      {/* Content wrapper */}
      <div
        className="relative transition-all"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "scale(1)" : "scale(0.95)",
          transitionDuration: `${duration}ms`,
          transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        {children}
      </div>
    </div>
  );

  // Render in portal to avoid z-index issues
  if (typeof document !== "undefined") {
    return createPortal(modal, document.body);
  }

  return modal;
};

export default AnimatedModal;
