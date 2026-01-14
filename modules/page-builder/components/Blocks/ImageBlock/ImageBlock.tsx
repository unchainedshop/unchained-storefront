/**
 * Image Block
 * Displays an image with optional link and caption
 */

import React from 'react';
import Link from 'next/link';
import { PhotoIcon } from '@heroicons/react/24/outline';
import type { PageBlock, ImageBlockContent } from '../../../types';

interface ImageBlockProps {
  block: PageBlock;
  isPreview?: boolean;
}

const ImageBlock: React.FC<ImageBlockProps> = ({ block, isPreview }) => {
  const content = block.content as ImageBlockContent;
  const style = block.style;

  const aspectRatioClasses = {
    auto: '',
    '1:1': 'aspect-square',
    '4:3': 'aspect-[4/3]',
    '16:9': 'aspect-video',
    '21:9': 'aspect-[21/9]',
  };

  const containerStyle: React.CSSProperties = {
    maxWidth: style.maxWidth || undefined,
    margin: style.alignmentX === 'center' ? '0 auto' : undefined,
    borderRadius: style.borderRadius || 0,
  };

  const ImageContent = (
    <div
      className={`overflow-hidden bg-slate-100 dark:bg-slate-800 ${
        aspectRatioClasses[content.aspectRatio || 'auto']
      }`}
      style={{ borderRadius: style.borderRadius || 0 }}
    >
      {content.src ? (
        <img
          src={content.src}
          alt={content.alt || ''}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full min-h-[200px] flex items-center justify-center">
          <div className="text-center">
            <PhotoIcon className="w-16 h-16 text-slate-300 dark:text-slate-500 mx-auto" />
            <p className="mt-2 text-sm text-slate-400 dark:text-slate-500">
              No image selected
            </p>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <figure style={containerStyle}>
      {content.link && !isPreview ? (
        <Link href={content.link} className="block">
          {ImageContent}
        </Link>
      ) : (
        ImageContent
      )}

      {content.caption && (
        <figcaption className="mt-2 text-sm text-center text-slate-500 dark:text-slate-400">
          {content.caption}
        </figcaption>
      )}
    </figure>
  );
};

export default ImageBlock;
