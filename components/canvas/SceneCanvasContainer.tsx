'use client';

import dynamic from 'next/dynamic';
import { SceneFallback } from './SceneFallback';

const SceneCanvas = dynamic(
  () => import('./SceneCanvas').then((m) => m.SceneCanvas),
  {
    ssr: false,
    loading: () => null,
  }
);

export function SceneCanvasContainer() {
  return (
    <>
      <SceneFallback />
      <SceneCanvas />
    </>
  );
}
