'use client';

import { useRef, useEffect, useMemo } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useScrollStore } from '@/store/useScrollStore';
import { useSceneStore } from '@/store/useSceneStore';
import { useMouseParallax } from '@/hooks/useMouseParallax';
import { POINTER_REACTIVE_3D } from '@/lib/config';

// Camera position spline across sections
const CAMERA_POINTS = [
  new THREE.Vector3(0, 0, 7.2),        // Hero
  new THREE.Vector3(-1.4, -9, 5.8),    // Work showcase
  new THREE.Vector3(2.2, -18, 6.2),    // Skills constellation
  new THREE.Vector3(-1.0, -26, 5.8),   // Journey
  new THREE.Vector3(0, -34, 6.8),      // Contact
];

// LookAt target spline across sections
const LOOKAT_POINTS = [
  new THREE.Vector3(0, 0, 0),
  new THREE.Vector3(-0.6, -9, 0),
  new THREE.Vector3(1.0, -18, 0),
  new THREE.Vector3(-0.4, -26, 0),
  new THREE.Vector3(0, -34, 0),
];

export function CameraRig() {
  const { camera } = useThree();
  const progress = useScrollStore((s) => s.progress);
  const quality = useSceneStore((s) => s.quality);
  const { nx, ny } = useMouseParallax();

  const positionCurve = useMemo(() => new THREE.CatmullRomCurve3(CAMERA_POINTS), []);
  const lookAtCurve = useMemo(() => new THREE.CatmullRomCurve3(LOOKAT_POINTS), []);

  const targetPos = useRef(new THREE.Vector3(0, 0, 7.2));
  const targetLook = useRef(new THREE.Vector3(0, 0, 0));
  const currentLook = useRef(new THREE.Vector3(0, 0, 0));

  const reducedMotion = useRef(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    reducedMotion.current = mq.matches;
    const handler = (e: MediaQueryListEvent) => {
      reducedMotion.current = e.matches;
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useFrame((_, delta) => {
    const clampedProgress = Math.max(0, Math.min(1, progress || 0));

    if (reducedMotion.current) {
      // In reduced motion, smoothly glide position without rotational shake or mouse parallax
      const pt = positionCurve.getPointAt(clampedProgress);
      const look = lookAtCurve.getPointAt(clampedProgress);
      camera.position.lerp(pt, Math.min(delta * 2, 1));
      camera.lookAt(look);
      return;
    }

    // Scroll-linked trajectory along spline
    const pt = positionCurve.getPointAt(clampedProgress);
    const look = lookAtCurve.getPointAt(clampedProgress);

    // Subtle pointer parallax tilt
    const parallaxStrength = POINTER_REACTIVE_3D ? (quality === 'high' ? 0.35 : 0.18) : 0;
    targetPos.current.set(
      pt.x + nx * parallaxStrength,
      pt.y + ny * parallaxStrength * 0.4,
      pt.z
    );
    targetLook.current.copy(look);

    // Smooth lerping
    const lerpSpeed = Math.min(delta * 3.5, 1);
    camera.position.lerp(targetPos.current, lerpSpeed);

    currentLook.current.lerp(targetLook.current, lerpSpeed);
    camera.lookAt(currentLook.current);
  });

  return null;
}
