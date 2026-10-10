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

    const isFinePointer = window.matchMedia('(pointer: fine)').matches;

    if (isFinePointer) {
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
    } else {
      // Touch devices: gentle touch drag tilt with graceful reset on release
      let activeTouch = false;

      const handleTouchMove = (e: TouchEvent) => {
        if (!e.touches[0]) return;
        const touch = e.touches[0];
        const nx = ((touch.clientX / window.innerWidth) * 2 - 1) * 0.65;
        const ny = -((touch.clientY / window.innerHeight) * 2 - 1) * 0.65;
        valRef.current = { x: touch.clientX, y: touch.clientY, nx, ny };
        setCursor({ x: touch.clientX, y: touch.clientY, nx, ny });
        activeTouch = true;
      };

      const handleTouchEnd = () => {
        if (!activeTouch) return;
        valRef.current = { x: 0, y: 0, nx: 0, ny: 0 };
        setCursor({ x: 0, y: 0, nx: 0, ny: 0 });
        activeTouch = false;
      };

      window.addEventListener('touchmove', handleTouchMove, { passive: true });
      window.addEventListener('touchend', handleTouchEnd, { passive: true });
      window.addEventListener('touchcancel', handleTouchEnd, { passive: true });
      return () => {
        window.removeEventListener('touchmove', handleTouchMove);
        window.removeEventListener('touchend', handleTouchEnd);
        window.removeEventListener('touchcancel', handleTouchEnd);
      };
    }
  }, [setCursor]);

  return valRef.current;
}
