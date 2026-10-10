'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { AdaptiveDpr, PerformanceMonitor } from '@react-three/drei';
import { useSceneStore } from '@/store/useSceneStore';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { HeroGlassCore } from './HeroGlassCore';
import { InteractiveParticleField } from './InteractiveParticleField';

/**
 * DynamicCursorLight: Soft point light that tracks the pointer position.
 * Casts moving specular highlights and caustic refractions across the glass facets.
 */
function DynamicCursorLight() {
  const lightRef = useRef<THREE.PointLight>(null);
  const targetPos = useRef(new THREE.Vector3(0, 0, 3));

  useEffect(() => {
    const onPointerMove = (e: PointerEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = -(e.clientY / window.innerHeight) * 2 + 1;
      targetPos.current.set(nx * 4, ny * 3, 3.5);
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    return () => window.removeEventListener('pointermove', onPointerMove);
  }, []);

  useFrame((_, delta) => {
    if (!lightRef.current) return;
    lightRef.current.position.lerp(targetPos.current, delta * 4);
  });

  return (
    <pointLight
      ref={lightRef}
      color="#38bdf8"
      intensity={1.2}
      distance={10}
      decay={2}
    />
  );
}

/**
 * SceneContent: Assembles the lighting, interactive 3D crystal core,
 * and dynamic particle field.
 */
function SceneContent() {
  const setCanvasReady = useSceneStore((s) => s.setCanvasReady);

  useEffect(() => {
    setCanvasReady(true);
    return () => setCanvasReady(false);
  }, [setCanvasReady]);

  return (
    <>
      {/* Base ambient fill: Keeps background readable without pitch black */}
      <ambientLight intensity={0.65} color="#0f172a" />

      {/* Key directional light for crisp facet edge highlights */}
      <directionalLight position={[6, 8, 5]} intensity={2.0} color="#f0f9ff" />

      {/* Rim light from lower-left for liquid-glass silhouette definition */}
      <directionalLight position={[-6, -4, -2]} intensity={1.4} color="#0284c7" />

      {/* Interactive cursor light */}
      <DynamicCursorLight />

      {/* Central Interactive 3D Liquid-Glass Prism */}
      <HeroGlassCore />

      {/* Interactive 3D Particle Constellation */}
      <InteractiveParticleField />
    </>
  );
}

export function SceneCanvas() {
  const { quality, setQuality } = useSceneStore();
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);

    const onMotionChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches);
    };

    const onVisibilityChange = () => {
      setIsVisible(!document.hidden);
    };

    mediaQuery.addEventListener('change', onMotionChange);
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      mediaQuery.removeEventListener('change', onMotionChange);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, []);

  // Do not render canvas if disabled by performance monitor or user preference
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
        camera={{ position: [0, 0, 7.5], fov: 45, near: 0.1, far: 80 }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          stencil: false,
          depth: true,
        }}
        style={{ background: 'transparent' }}
        frameloop={!isVisible || reducedMotion ? 'never' : 'always'}
      >
        <AdaptiveDpr pixelated />
        <PerformanceMonitor
          onDecline={() => {
            if (quality === 'high') setQuality('medium');
            else if (quality === 'medium') setQuality('low');
            else setQuality('none');
          }}
          flipflops={3}
          factor={1}
          step={0.2}
          ms={200}
        >
          <SceneContent />
        </PerformanceMonitor>
      </Canvas>
    </div>
  );
}
