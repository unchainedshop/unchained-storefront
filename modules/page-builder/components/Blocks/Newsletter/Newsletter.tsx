/**
 * Newsletter Block
 * Email subscription form with customizable content and layout variants
 */

import React, { useState } from "react";
import type { PageBlock, NewsletterContent } from "../../../types";

interface NewsletterProps {
  block: PageBlock;
  isPreview?: boolean;
}

const Newsletter: React.FC<NewsletterProps> = ({ block, isPreview }) => {
  const content = block.content as unknown as NewsletterContent;
  const style = block.style;
  const variant = content.variant || "centered";
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [consent, setConsent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isPreview) {
      setIsSubmitted(true);
      setTimeout(() => setIsSubmitted(false), 3000);
      return;
    }
    // In production, this would call an API
    setIsSubmitted(true);
  };

  const containerStyle: React.CSSProperties = {
    padding: style.padding
      ? `${style.padding.top}px ${style.padding.right}px ${style.padding.bottom}px ${style.padding.left}px`
      : undefined,
    backgroundColor: style.backgroundColor,
  };

  // Success state - always centered
  if (isSubmitted) {
    return (
      <div style={containerStyle}>
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-green-600 dark:text-green-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <p
            className="text-xl font-semibold"
            style={{ color: style.textColor }}
          >
            {content.successMessage}
          </p>
        </div>
      </div>
    );
  }

  // Shared form component - Frost style
  const renderForm = (formClass?: string, inputClass?: string) => (
    <form onSubmit={handleSubmit} className={formClass || "space-y-4"}>
      <div className={inputClass || "flex flex-col sm:flex-row gap-3"}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={content.placeholder}
          required
          className="flex-1 px-4 py-3 rounded-xl bg-white/80 dark:bg-slate-800/60 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/40 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-300/50 dark:focus:ring-slate-600/50 focus:border-slate-300 dark:focus:border-slate-600 transition-all duration-200 ease-out"
        />
        <button
          type="submit"
          className="px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold rounded-xl hover:bg-slate-800 dark:hover:bg-slate-100 transition-all duration-200 ease-out whitespace-nowrap"
        >
          {content.buttonText}
        </button>
      </div>

      {content.showConsent && content.consentText && (
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            required
            className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-slate-600 focus:ring-slate-500"
          />
          <span style={{ color: style.textColor }} className="opacity-80">
            {content.consentText}
          </span>
        </label>
      )}
    </form>
  );

  // Shared text content component
  const renderText = (textAlign?: "left" | "center" | "right") => (
    <div style={{ textAlign: textAlign || "inherit" }}>
      {content.heading && (
        <h2
          className="text-2xl md:text-3xl font-bold mb-2"
          style={{ color: style.textColor }}
        >
          {content.heading}
        </h2>
      )}
      {content.subheading && (
        <p className="text-lg opacity-80" style={{ color: style.textColor }}>
          {content.subheading}
        </p>
      )}
    </div>
  );

  // Inline variant: text on left, form on right
  if (variant === "inline") {
    return (
      <div style={containerStyle}>
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 lg:gap-12">
            <div className="flex-1">{renderText("left")}</div>
            <div className="flex-1 lg:max-w-md">{renderForm("space-y-3")}</div>
          </div>
        </div>
      </div>
    );
  }

  // Stacked variant: full width with larger form
  if (variant === "stacked") {
    return (
      <div style={containerStyle}>
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">{renderText("center")}</div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col gap-3 max-w-xl mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={content.placeholder}
                required
                className="w-full px-5 py-4 text-lg rounded-xl bg-white/80 dark:bg-slate-800/60 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/40 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-300/50 dark:focus:ring-slate-600/50 transition-all duration-200 ease-out"
              />
              <button
                type="submit"
                className="w-full px-6 py-4 text-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold rounded-xl hover:bg-slate-800 dark:hover:bg-slate-100 transition-all duration-200 ease-out"
              >
                {content.buttonText}
              </button>
            </div>
            {content.showConsent && content.consentText && (
              <label className="flex items-center justify-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  required
                  className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-slate-600 focus:ring-slate-500"
                />
                <span style={{ color: style.textColor }} className="opacity-80">
                  {content.consentText}
                </span>
              </label>
            )}
          </form>
        </div>
      </div>
    );
  }

  // Left, Right, and Centered variants
  const alignmentClass =
    {
      left: "text-left items-start",
      right: "text-right items-end ml-auto",
      centered: "text-center items-center mx-auto",
    }[variant] || "text-center items-center mx-auto";

  const formContainerClass =
    {
      left: "",
      right: "ml-auto",
      centered: "mx-auto",
    }[variant] || "mx-auto";

  const consentJustify =
    {
      left: "justify-start",
      right: "justify-end",
      centered: "justify-center",
    }[variant] || "justify-center";

  return (
    <div style={containerStyle}>
      <div className={`max-w-2xl ${alignmentClass}`}>
        <div className="mb-6">
          {renderText(variant as "left" | "center" | "right")}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div
            className={`flex flex-col sm:flex-row gap-3 max-w-md ${formContainerClass}`}
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={content.placeholder}
              required
              className="flex-1 px-4 py-3 rounded-xl bg-white/80 dark:bg-slate-800/60 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/40 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-300/50 dark:focus:ring-slate-600/50 transition-all duration-200 ease-out"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold rounded-xl hover:bg-slate-800 dark:hover:bg-slate-100 transition-all duration-200 ease-out whitespace-nowrap"
            >
              {content.buttonText}
            </button>
          </div>

          {content.showConsent && content.consentText && (
            <label
              className={`flex items-center gap-2 text-sm ${consentJustify}`}
            >
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                required
                className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-slate-600 focus:ring-slate-500"
              />
              <span style={{ color: style.textColor }} className="opacity-80">
                {content.consentText}
              </span>
            </label>
          )}
        </form>
      </div>
    </div>
  );
};

export default Newsletter;
