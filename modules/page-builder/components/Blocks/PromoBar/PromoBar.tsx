/**
 * Promo Bar Block
 * Full-width promotional banner
 */

import React, { useState } from 'react';
import Link from 'next/link';
import { XMarkIcon } from '@heroicons/react/24/outline';
import type { PageBlock, PromoBarContent } from '../../../types';

interface PromoBarProps {
  block: PageBlock;
  isPreview?: boolean;
}

const PromoBar: React.FC<PromoBarProps> = ({ block, isPreview }) => {
  const content = block.content as PromoBarContent;
  const style = block.style;
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) {
    return null;
  }

  const containerStyle: React.CSSProperties = {
    padding: style.padding
      ? `${style.padding.top}px ${style.padding.right}px ${style.padding.bottom}px ${style.padding.left}px`
      : undefined,
    backgroundColor: style.backgroundColor || '#1e293b',
    textAlign: style.alignmentX || 'center',
  };

  const ContentWrapper = content.link
    ? ({ children }: { children: React.ReactNode }) => (
        <Link
          href={isPreview ? '#' : content.link!}
          className="hover:opacity-80 transition-opacity"
        >
          {children}
        </Link>
      )
    : ({ children }: { children: React.ReactNode }) => <>{children}</>;

  return (
    <div style={containerStyle} className="relative">
      <div className="max-w-7xl mx-auto flex items-center justify-center">
        <ContentWrapper>
          <p
            className="text-sm font-medium"
            style={{ color: style.textColor || '#ffffff' }}
          >
            {content.icon && <span className="mr-2">{content.icon}</span>}
            {content.text}
            {content.link && (
              <span className="ml-2 underline">Learn more →</span>
            )}
          </p>
        </ContentWrapper>

        {content.dismissible && (
          <button
            onClick={() => setIsDismissed(true)}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:opacity-70 transition-opacity"
            style={{ color: style.textColor || '#ffffff' }}
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default PromoBar;
