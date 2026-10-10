'use client';

import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useScrollStore } from '@/store/useScrollStore';

/**
 * HeroGlassCore: Interactive 3D liquid-glass geometric prism.
 * Features:
 * - Faceted crystal geometry with high-refraction transmission
 * - Inner pulsating quantum core
 * - Dual gyroscopic orbital rings with dynamic angular velocity
 * - Spring-damped pointer tracking and tilt
 * - Click and tap impulse physics: spins faster and pulses on click
 * - Non-intrusive scroll progression: smoothly moves with page depth
 */
export function HeroGlassCore() {
  const groupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const outerRingRef = useRef<THREE.Mesh>(null);
  const innerRingRef = useRef<THREE.Mesh>(null);
  const satelliteRef = useRef<THREE.Mesh>(null);
  const coreLightRef = useRef<THREE.PointLight>(null);

  const { viewport } = useThree();

  // Responsive scale factor based on viewport width
  const responsiveScale = Math.min(Math.max(viewport.width / 11, 0.75), 1.25);

  // Interaction tracking state
  const interaction = useRef({
    targetX: 0,
    targetY: 0,
    currentX: 0,
    currentY: 0,
    impulse: 0,
    spinVelocity: 0,
  });

  useEffect(() => {
    // Respect reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const handlePointerMove = (e: PointerEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = -(e.clientY / window.innerHeight) * 2 + 1;
      interaction.current.targetX = nx;
      interaction.current.targetY = ny;
    };

    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      // Check if clicking interactive DOM elements to preserve their UX
      const target = e.target as HTMLElement | null;
      const isInteractive = target?.closest('button, a, input, textarea, select, [role="button"]');
      
      // Give a tactile kinetic impulse on click
      interaction.current.impulse = isInteractive ? 0.4 : 1.0;
      interaction.current.spinVelocity += 0.8;
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerdown', handlePointerDown, { passive: true });

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerdown', handlePointerDown);
    };
  }, []);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    const t = state.clock.elapsedTime;
    const inter = interaction.current;

    // Smooth pointer damping
    inter.currentX = THREE.MathUtils.damp(inter.currentX, inter.targetX, 4.5, delta);
    inter.currentY = THREE.MathUtils.damp(inter.currentY, inter.targetY, 4.5, delta);

    // Decay impulse and extra spin
    inter.impulse = THREE.MathUtils.damp(inter.impulse, 0, 3, delta);
    inter.spinVelocity = THREE.MathUtils.damp(inter.spinVelocity, 0, 2.5, delta);

    // Retrieve scroll progress from Lenis store (0 at hero, up to 1 at footer)
    const scrollProgress = useScrollStore.getState().progress || 0;

    // Harmonic floating motion
    const floatY = Math.sin(t * 1.1) * 0.15;
    const floatRotZ = Math.cos(t * 0.8) * 0.05;

    // Continuous ambient rotation plus pointer response
    const ambientRotY = t * 0.25 + inter.spinVelocity * 1.5;
    const targetTiltX = -inter.currentY * 0.45;
    const targetTiltY = inter.currentX * 0.55 + ambientRotY;

    // Apply rotations with smooth damping
    groupRef.current.rotation.x = THREE.MathUtils.damp(
      groupRef.current.rotation.x,
      targetTiltX,
      4,
      delta
    );
    groupRef.current.rotation.y = THREE.MathUtils.damp(
      groupRef.current.rotation.y,
      targetTiltY,
      3.5,
      delta
    );
    groupRef.current.rotation.z = floatRotZ + scrollProgress * 0.6;

    // Natural multi-section scroll integration:
    // Glides gently as user scrolls so it never obstructs project cards
    const scrollOffsetY = -scrollProgress * 4.5;
    const scrollOffsetZ = -scrollProgress * 5.0;
    const scrollOffsetX = Math.sin(scrollProgress * Math.PI) * 1.2;

    groupRef.current.position.x = scrollOffsetX;
    groupRef.current.position.y = floatY + scrollOffsetY;
    groupRef.current.position.z = scrollOffsetZ;

    // Dynamic scale response (slight compression/expansion on impulse)
    const impulseScale = 1 + inter.impulse * 0.12;
    groupRef.current.scale.setScalar(responsiveScale * impulseScale);

    // Inner core breathing and pulsing animation
    if (coreRef.current) {
      const corePulse = 1 + Math.sin(t * 2.2) * 0.08 + inter.impulse * 0.35;
      coreRef.current.scale.setScalar(corePulse);
      coreRef.current.rotation.y = -t * 0.7;
      coreRef.current.rotation.x = t * 0.4;
    }

    // Dynamic core point light intensity
    if (coreLightRef.current) {
      coreLightRef.current.intensity = 1.2 + Math.sin(t * 2.2) * 0.4 + inter.impulse * 2.5;
    }

    // Gyroscopic orbital rings animation
    if (outerRingRef.current) {
      outerRingRef.current.rotation.x = t * 0.45 + inter.currentY * 0.3;
      outerRingRef.current.rotation.y = t * 0.35 + inter.currentX * 0.3;
      outerRingRef.current.rotation.z = t * 0.2;
    }

    if (innerRingRef.current) {
      innerRingRef.current.rotation.x = -t * 0.55;
      innerRingRef.current.rotation.y = t * 0.4;
      innerRingRef.current.rotation.z = -t * 0.3;
    }

    // Orbiting crystal satellite
    if (satelliteRef.current) {
      const satSpeed = t * 0.8 + inter.spinVelocity;
      satelliteRef.current.position.x = Math.cos(satSpeed) * 2.4;
      satelliteRef.current.position.y = Math.sin(satSpeed * 0.8) * 0.9;
      satelliteRef.current.position.z = Math.sin(satSpeed) * 2.4;
      satelliteRef.current.rotation.x = t * 1.5;
      satelliteRef.current.rotation.y = t * 1.2;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* ── Main Faceted Liquid-Glass Prism ─────────────────────────── */}
      <mesh castShadow receiveShadow>
        <icosahedronGeometry args={[1.5, 0]} />
        <meshPhysicalMaterial
          roughness={0.06}
          transmission={0.92}
          thickness={1.35}
          ior={1.52}
          reflectivity={0.85}
          clearcoat={1.0}
          clearcoatRoughness={0.08}
          color="#f0f9ff"
          attenuationColor="#0284c7"
          attenuationDistance={0.85}
          transparent
          opacity={0.95}
        />
      </mesh>

      {/* ── Holographic Geometric Edge Lattice ──────────────────────── */}
      <mesh>
        <icosahedronGeometry args={[1.52, 0]} />
        <meshBasicMaterial
          wireframe
          color="#38bdf8"
          transparent
          opacity={0.22}
        />
      </mesh>

      {/* ── Inner Pulsating Quantum Core ────────────────────────────── */}
      <mesh ref={coreRef}>
        <octahedronGeometry args={[0.62, 0]} />
        <meshStandardMaterial
          color="#0284c7"
          emissive="#0ea5e9"
          emissiveIntensity={1.0}
          roughness={0.15}
          metalness={0.8}
        />
      </mesh>

      {/* Internal Core Radiant Light */}
      <pointLight
        ref={coreLightRef}
        color="#38bdf8"
        intensity={1.5}
        distance={6}
        decay={2}
      />

      {/* ── Gyroscopic Outer Orbital Ring ───────────────────────────── */}
      <mesh ref={outerRingRef}>
        <torusGeometry args={[2.25, 0.02, 16, 96]} />
        <meshStandardMaterial
          color="#7dd3fc"
          emissive="#0284c7"
          emissiveIntensity={0.5}
          roughness={0.1}
          metalness={0.9}
        />
      </mesh>

      {/* ── Gyroscopic Inner Orbital Ring ───────────────────────────── */}
      <mesh ref={innerRingRef} rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[2.55, 0.016, 16, 96]} />
        <meshStandardMaterial
          color="#38bdf8"
          emissive="#0369a1"
          emissiveIntensity={0.4}
          roughness={0.12}
          metalness={0.9}
        />
      </mesh>

      {/* ── Orbiting Satellite Crystal ──────────────────────────────── */}
      <mesh ref={satelliteRef}>
        <octahedronGeometry args={[0.16, 0]} />
        <meshPhysicalMaterial
          roughness={0.05}
          transmission={0.9}
          thickness={0.8}
          ior={1.48}
          color="#e0f2fe"
          attenuationColor="#0284c7"
          attenuationDistance={0.5}
          transparent
          opacity={0.9}
        />
      </mesh>
    </group>
  );
}
