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
        className={classNames(
          "relative h-4 flex items-center justify-center z-[15]",
          className,
        )}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
          className="group absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center cursor-pointer transition-all duration-300"
        >
          {/* Button container */}
          <div className="relative transition-transform duration-300 group-hover:scale-110">
            {/* White outer fade */}
            <div className="absolute -inset-5 rounded-full bg-white opacity-60 blur-lg transition-all duration-300" />

            {/* Rainbow glow - crisp outer glow */}
            <div className="absolute -inset-3 rounded-full rainbow-gradient opacity-0 blur-sm group-hover:opacity-90 group-hover:animate-pulse transition-all duration-300" />

            {/* Secondary glow ring - tighter */}
            <div className="absolute -inset-1.5 rounded-full rainbow-gradient opacity-0 blur-[4px] group-hover:opacity-70 group-hover:animate-[pulse_1.5s_ease-in-out_infinite] transition-all duration-300" />

            {/* Button with rainbow border */}
            <div className="relative w-8 h-8 rounded-full overflow-hidden shadow-md group-hover:shadow-xl transition-shadow duration-300">
              {/* Rainbow border - subtle default, full on hover */}
              <div className="absolute inset-0 rainbow-gradient opacity-40 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Inner background */}
              <div className="absolute inset-[2px] rounded-full bg-white dark:bg-slate-800 flex items-center justify-center">
                <PlusIcon className="w-4 h-4 text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-white transition-colors duration-300" />
              </div>
            </div>
          </div>
        </button>
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
        "group flex flex-col items-center justify-center gap-4 p-12 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500 bg-slate-50/50 dark:bg-slate-800/30 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-all duration-300",
        className,
      )}
    >
      <div className="relative">
        {/* Animated rings with rainbow gradient */}
        <div className="absolute inset-0 rounded-full bg-slate-400/10 scale-100 opacity-0 group-hover:scale-[2] group-hover:opacity-100 transition-all duration-700" />
        <div className="absolute inset-0 rounded-full rainbow-gradient scale-100 opacity-0 group-hover:scale-[2.5] group-hover:opacity-30 transition-all duration-700 delay-100" />

        {/* Icon container with rainbow border on hover */}
        <div className="relative w-14 h-14 flex items-center justify-center bg-white dark:bg-slate-800 rounded-full shadow-lg group-hover:shadow-slate-500/25 transition-all duration-300 group-hover:scale-110">
          <div className="absolute inset-0 rounded-full rainbow-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute inset-[2px] rounded-full bg-white dark:bg-slate-800" />
          <PlusIcon className="relative w-7 h-7 text-slate-400 group-hover:text-slate-700 dark:group-hover:text-white transition-colors duration-300" />
        </div>
      </div>

      <div className="text-center">
        <span className="block text-sm font-medium text-slate-600 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
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
