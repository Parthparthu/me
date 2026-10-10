'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useSceneStore } from '@/store/useSceneStore';

export function ParticleDust() {
  const pointsRef = useRef<THREE.Points>(null);
  const quality = useSceneStore((s) => s.quality);

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

  useFrame((state, delta) => {
    if (!pointsRef.current) return;
    const t = state.clock.elapsedTime;
    const geom = pointsRef.current.geometry;
    const posAttr = geom.getAttribute('position') as THREE.BufferAttribute;
    const arr = posAttr.array as Float32Array;

    for (let i = 0; i < count; i++) {
      // Gentle vertical and horizontal drift
      arr[i * 3 + 1] += Math.sin(t * 0.4 + i) * 0.003;
      arr[i * 3] += Math.cos(t * 0.3 + i) * 0.002;
    }
    posAttr.needsUpdate = true;
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
        color="#38bdf8"
        transparent
        opacity={0.45}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}
