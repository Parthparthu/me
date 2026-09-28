/**
 * SceneCanvas — Persistent, full-viewport R3F canvas.
 * Mounts once at the layout level and never unmounts between route changes.
 * Stays fixed behind all DOM content (z-index: 0, pointer-events: none).
 *
 * Architecture:
 * - Single RAF via @react-three/fiber (no competing loops with Lenis/GSAP)
 * - frameloop="demand" sections: static rooms use on-demand rendering
 * - DPR capped at min(devicePixelRatio, 2) for performance
 * - Quality-gated: no canvas rendered in 'none' tier
 */
'use client';

import dynamic from 'next/dynamic';
import { Canvas } from '@react-three/fiber';
import { Suspense, useEffect } from 'react';
import { PerformanceMonitor, AdaptiveDpr } from '@react-three/drei';
import { useSceneStore } from '@/store/useSceneStore';
import { useGPUTier } from '@/hooks/useGPUTier';
import { SceneLighting } from './SceneLighting';
import { CameraRig } from './CameraRig';
import { ParticleDust } from './ParticleDust';

// Suppress known Three.js r186 deprecation notice for Clock triggered internally by R3F store
if (typeof window !== 'undefined') {
  const origWarn = console.warn;
  console.warn = (...args: unknown[]) => {
    if (typeof args[0] === 'string' && args[0].includes('THREE.Clock: This module has been deprecated')) {
      return;
    }
    origWarn.apply(console, args);
  };
}

// Lazy-load heavy room components so initial JS is minimal
const HeroRoom = dynamic(() => import('./HeroRoom').then(m => ({ default: m.HeroRoom })), {
  ssr: false,
});
const WorkRoom = dynamic(() => import('./WorkRoom').then(m => ({ default: m.WorkRoom })), {
  ssr: false,
});
const SkillsRoom = dynamic(() => import('./SkillsRoom').then(m => ({ default: m.SkillsRoom })), {
  ssr: false,
});
const JourneyRoom = dynamic(() => import('./JourneyRoom').then(m => ({ default: m.JourneyRoom })), {
  ssr: false,
});
const ContactRoom = dynamic(() => import('./ContactRoom').then(m => ({ default: m.ContactRoom })), {
  ssr: false,
});
// Post-processing is lazy to avoid loading in non-high-quality tiers
const PostProcessingEffects = dynamic(
  () => import('./PostProcessing').then(m => ({ default: m.PostProcessingEffects })),
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
        <JourneyRoom />
        <ContactRoom />
        {quality === 'high' && <ParticleDust />}
        {quality === 'high' && <PostProcessingEffects />}
      </Suspense>
    </>
  );
}

export function SceneCanvas() {
  const { quality, setQuality } = useSceneStore();
  useGPUTier(); // Detects GPU and sets quality in store

  // Don't render canvas for 'none' quality tier (static fallback)
  if (quality === 'none') return null;

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
        camera={{ position: [0, 0, 8], fov: 50, near: 0.1, far: 200 }}
        dpr={[1, 2]} // cap at 2x DPR
        gl={{
          antialias: true,
          alpha: true, // transparent background — scene sits behind DOM
          powerPreference: 'high-performance',
          stencil: false,
          depth: true,
        }}
        style={{ background: 'transparent' }}
        shadows="percentage"
      >
        {/* Auto-degrade DPR when FPS drops */}
        <AdaptiveDpr pixelated />

        {/* Performance monitor: degrade quality if FPS consistently low */}
        <PerformanceMonitor
          onDecline={() => {
            if (quality === 'high') setQuality('medium');
            else if (quality === 'medium') setQuality('low');
          }}
          onIncline={() => {
            // Don't auto-upgrade to avoid oscillation
          }}
          flipflops={3}
          factor={1}
          step={0.2}
          ms={200}
        >
          <SceneInner />
        </PerformanceMonitor>
      </Canvas>
    </div>
  );
}
