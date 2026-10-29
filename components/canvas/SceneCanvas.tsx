'use client';

import dynamic from 'next/dynamic';
import { Canvas } from '@react-three/fiber';
import { Suspense, useEffect, useState } from 'react';
import { PerformanceMonitor, AdaptiveDpr } from '@react-three/drei';
import { useSceneStore } from '@/store/useSceneStore';
import { useGPUTier } from '@/hooks/useGPUTier';
import { QUALITY_CONFIG } from '@/lib/config';
import { SceneLighting } from './SceneLighting';
import { CameraRig } from './CameraRig';
import { ParticleDust } from './ParticleDust';

// Suppress Three.js r186 deprecation notice for Clock triggered internally by R3F store
if (typeof window !== 'undefined') {
  const origWarn = console.warn;
  console.warn = (...args: unknown[]) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('THREE.Clock: This module has been deprecated')
    ) {
      return;
    }
    origWarn.apply(console, args);
  };
}

// Dynamically load room components
const WorkRoom = dynamic(
  () => import('./WorkRoom').then((m) => ({ default: m.WorkRoom })),
  { ssr: false }
);

const SkillsRoom = dynamic(
  () => import('./SkillsRoom').then((m) => ({ default: m.SkillsRoom })),
  { ssr: false }
);

const ContactRoom = dynamic(
  () => import('./ContactRoom').then((m) => ({ default: m.ContactRoom })),
  { ssr: false }
);

const PostProcessingEffects = dynamic(
  () => import('./PostProcessing').then((m) => ({ default: m.PostProcessingEffects })),
  { ssr: false }
);

function SceneInner() {
  const { quality, setCanvasReady } = useSceneStore();

  useEffect(() => {
    setCanvasReady(true);
    return () => setCanvasReady(false);
  }, [setCanvasReady]);

  return (
    <>
      <CameraRig />
      <SceneLighting />
      <Suspense fallback={null}>
        <WorkRoom />
        <SkillsRoom />
        <ContactRoom />
        {quality === 'high' && <ParticleDust />}
        {quality === 'high' && <PostProcessingEffects />}
      </Suspense>
    </>
  );
}

import { SceneFallback } from './SceneFallback';

export function SceneCanvas() {
  const { quality, setQuality } = useSceneStore();
  const [isVisible, setIsVisible] = useState(true);
  const [isReady, setIsReady] = useState(false);

  // Initialize GPU capability detection
  useGPUTier();

  useEffect(() => {
    const onVisibilityChange = () => {
      setIsVisible(!document.hidden);
    };

    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => document.removeEventListener('visibilitychange', onVisibilityChange);
  }, []);

  // Static fallback if WebGL is unavailable
  if (quality === 'none') {
    return <SceneFallback />;
  }

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        opacity: isReady ? 1 : 0,
        transition: 'opacity 500ms ease-out',
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 7.2], fov: 48, near: 0.1, far: 100 }}
        dpr={[1, Math.min(1.5, QUALITY_CONFIG.maxPixelRatio)]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          stencil: false,
          depth: true,
        }}
        style={{ background: 'transparent' }}
        frameloop={isVisible ? 'always' : 'never'}
        onCreated={() => setIsReady(true)}
      >
        <AdaptiveDpr pixelated />
        <PerformanceMonitor
          onDecline={() => {
            if (quality === 'high') setQuality('medium');
            else if (quality === 'medium') setQuality('low');
          }}
          flipflops={3}
          factor={1}
          step={0.2}
          ms={250}
        >
          <SceneInner />
        </PerformanceMonitor>
      </Canvas>
    </div>
  );
}
