/**
 * useGyroscope — Device orientation (tilt) for mobile glass light response.
 * Permission-gated on iOS 13+. Returns normalized tilt values in [-1, 1].
 * Falls back to { x: 0, y: 0 } when unavailable or not permitted.
 */
'use client';

import { useEffect, useRef, useState } from 'react';

interface GyroValues {
  x: number; // -1 to 1 (gamma / horizontal tilt)
  y: number; // -1 to 1 (beta / vertical tilt)
  supported: boolean;
  permitted: boolean;
}

const DEFAULT: GyroValues = {
  x: 0,
  y: 0,
  supported: false,
  permitted: false,
};

export function useGyroscope(): {
  values: GyroValues;
  requestPermission: () => Promise<void>;
} {
  const [values, setValues] = useState<GyroValues>(DEFAULT);
  const listenersRef = useRef(false);

  const startListening = () => {
    if (listenersRef.current) return;
    listenersRef.current = true;

    window.addEventListener(
      'deviceorientation',
      (e: DeviceOrientationEvent) => {
        const gamma = e.gamma ?? 0; // left-right tilt: -90 to 90
        const beta = e.beta ?? 0;   // front-back tilt: -180 to 180
        setValues({
          x: Math.max(-1, Math.min(1, gamma / 45)),
          y: Math.max(-1, Math.min(1, beta / 90)),
          supported: true,
          permitted: true,
        });
      },
      { passive: true }
    );
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check support
    if (!('DeviceOrientationEvent' in window)) return;

    setValues((prev) => ({ ...prev, supported: true }));

    // iOS 13+ requires explicit permission
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      // Don't auto-request — user must call requestPermission()
      return;
    }

    // Non-iOS: start directly
    startListening();
    setValues((prev) => ({ ...prev, permitted: true }));
  }, []);

  const requestPermission = async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const DOE = DeviceOrientationEvent as any;
    if (typeof DOE.requestPermission === 'function') {
      const result = await DOE.requestPermission();
      if (result === 'granted') {
        startListening();
        setValues((prev) => ({ ...prev, permitted: true }));
      }
    } else {
      startListening();
    }
  };

  return { values, requestPermission };
}
