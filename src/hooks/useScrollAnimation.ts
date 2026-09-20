import { useScroll, useTransform, useSpring } from 'motion/react';
import { useRef } from 'react';

interface ScrollAnimationOptions {
  inputRange?: [number, number];
  outputRange?: [number, number];
  smooth?: number;
}

export function useScrollAnimation(options: ScrollAnimationOptions = {}) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  });

  const { inputRange = [0, 1], outputRange = [0, 1], smooth = 0.1 } = options;

  const transformed = useTransform(scrollYProgress, inputRange, outputRange);
  const smoothed = useSpring(transformed, { stiffness: 100, damping: 30, mass: smooth });

  return { ref, scrollYProgress, value: smoothed };
}
