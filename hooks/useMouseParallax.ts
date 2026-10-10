'use client';

import { useEffect, useRef } from 'react';
import { useSceneStore } from '@/store/useSceneStore';
import { POINTER_REACTIVE_3D } from '@/lib/config';

interface ParallaxValues {
  x: number;
  y: number;
  nx: number;
  ny: number;
}

export function useMouseParallax(): ParallaxValues {
  const setCursor = useSceneStore((s) => s.setCursor);
  const valRef = useRef<ParallaxValues>({ x: 0, y: 0, nx: 0, ny: 0 });

  useEffect(() => {
    if (!POINTER_REACTIVE_3D) return;

    // Active on fine pointer (desktop) devices
    const isFinePointer = window.matchMedia('(pointer: fine)').matches;
    if (!isFinePointer) return;

    const handlePointerMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = -((e.clientY / window.innerHeight) * 2 - 1);
      valRef.current = { x: e.clientX, y: e.clientY, nx, ny };

      setCursor({
        x: e.clientX,
        y: e.clientY,
        nx,
        ny,
      });
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    return () => window.removeEventListener('mousemove', handlePointerMove);
  }, [setCursor]);

  return valRef.current;
}
