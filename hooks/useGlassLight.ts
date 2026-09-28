/**
 * useGlassLight — Combines cursor and gyroscope input into a single
 * normalized light position { lx, ly } for glass specular highlights.
 * Desktop: cursor-driven. Mobile: gyro-driven. Smoothed via lerp.
 */
'use client';

import { useEffect, useRef } from 'react';
import { useSceneStore } from '@/store/useSceneStore';
import { useGyroscope } from './useGyroscope';

interface GlassLightValues {
  /** 0–100 percentage for CSS `radial-gradient at X Y` */
  lx: number;
  ly: number;
}

export function useGlassLight(): GlassLightValues {
  const cursor = useSceneStore((s) => s.cursor);
  const { values: gyro } = useGyroscope();
  const valRef = useRef<GlassLightValues>({ lx: 50, ly: 0 });

  useEffect(() => {
    const isFinePointer = window.matchMedia('(pointer: fine)').matches;

    if (isFinePointer) {
      // Convert normalized [-1,1] cursor to percentage
      valRef.current = {
        lx: ((cursor.nx + 1) / 2) * 100,
        ly: ((1 - cursor.ny) / 2) * 100, // invert Y for CSS
      };
    } else if (gyro.permitted) {
      valRef.current = {
        lx: ((gyro.x + 1) / 2) * 100,
        ly: ((1 - gyro.y) / 2) * 100,
      };
    }
  }, [cursor.nx, cursor.ny, gyro.x, gyro.y, gyro.permitted]);

  return valRef.current;
}
