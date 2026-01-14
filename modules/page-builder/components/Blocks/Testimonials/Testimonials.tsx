/**
 * Testimonials Block
 * Customer testimonials in carousel or grid layout
 */

import React, { useState } from 'react';
import classNames from 'classnames';
import { ChevronLeftIcon, ChevronRightIcon, StarIcon } from '@heroicons/react/24/solid';
import { UserCircleIcon } from '@heroicons/react/24/outline';
import type { PageBlock, TestimonialsContent } from '../../../types';

interface TestimonialsProps {
  block: PageBlock;
  isPreview?: boolean;
}

const Testimonials: React.FC<TestimonialsProps> = ({ block }) => {
  const content = block.content as unknown as TestimonialsContent;
  const style = block.style;
  const [currentIndex, setCurrentIndex] = useState(0);

  const containerStyle: React.CSSProperties = {
    padding: style.padding
      ? `${style.padding.top}px ${style.padding.right}px ${style.padding.bottom}px ${style.padding.left}px`
      : undefined,
    backgroundColor: style.backgroundColor,
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? content.testimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === content.testimonials.length - 1 ? 0 : prev + 1));
  };

  const TestimonialCard = ({
    testimonial,
    isCarousel = false,
  }: {
    testimonial: (typeof content.testimonials)[0];
    isCarousel?: boolean;
  }) => (
    <div
      className={classNames(
        'bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm',
        isCarousel ? 'mx-auto max-w-2xl' : ''
      )}
    >
      {/* Rating */}
      {content.showRating && testimonial.rating && (
        <div className="flex gap-1 mb-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <StarIcon
              key={i}
              className={classNames(
                'w-5 h-5',
                i < testimonial.rating! ? 'text-amber-400' : 'text-slate-200 dark:text-slate-600'
              )}
            />
          ))}
        </div>
      )}

      {/* Quote */}
      <blockquote className="text-lg text-slate-700 dark:text-slate-300 mb-4">
        "{testimonial.quote}"
      </blockquote>

      {/* Author */}
      <div className="flex items-center gap-3">
        {content.showAvatar && (
          <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-700">
            {testimonial.avatar ? (
              <img
                src={testimonial.avatar}
                alt={testimonial.author}
                className="w-full h-full object-cover"
              />
            ) : (
              <UserCircleIcon className="w-full h-full text-slate-300 dark:text-slate-500" />
            )}
          </div>
        )}
        <div>
          <p className="font-semibold text-slate-900 dark:text-white">{testimonial.author}</p>
          {testimonial.role && (
            <p className="text-sm text-slate-500 dark:text-slate-400">{testimonial.role}</p>
          )}
        </div>
      </div>
    </div>
  );

  if (content.layout === 'carousel') {
    return (
      <div style={containerStyle}>
        <div className="max-w-4xl mx-auto relative">
          {/* Navigation */}
          <button
            onClick={handlePrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 w-10 h-10 bg-white dark:bg-slate-800 rounded-full shadow-lg flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            <ChevronLeftIcon className="w-5 h-5 text-slate-700 dark:text-slate-300" />
          </button>

          <TestimonialCard testimonial={content.testimonials[currentIndex]} isCarousel />

          <button
            onClick={handleNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 w-10 h-10 bg-white dark:bg-slate-800 rounded-full shadow-lg flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            <ChevronRightIcon className="w-5 h-5 text-slate-700 dark:text-slate-300" />
          </button>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-6">
            {content.testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={classNames(
                  'w-2 h-2 rounded-full transition-colors',
                  index === currentIndex
                    ? 'bg-slate-900 dark:bg-white'
                    : 'bg-slate-300 dark:bg-slate-600'
                )}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Grid layout
  return (
    <div style={containerStyle}>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {content.testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
