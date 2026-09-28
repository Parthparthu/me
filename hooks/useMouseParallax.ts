/**
 * useMouseParallax — Tracks normalized cursor position in [-1, 1] space.
 * Updates the global cursor store and returns reactive { x, y } values.
 * Only active on fine-pointer (desktop) devices.
 */
'use client';

import { useEffect, useRef } from 'react';
import { useSceneStore } from '@/store/useSceneStore';

interface ParallaxValues {
  x: number; // -1 (left) to 1 (right)
  y: number; // -1 (top) to 1 (bottom)
  /** Alias for x — normalized horizontal */
  nx: number;
  /** Alias for y — normalized vertical */
  ny: number;
}

export function useMouseParallax(): ParallaxValues {
  const setCursor = useSceneStore((s) => s.setCursor);
  const valRef = useRef<ParallaxValues>({ x: 0, y: 0, nx: 0, ny: 0 });

  useEffect(() => {
    // Only on fine-pointer devices
    if (!window.matchMedia('(pointer: fine)').matches) return;

    const handleMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = -((e.clientY / window.innerHeight) * 2 - 1);
      valRef.current = { x: nx, y: ny, nx, ny };

      setCursor({
        x: e.clientX,
        y: e.clientY,
        nx,
        ny,
      });
    };

    window.addEventListener('mousemove', handleMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMove);
  }, [setCursor]);

  return valRef.current;
}
