/**
 * SceneLighting — Dynamic per-room lighting with smooth crossfade.
 * Each "room" has its own key light color, intensity, and ambient mood.
 * Lighting transitions are driven by scroll progress from useScrollStore.
 */
'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useScrollStore } from '@/store/useScrollStore';
import { useSceneStore } from '@/store/useSceneStore';
import { Environment } from '@react-three/drei';

// Per-room lighting configurations
const ROOM_LIGHTS = [
  // Hero — violet-indigo aurora
  {
    ambient: new THREE.Color('#0a0814'),
    key: new THREE.Color('#6366f1'),
    fill: new THREE.Color('#38bdf8'),
    keyPos: new THREE.Vector3(3, 5, 4),
    keyIntensity: 4,
  },
  // Work — teal-cobalt
  {
    ambient: new THREE.Color('#060c12'),
    key: new THREE.Color('#0ea5e9'),
    fill: new THREE.Color('#818cf8'),
    keyPos: new THREE.Vector3(-3, 3, 3),
    keyIntensity: 3.5,
  },
  // About/Skills — warm amber-indigo
  {
    ambient: new THREE.Color('#0c0a06'),
    key: new THREE.Color('#f59e0b'),
    fill: new THREE.Color('#6366f1'),
    keyPos: new THREE.Vector3(2, 4, 5),
    keyIntensity: 3,
  },
  // Journey — navy purple
  {
    ambient: new THREE.Color('#060814'),
    key: new THREE.Color('#7c3aed'),
    fill: new THREE.Color('#1e40af'),
    keyPos: new THREE.Vector3(-2, 6, 4),
    keyIntensity: 3.5,
  },
  // Contact — midnight blue
  {
    ambient: new THREE.Color('#050810'),
    key: new THREE.Color('#3b82f6'),
    fill: new THREE.Color('#6366f1'),
    keyPos: new THREE.Vector3(0, 5, 5),
    keyIntensity: 4,
  },
];

export function SceneLighting() {
  const progress = useScrollStore((s) => s.progress);
  const quality = useSceneStore((s) => s.quality);

  const ambientRef = useRef<THREE.AmbientLight>(null);
  const keyRef = useRef<THREE.PointLight>(null);
  const fillRef = useRef<THREE.PointLight>(null);

  const currentAmb = useRef(new THREE.Color(ROOM_LIGHTS[0].ambient));
  const currentKey = useRef(new THREE.Color(ROOM_LIGHTS[0].key));
  const currentFill = useRef(new THREE.Color(ROOM_LIGHTS[0].fill));
  const currentKeyPos = useRef(new THREE.Vector3().copy(ROOM_LIGHTS[0].keyPos));

  useFrame(() => {
    // Map progress [0,1] to room index [0, ROOM_LIGHTS.length-1]
    const roomFloat = progress * (ROOM_LIGHTS.length - 1);
    const roomIdx = Math.floor(roomFloat);
    const t = roomFloat - roomIdx;

    const from = ROOM_LIGHTS[Math.min(roomIdx, ROOM_LIGHTS.length - 1)];
    const to = ROOM_LIGHTS[Math.min(roomIdx + 1, ROOM_LIGHTS.length - 1)];

    // Lerp colors
    currentAmb.current.lerpColors(from.ambient, to.ambient, t);
    currentKey.current.lerpColors(from.key, to.key, t);
    currentFill.current.lerpColors(from.fill, to.fill, t);
    currentKeyPos.current.lerpVectors(from.keyPos, to.keyPos, t);

    // Apply to lights
    if (ambientRef.current) {
      ambientRef.current.color.copy(currentAmb.current);
    }
    if (keyRef.current) {
      keyRef.current.color.copy(currentKey.current);
      keyRef.current.position.copy(currentKeyPos.current);
      keyRef.current.intensity = THREE.MathUtils.lerp(
        from.keyIntensity,
        to.keyIntensity,
        t
      );
    }
    if (fillRef.current) {
      fillRef.current.color.copy(currentFill.current);
    }
  });

  return (
    <>
      {/* Ambient light — low intensity, room mood color */}
      <ambientLight ref={ambientRef} intensity={0.4} />

      {/* Key light — main colored light source */}
      <pointLight
        ref={keyRef}
        position={[3, 5, 4]}
        intensity={4}
        distance={40}
        decay={2}
        castShadow={quality === 'high'}
        shadow-mapSize={[1024, 1024]}
      />

      {/* Fill light — secondary color, opposite side */}
      <pointLight
        ref={fillRef}
        position={[-4, -2, 3]}
        intensity={1.5}
        distance={30}
        decay={2}
      />

      {/* Rim light — always white/cold for glass edge definition */}
      <directionalLight
        position={[0, 10, -5]}
        intensity={0.8}
        color="#c0d8ff"
      />

      {/* Environment for reflections on glass */}
      {quality !== 'low' && (
        <Environment preset="city" background={false} />
      )}
    </>
  );
}
