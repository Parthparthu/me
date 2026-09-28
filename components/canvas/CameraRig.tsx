/**
 * CameraRig — Scroll-driven camera journey along a CatmullRom spline.
 * Uses GSAP ScrollTrigger (synced via SmoothScrollProvider) to drive
 * camera position and lookAt target through 5 "rooms" as user scrolls.
 *
 * Reduced-motion: camera stays at hero position, no journey.
 */
'use client';

import { useRef, useEffect, useMemo } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useScrollStore } from '@/store/useScrollStore';
import { useSceneStore } from '@/store/useSceneStore';
import { useMouseParallax } from '@/hooks/useMouseParallax';

// Camera positions for each room along the spline
// Y increases going down the page (each room is lower in world space)
const CAMERA_SPLINE_POINTS = [
  new THREE.Vector3(0, 0, 7),      // Hero
  new THREE.Vector3(-2, -8, 5.5),  // Work
  new THREE.Vector3(3, -16, 6),    // About/Skills
  new THREE.Vector3(-1.5, -24, 5), // Journey
  new THREE.Vector3(0, -32, 6.5),  // Contact
];

const LOOKAT_SPLINE_POINTS = [
  new THREE.Vector3(0, 0, 0),       // Hero — look at center
  new THREE.Vector3(-2, -10, 0),    // Work
  new THREE.Vector3(2, -18, 0),     // Skills
  new THREE.Vector3(-1, -26, 0),    // Journey
  new THREE.Vector3(0, -32, 0),     // Contact
];

export function CameraRig() {
  const { camera } = useThree();
  const progress = useScrollStore((s) => s.progress);
  const quality = useSceneStore((s) => s.quality);
  const { nx, ny } = useMouseParallax();

  const positionCurve = useMemo(
    () => new THREE.CatmullRomCurve3(CAMERA_SPLINE_POINTS),
    []
  );
  const lookAtCurve = useMemo(
    () => new THREE.CatmullRomCurve3(LOOKAT_SPLINE_POINTS),
    []
  );

  // Target refs for smooth lerp
  const targetPos = useRef(new THREE.Vector3(0, 0, 7));
  const targetLook = useRef(new THREE.Vector3(0, 0, 0));

  // Check reduced motion
  const reducedMotion = useRef(false);
  useEffect(() => {
    reducedMotion.current = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
  }, []);

  useFrame((_, delta) => {
    if (reducedMotion.current) {
      // Static camera at hero position
      camera.position.set(0, 0, 7);
      camera.lookAt(0, 0, 0);
      return;
    }

    // Update target from scroll progress
    const pt = positionCurve.getPointAt(Math.max(0, Math.min(1, progress)));
    const look = lookAtCurve.getPointAt(Math.max(0, Math.min(1, progress)));

    // Add subtle mouse parallax tilt to camera position
    const parallaxStrength = quality === 'high' ? 0.3 : 0.15;
    targetPos.current.set(
      pt.x + nx * parallaxStrength,
      pt.y + ny * parallaxStrength * 0.5,
      pt.z
    );
    targetLook.current.copy(look);

    // Smooth lerp — speed scales with delta for frame-rate independence
    const lerpSpeed = Math.min(delta * 4, 1);
    camera.position.lerp(targetPos.current, lerpSpeed);

    // Smooth lookAt
    const currentLook = new THREE.Vector3();
    camera.getWorldDirection(currentLook);
    const desiredDir = targetLook.current
      .clone()
      .sub(camera.position)
      .normalize();
    currentLook.lerp(desiredDir, lerpSpeed * 0.8);
    camera.lookAt(camera.position.clone().add(currentLook));
  });

  return null;
}
