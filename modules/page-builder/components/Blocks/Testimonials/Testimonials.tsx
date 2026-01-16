/**
 * Testimonials Block
 * Customer testimonials in carousel or grid layout
 */

import React, { useState, useCallback, useRef, memo } from "react";
import classNames from "classnames";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  StarIcon,
} from "@heroicons/react/24/solid";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import type { PageBlock, TestimonialsContent } from "../../../types";
import { usePageBuilder } from "../../../context/PageBuilderContext";
import InlineRichText from "../../InlineRichText";

interface TestimonialsProps {
  block: PageBlock;
  isPreview?: boolean;
  isEditing?: boolean;
}

// Memoized testimonial card to prevent unnecessary re-renders
const TestimonialCard = memo(
  ({
    testimonial,
    blockId,
    showRating,
    showAvatar,
    isCarousel,
    onUpdateQuote,
    onUpdateAuthor,
    onUpdateRole,
  }: {
    testimonial: TestimonialsContent["testimonials"][0];
    blockId: string;
    showRating?: boolean;
    showAvatar?: boolean;
    isCarousel?: boolean;
    onUpdateQuote: (value: string) => void;
    onUpdateAuthor: (value: string) => void;
    onUpdateRole: (value: string) => void;
  }) => (
    <div
      className={classNames(
        "relative rounded-2xl p-8 overflow-hidden",
        "bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900",
        "border border-slate-200/80 dark:border-slate-600/50",
        "shadow-[0_4px_20px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.8)]",
        "dark:shadow-[0_4px_20px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.05)]",
        isCarousel ? "mx-auto max-w-2xl" : "",
      )}
    >
      {/* Large decorative quote */}
      <svg
        className="absolute top-4 right-4 w-16 h-16 text-slate-100 dark:text-slate-700/50"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
      </svg>

      {/* Rating */}
      {showRating && testimonial.rating && (
        <div className="flex gap-1 mb-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <StarIcon
              key={i}
              className={classNames(
                "w-5 h-5",
                i < testimonial.rating!
                  ? "text-amber-400"
                  : "text-slate-200 dark:text-slate-600",
              )}
            />
          ))}
        </div>
      )}

      {/* Quote */}
      <blockquote className="relative z-10 text-lg text-slate-700 dark:text-slate-300 mb-6 leading-relaxed">
        <InlineRichText
          blockId={blockId}
          field={`testimonials.${testimonial.id}.quote`}
          value={testimonial.quote || ""}
          tag="p"
          className="italic"
          placeholder="Enter testimonial quote..."
          multiline={true}
          onUpdate={onUpdateQuote}
        />
      </blockquote>

      {/* Author */}
      <div className="relative z-10 flex items-center gap-4">
        {showAvatar && (
          <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-600 dark:to-slate-700 flex-shrink-0 ring-2 ring-white/50 dark:ring-slate-500/30 shadow-sm">
            {testimonial.avatar ? (
              <img
                src={testimonial.avatar}
                alt={testimonial.author}
                className="w-full h-full object-cover"
              />
            ) : (
              <UserCircleIcon className="w-full h-full text-slate-400 dark:text-slate-400" />
            )}
          </div>
        )}
        <div className="min-w-0">
          <InlineRichText
            blockId={blockId}
            field={`testimonials.${testimonial.id}.author`}
            value={testimonial.author || ""}
            tag="p"
            className="font-semibold text-slate-900 dark:text-white"
            placeholder="Author name..."
            multiline={false}
            enableLinks={false}
            onUpdate={onUpdateAuthor}
          />
          <InlineRichText
            blockId={blockId}
            field={`testimonials.${testimonial.id}.role`}
            value={testimonial.role || ""}
            tag="p"
            className="text-sm text-slate-500 dark:text-slate-400"
            placeholder="Role or company..."
            multiline={false}
            enableLinks={false}
            onUpdate={onUpdateRole}
          />
        </div>
      </div>
    </div>
  ),
);

TestimonialCard.displayName = "TestimonialCard";

const Testimonials: React.FC<TestimonialsProps> = ({
  block,
  isPreview,
  isEditing = true,
}) => {
  const rawContent = block.content as unknown as TestimonialsContent;
  const content = {
    ...rawContent,
    testimonials: rawContent?.testimonials || [],
  };
  const style = block.style;
  const [currentIndex, setCurrentIndex] = useState(0);
  const { updateBlock, state } = usePageBuilder();
  const canEdit = isEditing && !state.isPreviewMode;

  // Use ref to avoid recreating callback on every content change
  const contentRef = useRef(content);
  contentRef.current = content;

  // Handler for updating individual testimonial fields
  const updateTestimonial = useCallback(
    (
      testimonialId: string,
      field: "quote" | "author" | "role",
      value: string,
    ) => {
      const updatedTestimonials = contentRef.current.testimonials.map((t) =>
        t.id === testimonialId ? { ...t, [field]: value } : t,
      );
      updateBlock(block.id, {
        content: { testimonials: updatedTestimonials },
      });
    },
    [block.id, updateBlock],
  );

  const containerStyle: React.CSSProperties = {
    padding: style.padding
      ? `${style.padding.top}px ${style.padding.right}px ${style.padding.bottom}px ${style.padding.left}px`
      : undefined,
    backgroundColor: style.backgroundColor,
  };

  const handlePrev = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? content.testimonials.length - 1 : prev - 1,
    );
  };

  const handleNext = () => {
    setCurrentIndex((prev) =>
      prev === content.testimonials.length - 1 ? 0 : prev + 1,
    );
  };

  if (content.testimonials.length === 0) {
    return (
      <div style={containerStyle} className="text-center py-12 text-slate-400">
        No testimonials added
      </div>
    );
  }

  if (content.layout === "carousel") {
    const currentTestimonial = content.testimonials[currentIndex];
    return (
      <div style={containerStyle}>
        <div className="max-w-4xl mx-auto relative">
          {/* Navigation Buttons */}
          <button
            onClick={handlePrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 w-11 h-11 rounded-full flex items-center justify-center bg-gradient-to-br from-white to-slate-100 dark:from-slate-700 dark:to-slate-800 border border-slate-200/80 dark:border-slate-600/50 shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:shadow-[0_6px_16px_rgba(0,0,0,0.12)] hover:scale-105 active:scale-95 transition-transform"
          >
            <ChevronLeftIcon className="w-5 h-5 text-slate-600 dark:text-slate-300" />
          </button>

          <TestimonialCard
            key={currentTestimonial.id}
            testimonial={currentTestimonial}
            blockId={block.id}
            showRating={content.showRating}
            showAvatar={content.showAvatar}
            isCarousel
            onUpdateQuote={(value) =>
              updateTestimonial(currentTestimonial.id, "quote", value)
            }
            onUpdateAuthor={(value) =>
              updateTestimonial(currentTestimonial.id, "author", value)
            }
            onUpdateRole={(value) =>
              updateTestimonial(currentTestimonial.id, "role", value)
            }
          />

          <button
            onClick={handleNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 w-11 h-11 rounded-full flex items-center justify-center bg-gradient-to-br from-white to-slate-100 dark:from-slate-700 dark:to-slate-800 border border-slate-200/80 dark:border-slate-600/50 shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:shadow-[0_6px_16px_rgba(0,0,0,0.12)] hover:scale-105 active:scale-95 transition-transform"
          >
            <ChevronRightIcon className="w-5 h-5 text-slate-600 dark:text-slate-300" />
          </button>

          {/* Dots */}
          <div className="flex justify-center gap-2.5 mt-8">
            {content.testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={classNames(
                  "rounded-full transition-all duration-200",
                  index === currentIndex
                    ? "w-6 h-2 bg-slate-800 dark:bg-white"
                    : "w-2 h-2 bg-slate-300 dark:bg-slate-600 hover:bg-slate-400 dark:hover:bg-slate-500",
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
            <TestimonialCard
              key={testimonial.id}
              testimonial={testimonial}
              blockId={block.id}
              showRating={content.showRating}
              showAvatar={content.showAvatar}
              onUpdateQuote={(value) =>
                updateTestimonial(testimonial.id, "quote", value)
              }
              onUpdateAuthor={(value) =>
                updateTestimonial(testimonial.id, "author", value)
              }
              onUpdateRole={(value) =>
                updateTestimonial(testimonial.id, "role", value)
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
