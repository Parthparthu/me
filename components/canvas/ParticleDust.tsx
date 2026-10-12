'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useSceneStore } from '@/store/useSceneStore';

export function ParticleDust() {
  const pointsRef = useRef<THREE.Points>(null);
  const quality = useSceneStore((s) => s.quality);
  const theme = useSceneStore((s) => s.theme);
  const isDark = theme === 'dark';

  const count = quality === 'high' ? 140 : 60;

  const [positions, opacities] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const op = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      // Spread across x [-7, 7], y [5, -38], z [-3, 3]
      pos[i * 3] = (Math.random() - 0.5) * 14;
      pos[i * 3 + 1] = 5 - Math.random() * 44;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 6;
      op[i] = 0.2 + Math.random() * 0.6;
    }

    return [pos, op];
  }, [count]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const t = state.clock.elapsedTime;
    pointsRef.current.rotation.y = t * 0.02;
    pointsRef.current.position.y = Math.sin(t * 0.25) * 0.2;
    pointsRef.current.rotation.x = Math.sin(t * 0.15) * 0.05;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        color={isDark ? '#22D3EE' : '#0369A1'}
        transparent
        opacity={isDark ? 0.45 : 0.32}
        sizeAttenuation
        blending={isDark ? THREE.AdditiveBlending : THREE.NormalBlending}
        depthWrite={false}
      />
    </points>
  );
}
