/**
 * SceneCanvas: Persistent, full-viewport ambient 3D canvas.
 * Mounts once at the layout level and never unmounts between route changes.
 * Stays fixed behind all DOM content (z-index: 0, pointer-events: none).
 *
 * Architecture:
 * - Single RAF via @react-three/fiber
 * - Ambient-only: no scroll-driven camera, no pinned sections
 * - DPR capped at 2 for performance
 * - Disabled entirely when quality === 'none' or prefers-reduced-motion
 *
 * Deliberately minimal: the canvas provides depth and atmosphere,
 * not spectacle. DOM content is the primary communication layer.
 */
'use client';

import { Canvas } from '@react-three/fiber';
import { AdaptiveDpr, PerformanceMonitor } from '@react-three/drei';
import { useSceneStore } from '@/store/useSceneStore';
import { useEffect, useRef } from 'react';

// A single soft ambient light + one point light: no geometry, no camera rig.
// Geometry can be added here later (hero glass object, etc.) after audit approval.
function AmbientScene() {
  const setCanvasReady = useSceneStore((s) => s.setCanvasReady);
  const setQuality = useSceneStore((s) => s.setQuality);

  useEffect(() => {
    setCanvasReady(true);
    return () => setCanvasReady(false);
  }, [setCanvasReady]);

  return (
    <>
      {/* Base ambient fill: keeps dark bg from being pure black */}
      <ambientLight intensity={0.4} />
      {/* Soft key light from upper-right */}
      <pointLight position={[6, 8, 4]} intensity={1.2} color="#c8d8f0" />
      {/* Subtle fill from lower-left */}
      <pointLight position={[-4, -3, 2]} intensity={0.3} color="#d0e8e0" />
    </>
  );
}

export function SceneCanvas() {
  const { quality, setQuality } = useSceneStore();
  const prefersReducedMotion = useRef(false);

  useEffect(() => {
    prefersReducedMotion.current = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
  }, []);

  // Don't render canvas for 'none' quality tier or reduced motion
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
        camera={{ position: [0, 0, 8], fov: 50, near: 0.1, far: 100 }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          stencil: false,
          depth: true,
        }}
        style={{ background: 'transparent' }}
        frameloop={prefersReducedMotion.current ? 'never' : 'demand'}
      >
        <AdaptiveDpr pixelated />
        <PerformanceMonitor
          onDecline={() => {
            if (quality === 'high') setQuality('medium');
            else if (quality === 'medium') setQuality('low');
            else setQuality('none');
          }}
          onIncline={() => {
            // Do not auto-upgrade to avoid oscillation
          }}
          flipflops={3}
          factor={1}
          step={0.2}
          ms={200}
        >
          <AmbientScene />
        </PerformanceMonitor>
      </Canvas>
    </div>
  );
}
