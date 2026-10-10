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
const HeroRoom = dynamic(
  () => import('./HeroRoom').then((m) => ({ default: m.HeroRoom })),
  { ssr: false }
);

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
        <HeroRoom />
        <WorkRoom />
        <SkillsRoom />
        <ContactRoom />
        {quality === 'high' && <ParticleDust />}
        {quality === 'high' && <PostProcessingEffects />}
      </Suspense>
    </>
  );
}

/**
 * WebGLFallback: Polished static geometric glass fallback
 * rendered when WebGL is unsupported or disabled.
 */
function WebGLFallback() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-0 pointer-events-none overflow-hidden opacity-40"
    >
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(14,165,233,0.15) 0%, transparent 70%)',
        }}
      />
      <div
        className="absolute top-2/3 left-1/3 w-80 h-80 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(16,185,129,0.1) 0%, transparent 70%)',
        }}
      />
    </div>
  );
}

export function SceneCanvas() {
  const { quality, setQuality } = useSceneStore();
  const [isVisible, setIsVisible] = useState(true);

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
    return <WebGLFallback />;
  }

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 7.2], fov: 48, near: 0.1, far: 100 }}
        dpr={[1, Math.min(2, QUALITY_CONFIG.maxPixelRatio)]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          stencil: false,
          depth: true,
        }}
        style={{ background: 'transparent' }}
        frameloop={isVisible ? 'always' : 'never'}
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
