/**
 * ParticleDust — Subtle bokeh particle cloud for depth/atmosphere.
 * Only rendered in 'high' quality tier.
 * Uses instanced rendering for 200 particles at zero GC cost.
 */
'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const PARTICLE_COUNT = 200;

export function ParticleDust() {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  const { positions, phases } = useMemo(() => {
    const positions: THREE.Vector3[] = [];
    const phases: number[] = [];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      positions.push(
        new THREE.Vector3(
          (Math.random() - 0.5) * 20,
          -Math.random() * 40,        // spread across all scene depth
          (Math.random() - 0.5) * 8
        )
      );
      phases.push(Math.random() * Math.PI * 2);
    }

    return { positions, phases };
  }, []);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;

    positions.forEach((pos, i) => {
      const phase = phases[i];
      dummy.position.set(
        pos.x + Math.sin(t * 0.2 + phase) * 0.2,
        pos.y + Math.sin(t * 0.15 + phase * 1.3) * 0.3,
        pos.z
      );
      const s = 0.015 + Math.sin(phase) * 0.01;
      dummy.scale.setScalar(s);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, PARTICLE_COUNT]}
    >
      <sphereGeometry args={[1, 6, 6]} />
      <meshBasicMaterial
        color="#818cf8"
        transparent
        opacity={0.25}
        depthWrite={false}
      />
    </instancedMesh>
  );
}
