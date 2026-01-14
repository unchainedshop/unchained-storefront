/**
 * Newsletter Block
 * Email subscription form with customizable content
 */

import React, { useState } from 'react';
import type { PageBlock, NewsletterContent } from '../../../types';

interface NewsletterProps {
  block: PageBlock;
  isPreview?: boolean;
}

const Newsletter: React.FC<NewsletterProps> = ({ block, isPreview }) => {
  const content = block.content as NewsletterContent;
  const style = block.style;
  const [email, setEmail] = useState('');
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
    textAlign: style.alignmentX || 'center',
  };

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

  return (
    <div style={containerStyle}>
      <div className="max-w-2xl mx-auto">
        {content.heading && (
          <h2
            className="text-2xl md:text-3xl font-bold mb-2"
            style={{ color: style.textColor }}
          >
            {content.heading}
          </h2>
        )}

        {content.subheading && (
          <p
            className="text-lg mb-6 opacity-80"
            style={{ color: style.textColor }}
          >
            {content.subheading}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={content.placeholder}
              required
              className="flex-1 px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold rounded-lg hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors"
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
                className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-blue-600 focus:ring-blue-500"
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
