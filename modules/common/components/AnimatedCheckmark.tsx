import { useState, useEffect } from 'react';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

interface AnimatedCheckmarkProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  delay?: number;
  className?: string;
}

const sizeClasses = {
  sm: 'h-6 w-6',
  md: 'h-8 w-8',
  lg: 'h-12 w-12',
  xl: 'h-16 w-16',
};

const AnimatedCheckmark = ({
  size = 'md',
  delay = 0,
  className = '',
}: AnimatedCheckmarkProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
      // Start animation slightly after visibility
      setTimeout(() => setIsAnimating(true), 50);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  // Check for reduced motion preference
  const prefersReducedMotion =
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false;

  const animationClasses = prefersReducedMotion
    ? 'opacity-100 scale-100'
    : `transition-all duration-500 ease-out ${
        isAnimating
          ? 'opacity-100 scale-100 animate-pulse'
          : 'opacity-0 scale-50'
      }`;

  if (!isVisible && !prefersReducedMotion) {
    return <div className={`${sizeClasses[size]} ${className}`} />;
  }

  return (
    <div className={`inline-flex items-center justify-center ${className}`}>
      <CheckCircleIcon
        className={`${sizeClasses[size]} text-green-500 ${animationClasses}`}
        aria-hidden="true"
      />
    </div>
  );
};

export default AnimatedCheckmark;
