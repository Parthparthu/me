'use client';

import { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const PARTICLE_COUNT = 150;

/**
 * InteractiveParticleField: Dynamic 3D particle constellation.
 * Features:
 * - Instanced mesh geometry for 60fps single-draw-call performance
 * - Real-time pointer proximity deflection (particles part around cursor)
 * - Harmonic floating oscillation across depth layers
 * - Tactile impulse expansion on user click or tap
 * - Strict palette: Sky Blue (#38bdf8) and Slate highlights
 */
export function InteractiveParticleField() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const { viewport } = useThree();

  const mouseRef = useRef({
    nx: 0,
    ny: 0,
    currentNx: 0,
    currentNy: 0,
    impulse: 0,
  });

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const onPointerMove = (e: PointerEvent) => {
      mouseRef.current.nx = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.ny = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    const onPointerDown = () => {
      mouseRef.current.impulse = 1.0;
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerdown', onPointerDown, { passive: true });

    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerdown', onPointerDown);
    };
  }, []);

  // Generate initial particle data
  const particles = useMemo(() => {
    const list = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      list.push({
        baseX: (Math.random() - 0.5) * 20,
        baseY: (Math.random() - 0.5) * 14,
        baseZ: (Math.random() - 0.5) * 8 - 1,
        speed: 0.3 + Math.random() * 0.7,
        phase: Math.random() * Math.PI * 2,
        radius: 0.025 + Math.random() * 0.035,
      });
    }
    return list;
  }, []);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    const t = state.clock.elapsedTime;
    const m = mouseRef.current;

    // Smooth pointer damping
    m.currentNx = THREE.MathUtils.damp(m.currentNx, m.nx, 5, delta);
    m.currentNy = THREE.MathUtils.damp(m.currentNy, m.ny, 5, delta);
    m.impulse = THREE.MathUtils.damp(m.impulse, 0, 3, delta);

    // Approximate mouse world coordinate
    const mouseWorldX = m.currentNx * (viewport.width * 0.5);
    const mouseWorldY = m.currentNy * (viewport.height * 0.5);

    const repulsionRadius = 2.8;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const p = particles[i];

      // Harmonic ambient floating
      const ambientX = p.baseX + Math.sin(t * p.speed + p.phase) * 0.25;
      const ambientY = p.baseY + Math.cos(t * p.speed * 0.8 + p.phase) * 0.3;
      const ambientZ = p.baseZ + Math.sin(t * 0.5 + p.phase) * 0.15;

      // Distance to cursor in X/Y plane
      const dx = ambientX - mouseWorldX;
      const dy = ambientY - mouseWorldY;
      const distSq = dx * dx + dy * dy;

      let offsetX = 0;
      let offsetY = 0;
      let offsetZ = 0;

      // Pointer deflection force
      if (distSq < repulsionRadius * repulsionRadius && distSq > 0.001) {
        const dist = Math.sqrt(distSq);
        const force = (1 - dist / repulsionRadius) * 0.9;
        offsetX = (dx / dist) * force;
        offsetY = (dy / dist) * force;
        offsetZ = force * 0.5;
      }

      // Impulse expansion on click
      if (m.impulse > 0.01) {
        const radDist = Math.sqrt(p.baseX * p.baseX + p.baseY * p.baseY) + 0.1;
        offsetX += (p.baseX / radDist) * (m.impulse * 0.6);
        offsetY += (p.baseY / radDist) * (m.impulse * 0.6);
      }

      dummy.position.set(
        ambientX + offsetX,
        ambientY + offsetY,
        ambientZ + offsetZ
      );

      // Subtle scale pulse
      const scaleFactor = 1 + Math.sin(t * 1.5 + p.phase) * 0.2 + m.impulse * 0.4;
      dummy.scale.setScalar(p.radius * scaleFactor);

      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, PARTICLE_COUNT]}
    >
      <sphereGeometry args={[1, 8, 8]} />
      <meshBasicMaterial
        color="#38bdf8"
        transparent
        opacity={0.35}
        depthWrite={false}
      />
    </instancedMesh>
  );
}
