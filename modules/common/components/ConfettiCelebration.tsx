import { useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';

interface ConfettiCelebrationProps {
  trigger?: boolean;
  duration?: number;
  particleCount?: number;
  spread?: number;
  colors?: string[];
  className?: string;
}

const ConfettiCelebration = ({
  trigger = true,
  duration = 3000,
  particleCount = 50,
  spread = 70,
  colors = ['#059669', '#10b981', '#34d399', '#6ee7b7', '#a7f3d0'],
  className = '',
}: ConfettiCelebrationProps) => {
  const animationEnd = useRef<number | null>(null);

  const stopConfetti = () => {
    if (animationEnd.current) {
      clearTimeout(animationEnd.current);
      animationEnd.current = null;
    }
  };

  const fireConfetti = () => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    if (prefersReducedMotion) return;

    const animationEndTime = Date.now() + duration;
    let animationId: number;

    const frame = () => {
      // Use the custom confetti instance
      confettiInstance({
        particleCount: Math.floor(particleCount / 8),
        spread,
        origin: {
          x: Math.random() * 0.6 + 0.2, // Random x between 0.2 and 0.8
          y: Math.random() * 0.2 + 0.1, // Random y between 0.1 and 0.3
        },
        colors,
        gravity: 0.6,
        scalar: 0.8,
        drift: 0,
        ticks: 200,
      });

      if (Date.now() < animationEndTime) {
        animationId = requestAnimationFrame(frame);
      }
    };

    frame();

    // Store timeout reference for cleanup
    animationEnd.current = window.setTimeout(() => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
      stopConfetti();
    }, duration + 1000);
  };

  useEffect(() => {
    if (trigger) {
      // Small delay to ensure page is fully loaded
      const timeout = setTimeout(fireConfetti, 300);
      return () => {
        clearTimeout(timeout);
        stopConfetti();
      };
    }
  }, [trigger]);

  useEffect(() => {
    return () => {
      stopConfetti();
    };
  }, []);

  // This component doesn't render anything visible - it just triggers confetti
  return null;
};

export default ConfettiCelebration;
