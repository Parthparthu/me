'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox, Float } from '@react-three/drei';
import * as THREE from 'three';
import { useSceneStore } from '@/store/useSceneStore';
import { useMouseParallax } from '@/hooks/useMouseParallax';
import { POINTER_REACTIVE_3D } from '@/lib/config';

import { useScrollStore } from '@/store/useScrollStore';

export function ContactRoom() {
  const quality = useSceneStore((s) => s.quality);
  const theme = useSceneStore((s) => s.theme);
  const isDark = theme === 'dark';

  const glowRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const pointer = useMouseParallax();

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const progress = useScrollStore.getState().progress;
    const isVisible = progress >= 0.58;
    groupRef.current.visible = isVisible;
    if (!isVisible) return;

    const t = state.clock.elapsedTime;
    if (glowRef.current) {
      const mat = glowRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = (isDark ? 0.08 : 0.12) + Math.sin(t * 1.5) * 0.03;
    }

    if (groupRef.current && POINTER_REACTIVE_3D) {
      const targetRX = -pointer.ny * 0.12;
      const targetRY = pointer.nx * 0.18;
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        targetRX,
        Math.min(delta * 3, 1)
      );
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        targetRY,
        Math.min(delta * 3, 1)
      );
    }
  });

  return (
    <group position={[0, -34, 0]}>
      <Float speed={0.8} rotationIntensity={0.06} floatIntensity={0.12}>
        <group ref={groupRef}>
          {/* Main Glass Monolith */}
          <RoundedBox args={[3.6, 2.2, 0.16]} radius={0.12} smoothness={6}>
            <meshPhysicalMaterial
              roughness={isDark ? 0.05 : 0.03}
              metalness={0.15}
              clearcoat={1.0}
              clearcoatRoughness={0.05}
              color={isDark ? '#0E1626' : '#FFFFFF'}
              emissive={isDark ? '#22D3EE' : '#0369A1'}
              emissiveIntensity={isDark ? 0.2 : 0.1}
              transparent
              opacity={isDark ? 0.88 : 0.92}
            />
          </RoundedBox>

          {/* Internal Glowing Core Rim */}
          <mesh ref={glowRef} position={[0, 0, 0.09]}>
            <planeGeometry args={[3.4, 2.0]} />
            <meshBasicMaterial color={isDark ? '#22D3EE' : '#0369A1'} transparent opacity={isDark ? 0.08 : 0.12} />
          </mesh>
        </group>
      </Float>

      {/* Ambient Satellites in Emerald & Cyan (strictly non-purple) */}
      {[
        { pos: [-2.2, 0.6, 0.6], scale: 0.16, color: '#10b981' },
        { pos: [2.4, -0.4, 0.4], scale: 0.12, color: '#67E8F9' },
        { pos: [0.6, 1.3, 0.5], scale: 0.1, color: '#22D3EE' },
      ].map((orb, i) => (
        <Float key={i} speed={1.2 + i * 0.2} rotationIntensity={0.1} floatIntensity={0.25}>
          <mesh position={orb.pos as [number, number, number]} scale={orb.scale}>
            <sphereGeometry args={[1, 16, 16]} />
            <meshStandardMaterial
              color={orb.color}
              emissive={orb.color}
              emissiveIntensity={isDark ? 0.8 : 0.6}
              roughness={0.2}
              metalness={0.5}
            />
          </mesh>
        </Float>
      ))}

      {/* Soft background plane: luminous sky in light mode, deep dark in dark */}
      <mesh position={[0, 0, -3.5]}>
        <planeGeometry args={[14, 10]} />
        <meshBasicMaterial
          color={isDark ? '#060B18' : '#F6F8FB'}
          transparent
          opacity={isDark ? 0.35 : 0.45}
        />
      </mesh>
    </group>
  );
}
