/**
 * AddBlockButton Component
 * Elegant "+" button for adding blocks with smooth animations
 */

import React from "react";
import { PlusIcon } from "@heroicons/react/24/outline";
import classNames from "classnames";

interface AddBlockButtonProps {
  onClick: () => void;
  position?: "center" | "between";
  className?: string;
}

const AddBlockButton: React.FC<AddBlockButtonProps> = ({
  onClick,
  position = "center",
  className,
}) => {
  if (position === "between") {
    return (
      <div
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        className={classNames(
          "group relative h-8 flex items-center justify-center cursor-pointer z-10",
          className,
        )}
      >
        {/* Animated line that expands on hover */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px mx-4">
          <div className="h-full bg-gradient-to-r from-transparent via-slate-300 dark:via-slate-600 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Plus button with pulse animation on hover */}
        <div className="relative">
          {/* Pulse ring */}
          <div className="absolute inset-0 rounded-full bg-pink-400/20 scale-100 opacity-0 group-hover:scale-150 group-hover:opacity-100 transition-all duration-500" />

          {/* Button */}
          <div className="relative w-7 h-7 flex items-center justify-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-full opacity-50 group-hover:opacity-100 group-hover:border-pink-400 group-hover:shadow-lg group-hover:shadow-pink-500/20 transition-all duration-300 group-hover:scale-110">
            <PlusIcon className="w-4 h-4 text-slate-400 group-hover:text-pink-500 transition-colors duration-300" />
          </div>
        </div>
      </div>
    );
  }

  // Center position - for empty state
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={classNames(
        "group flex flex-col items-center justify-center gap-4 p-12 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-pink-300 dark:hover:border-pink-600 bg-slate-50/50 dark:bg-slate-800/30 hover:bg-pink-50/50 dark:hover:bg-pink-900/10 transition-all duration-300",
        className,
      )}
    >
      <div className="relative">
        {/* Animated rings */}
        <div className="absolute inset-0 rounded-full bg-pink-400/10 scale-100 opacity-0 group-hover:scale-[2] group-hover:opacity-100 transition-all duration-700" />
        <div className="absolute inset-0 rounded-full bg-pink-400/10 scale-100 opacity-0 group-hover:scale-[2.5] group-hover:opacity-50 transition-all duration-700 delay-100" />

        {/* Icon container */}
        <div className="relative w-14 h-14 flex items-center justify-center bg-white dark:bg-slate-800 rounded-full shadow-lg group-hover:shadow-pink-500/25 transition-all duration-300 group-hover:scale-110">
          <PlusIcon className="w-7 h-7 text-slate-400 group-hover:text-pink-500 transition-colors duration-300" />
        </div>
      </div>

      <div className="text-center">
        <span className="block text-sm font-medium text-slate-600 dark:text-slate-300 group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors">
          Add your first block
        </span>
        <span className="block text-xs text-slate-400 dark:text-slate-500 mt-1">
          Click to browse components
        </span>
      </div>
    </button>
  );
};

export default AddBlockButton;
