'use client';

import { useEffect } from 'react';
import { POINTER_REACTIVE_3D } from '@/lib/config';

export interface ParallaxValues {
  x: number;
  y: number;
  nx: number;
  ny: number;
}

const pointerState: ParallaxValues = { x: 0, y: 0, nx: 0, ny: 0 };
let initialized = false;

function initPointerTracking() {
  if (typeof window === 'undefined' || initialized || !POINTER_REACTIVE_3D) return;
  initialized = true;

  const isFinePointer = window.matchMedia('(pointer: fine)').matches;

  if (isFinePointer) {
    window.addEventListener(
      'mousemove',
      (e: MouseEvent) => {
        pointerState.x = e.clientX;
        pointerState.y = e.clientY;
        pointerState.nx = (e.clientX / window.innerWidth) * 2 - 1;
        pointerState.ny = -((e.clientY / window.innerHeight) * 2 - 1);
      },
      { passive: true }
    );
  } else {
    window.addEventListener(
      'touchmove',
      (e: TouchEvent) => {
        if (!e.touches[0]) return;
        const touch = e.touches[0];
        pointerState.x = touch.clientX;
        pointerState.y = touch.clientY;
        pointerState.nx = ((touch.clientX / window.innerWidth) * 2 - 1) * 0.65;
        pointerState.ny = -((touch.clientY / window.innerHeight) * 2 - 1) * 0.65;
      },
      { passive: true }
    );

    const handleTouchEnd = () => {
      pointerState.x = 0;
      pointerState.y = 0;
      pointerState.nx = 0;
      pointerState.ny = 0;
    };

    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    window.addEventListener('touchcancel', handleTouchEnd, { passive: true });
  }
}

export function getPointerState(): ParallaxValues {
  if (typeof window !== 'undefined' && !initialized) {
    initPointerTracking();
  }
  return pointerState;
}

export function useMouseParallax(): ParallaxValues {
  useEffect(() => {
    initPointerTracking();
  }, []);

  return pointerState;
}
