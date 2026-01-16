/**
 * Testimonials Block
 * Customer testimonials in carousel or grid layout
 */

import React, { useState, useCallback, useRef } from "react";
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

  const TestimonialCard = ({
    testimonial,
    isCarousel = false,
  }: {
    testimonial: (typeof content.testimonials)[0];
    isCarousel?: boolean;
  }) => (
    <div
      className={classNames(
        // Frost Secondary Card
        "rounded-xl p-6 overflow-hidden",
        "bg-white/60 dark:bg-white/5",
        "backdrop-blur-lg",
        "border border-slate-200/50 dark:border-white/10",
        "shadow-[0_2px_12px_rgba(0,0,0,0.04)]",
        "hover:bg-white/80 dark:hover:bg-white/10",
        "transition-all duration-200 ease-out",
        isCarousel ? "mx-auto max-w-2xl" : "",
      )}
    >
      {/* Rating */}
      {content.showRating && testimonial.rating && (
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
      <blockquote className="text-lg text-slate-700 dark:text-slate-300 mb-4">
        <InlineRichText
          blockId={block.id}
          field={`testimonials.${testimonial.id}.quote`}
          value={testimonial.quote || ""}
          tag="p"
          className="quote-marks"
          placeholder="Enter testimonial quote..."
          multiline={true}
          onUpdate={(value) =>
            updateTestimonial(testimonial.id, "quote", value)
          }
        />
      </blockquote>

      {/* Author */}
      <div className="flex items-center gap-3">
        {content.showAvatar && (
          <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-100/80 dark:bg-white/5 flex-shrink-0">
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
        <div className="min-w-0">
          <InlineRichText
            blockId={block.id}
            field={`testimonials.${testimonial.id}.author`}
            value={testimonial.author || ""}
            tag="p"
            className="font-semibold text-slate-900 dark:text-white"
            placeholder="Author name..."
            multiline={false}
            enableLinks={false}
            onUpdate={(value) =>
              updateTestimonial(testimonial.id, "author", value)
            }
          />
          <InlineRichText
            blockId={block.id}
            field={`testimonials.${testimonial.id}.role`}
            value={testimonial.role || ""}
            tag="p"
            className="text-sm text-slate-500 dark:text-slate-400"
            placeholder="Role or company..."
            multiline={false}
            enableLinks={false}
            onUpdate={(value) =>
              updateTestimonial(testimonial.id, "role", value)
            }
          />
        </div>
      </div>
    </div>
  );

  if (content.layout === "carousel") {
    return (
      <div style={containerStyle}>
        <div className="max-w-4xl mx-auto relative">
          {/* Navigation - Frost Icon Buttons */}
          <button
            onClick={handlePrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 w-10 h-10 rounded-full flex items-center justify-center bg-white/90 dark:bg-slate-800/80 backdrop-blur-xl border border-slate-200/60 dark:border-white/10 shadow-[0_4px_16px_rgba(0,0,0,0.08)] hover:shadow-[0_4px_20px_rgba(0,0,0,0.12)] transition-all duration-200 ease-out"
          >
            <ChevronLeftIcon className="w-5 h-5 text-slate-700 dark:text-slate-300" />
          </button>

          <TestimonialCard
            testimonial={content.testimonials[currentIndex]}
            isCarousel
          />

          <button
            onClick={handleNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 w-10 h-10 rounded-full flex items-center justify-center bg-white/90 dark:bg-slate-800/80 backdrop-blur-xl border border-slate-200/60 dark:border-white/10 shadow-[0_4px_16px_rgba(0,0,0,0.08)] hover:shadow-[0_4px_20px_rgba(0,0,0,0.12)] transition-all duration-200 ease-out"
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
                  "w-2 h-2 rounded-full transition-colors",
                  index === currentIndex
                    ? "bg-slate-900 dark:bg-white"
                    : "bg-slate-300 dark:bg-slate-600",
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
