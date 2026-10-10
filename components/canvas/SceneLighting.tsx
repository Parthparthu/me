'use client';

import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Environment, Lightformer } from '@react-three/drei';
import * as THREE from 'three';
import { useSceneStore } from '@/store/useSceneStore';
import { POINTER_REACTIVE_3D } from '@/lib/config';

/**
 * DynamicPointerLight: Point light tracking pointer in 3D space.
 * Casts dynamic specular highlights across refractive glass facets.
 */
function DynamicPointerLight() {
  const lightRef = useRef<THREE.PointLight>(null);
  const targetPos = useRef(new THREE.Vector3(0, 0, 4));

  useEffect(() => {
    if (!POINTER_REACTIVE_3D) return;

    const onPointerMove = (e: PointerEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = -(e.clientY / window.innerHeight) * 2 + 1;
      targetPos.current.set(nx * 5, ny * 3.5, 4);
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    return () => window.removeEventListener('pointermove', onPointerMove);
  }, []);

  useFrame((_, delta) => {
    if (!lightRef.current || !POINTER_REACTIVE_3D) return;
    lightRef.current.position.lerp(targetPos.current, Math.min(delta * 4, 1));
  });

  if (!POINTER_REACTIVE_3D) return null;

  return (
    <pointLight
      ref={lightRef}
      color="#38bdf8"
      intensity={1.4}
      distance={14}
      decay={2}
    />
  );
}

/**
 * SceneLighting: Complete studio lighting and procedural HDR environment.
 * Re-lights dynamically for Light Mode and Dark Mode for optimal glass refraction.
 */
export function SceneLighting() {
  const quality = useSceneStore((s) => s.quality);
  const theme = useSceneStore((s) => s.theme);
  const isDark = theme === 'dark';

  return (
    <>
      {/* Base ambient illumination: luminous sky in light mode, deep obsidian in dark */}
      <ambientLight intensity={isDark ? 0.65 : 1.1} color={isDark ? '#0b1329' : '#e0f2fe'} />

      {/* Primary Key light */}
      <directionalLight
        position={[6, 8, 6]}
        intensity={isDark ? 2.2 : 1.9}
        color={isDark ? '#f0f9ff' : '#ffffff'}
        castShadow={quality === 'high'}
      />

      {/* Rim light for liquid-glass silhouette definition */}
      <directionalLight
        position={[-6, -4, -3]}
        intensity={isDark ? 1.5 : 1.6}
        color="#0284c7"
      />

      {/* Soft warm fill light */}
      <directionalLight
        position={[0, -6, 4]}
        intensity={isDark ? 0.6 : 0.8}
        color="#38bdf8"
      />

      {/* Interactive cursor tracking light */}
      <DynamicPointerLight />

      {/* Procedural HDR Studio Environment for realistic glass refraction */}
      <Environment resolution={256}>
        <group rotation={[-Math.PI / 3, 0, 1]}>
          {/* Top key softbox */}
          <Lightformer
            form="rect"
            intensity={isDark ? 2.5 : 2.0}
            color={isDark ? '#f0f9ff' : '#ffffff'}
            position={[0, 6, -2]}
            scale={[10, 5, 1]}
            target={[0, 0, 0]}
          />
          {/* Accent cyan rim */}
          <Lightformer
            form="rect"
            intensity={isDark ? 2.0 : 2.4}
            color="#0ea5e9"
            position={[-5, 2, -1]}
            scale={[6, 3, 1]}
            target={[0, 0, 0]}
          />
          {/* Sapphire fill */}
          <Lightformer
            form="circle"
            intensity={isDark ? 1.5 : 1.8}
            color="#0284c7"
            position={[5, -2, 2]}
            scale={[5, 5, 1]}
            target={[0, 0, 0]}
          />
          {/* Bottom subtle bounce */}
          <Lightformer
            form="ring"
            intensity={isDark ? 0.8 : 1.2}
            color="#38bdf8"
            position={[0, -5, 0]}
            scale={[8, 8, 1]}
            target={[0, 0, 0]}
          />
        </group>
      </Environment>
    </>
  );
}
