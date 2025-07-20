import { useState, useEffect } from 'react';

interface CountUpAnimationProps {
  end: number;
  start?: number;
  duration?: number;
  delay?: number;
  className?: string;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}

const CountUpAnimation = ({
  end,
  start = 0,
  duration = 2000,
  delay = 0,
  className = '',
  prefix = '',
  suffix = '',
  decimals = 0,
}: CountUpAnimationProps) => {
  const [count, setCount] = useState(start);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    if (prefersReducedMotion) {
      const timer = setTimeout(() => {
        setCount(end);
        setHasStarted(true);
      }, delay);
      return () => clearTimeout(timer);
    }

    const timer = setTimeout(() => {
      setHasStarted(true);
      const increment = (end - start) / (duration / 16); // 60fps
      let current = start;

      const counter = setInterval(() => {
        current += increment;
        if (current >= end) {
          setCount(end);
          clearInterval(counter);
        } else {
          setCount(current);
        }
      }, 16);

      return () => clearInterval(counter);
    }, delay);

    return () => clearTimeout(timer);
  }, [end, start, duration, delay]);

  const displayValue = hasStarted
    ? count.toFixed(decimals)
    : start.toFixed(decimals);

  return (
    <span className={className}>
      {prefix}
      {displayValue}
      {suffix}
    </span>
  );
};

export default CountUpAnimation;
