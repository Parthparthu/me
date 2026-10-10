'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox, Float, MeshTransmissionMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { useSceneStore } from '@/store/useSceneStore';
import { useMouseParallax } from '@/hooks/useMouseParallax';
import { POINTER_REACTIVE_3D } from '@/lib/config';

export function ContactRoom() {
  const quality = useSceneStore((s) => s.quality);
  const glowRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const { nx, ny } = useMouseParallax();

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    if (glowRef.current) {
      const mat = glowRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.08 + Math.sin(t * 1.5) * 0.03;
    }

    if (groupRef.current && POINTER_REACTIVE_3D) {
      const targetRX = -ny * 0.12;
      const targetRY = nx * 0.18;
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
            <MeshTransmissionMaterial
              samples={quality === 'high' ? 10 : 3}
              resolution={quality === 'high' ? 256 : 128}
              thickness={0.16}
              roughness={0.04}
              ior={1.48}
              chromaticAberration={quality === 'high' ? 0.04 : 0}
              color="#f0f9ff"
              attenuationColor="#0284c7"
              attenuationDistance={0.5}
              transparent
              opacity={0.9}
            />
          </RoundedBox>

          {/* Internal Glowing Core Rim */}
          <mesh ref={glowRef} position={[0, 0, 0.09]}>
            <planeGeometry args={[3.4, 2.0]} />
            <meshBasicMaterial color="#0ea5e9" transparent opacity={0.08} />
          </mesh>
        </group>
      </Float>

      {/* Ambient Satellites in Emerald & Sky (no purple) */}
      {[
        { pos: [-2.2, 0.6, 0.6], scale: 0.16, color: '#10b981' },
        { pos: [2.4, -0.4, 0.4], scale: 0.12, color: '#38bdf8' },
        { pos: [0.6, 1.3, 0.5], scale: 0.1, color: '#0ea5e9' },
      ].map((orb, i) => (
        <Float key={i} speed={1.2 + i * 0.2} rotationIntensity={0.1} floatIntensity={0.25}>
          <mesh position={orb.pos as [number, number, number]} scale={orb.scale}>
            <sphereGeometry args={[1, 16, 16]} />
            <meshStandardMaterial
              color={orb.color}
              emissive={orb.color}
              emissiveIntensity={0.8}
              roughness={0.2}
              metalness={0.5}
            />
          </mesh>
        </Float>
      ))}

      {/* Soft background plane */}
      <mesh position={[0, 0, -3.5]}>
        <planeGeometry args={[14, 10]} />
        <meshBasicMaterial color="#031526" transparent opacity={0.35} />
      </mesh>
    </group>
  );
}
