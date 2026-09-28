/**
 * ContactRoom — Glass form pedestal at the end of the camera journey.
 * A tall glass slab/pedestal with glowing rim and ambient particles.
 */
'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox, Float } from '@react-three/drei';
import { MeshTransmissionMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { useSceneStore } from '@/store/useSceneStore';

export function ContactRoom() {
  const quality = useSceneStore((s) => s.quality);
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!glowRef.current) return;
    const t = state.clock.elapsedTime;
    const mat = glowRef.current.material as THREE.MeshBasicMaterial;
    mat.opacity = 0.08 + Math.sin(t * 0.6) * 0.04;
  });

  return (
    <group position={[0, -32, 0]}>
      {/* Main glass pedestal */}
      <Float speed={0.6} rotationIntensity={0.05} floatIntensity={0.1}>
        <RoundedBox args={[3.5, 2.2, 0.12]} radius={0.1} smoothness={6}>
          <MeshTransmissionMaterial
            samples={quality === 'high' ? 12 : 4}
            resolution={quality === 'high' ? 256 : 128}
            thickness={0.12}
            roughness={0.04}
            ior={1.45}
            chromaticAberration={quality === 'high' ? 0.05 : 0}
            color="#3b82f6"
            attenuationColor="#1e40af"
            attenuationDistance={0.3}
            envMapIntensity={1.5}
          />
        </RoundedBox>

        {/* Glowing rim */}
        <mesh ref={glowRef} position={[0, 0, 0.07]}>
          <planeGeometry args={[3.3, 2.0]} />
          <meshBasicMaterial color="#6366f1" transparent opacity={0.1} />
        </mesh>
      </Float>

      {/* Ambient scatter orbs */}
      {[
        { pos: [-2, 0.5, 0.5], scale: 0.15, color: '#6366f1' },
        { pos: [2.2, -0.3, 0.3], scale: 0.1, color: '#38bdf8' },
        { pos: [0.5, 1.2, 0.4], scale: 0.08, color: '#818cf8' },
      ].map((orb, i) => (
        <Float key={i} speed={1 + i * 0.2} rotationIntensity={0.1} floatIntensity={0.2}>
          <mesh position={orb.pos as [number, number, number]} scale={orb.scale}>
            <sphereGeometry args={[1, 16, 16]} />
            <meshStandardMaterial
              color={orb.color}
              emissive={orb.color}
              emissiveIntensity={0.6}
              transparent
              opacity={0.8}
            />
          </mesh>
        </Float>
      ))}

      {/* Background */}
      <mesh position={[0, 0, -3]}>
        <planeGeometry args={[14, 10]} />
        <meshBasicMaterial color="#050815" transparent opacity={0.4} />
      </mesh>
    </group>
  );
}
