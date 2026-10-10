'use client';

import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Environment, Lightformer } from '@react-three/drei';
import * as THREE from 'three';
import { useSceneStore } from '@/store/useSceneStore';
import { POINTER_REACTIVE_3D } from '@/lib/config';

/**
 * DynamicPointerLight: Subtle point light that tracks the pointer in 3D space.
 * Casts moving specular highlights across refractive glass facets.
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
 * Uses Lightformers for zero-network-overhead glass reflections.
 */
export function SceneLighting() {
  const quality = useSceneStore((s) => s.quality);

  return (
    <>
      {/* Base ambient illumination */}
      <ambientLight intensity={0.65} color="#0b1329" />

      {/* Primary Key light */}
      <directionalLight
        position={[6, 8, 6]}
        intensity={2.2}
        color="#f0f9ff"
        castShadow={quality === 'high'}
      />

      {/* Rim light for liquid-glass silhouette definition */}
      <directionalLight
        position={[-6, -4, -3]}
        intensity={1.5}
        color="#0284c7"
      />

      {/* Soft warm fill light */}
      <directionalLight
        position={[0, -6, 4]}
        intensity={0.6}
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
            intensity={2.5}
            color="#f0f9ff"
            position={[0, 6, -2]}
            scale={[10, 5, 1]}
            target={[0, 0, 0]}
          />
          {/* Accent cyan rim */}
          <Lightformer
            form="rect"
            intensity={2.0}
            color="#38bdf8"
            position={[-5, 2, -1]}
            scale={[6, 3, 1]}
            target={[0, 0, 0]}
          />
          {/* Sapphire fill */}
          <Lightformer
            form="circle"
            intensity={1.5}
            color="#0284c7"
            position={[5, -2, 2]}
            scale={[5, 5, 1]}
            target={[0, 0, 0]}
          />
          {/* Bottom subtle bounce */}
          <Lightformer
            form="ring"
            intensity={0.8}
            color="#0ea5e9"
            position={[0, -5, 0]}
            scale={[8, 8, 1]}
            target={[0, 0, 0]}
          />
        </group>
      </Environment>
    </>
  );
}
