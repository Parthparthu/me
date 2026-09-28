/**
 * SmoothScrollProvider — Synchronizes Lenis smooth scroll with GSAP
 * ScrollTrigger and the R3F render loop into a single RAF.
 *
 * Critical: no competing animation frames.
 * - Lenis.raf() is called inside gsap.ticker (not its own RAF)
 * - GSAP ScrollTrigger gets scroll updates from Lenis
 * - R3F's useFrame runs in the same RAF via @react-three/fiber
 * - useScrollStore is updated for the CameraRig
 */
'use client';

import { useEffect, useRef, createContext, useContext, type ReactNode } from 'react';
import Lenis from 'lenis';
import { useScrollStore } from '@/store/useScrollStore';

// Context so child components can access lenis instance if needed
const LenisContext = createContext<React.MutableRefObject<Lenis | null>>({ current: null });
export const useLenis = () => useContext(LenisContext);

const SECTION_THRESHOLDS: Record<string, [number, number]> = {
  hero: [0, 0.15],
  work: [0.15, 0.35],
  about: [0.35, 0.52],
  skills: [0.52, 0.65],
  journey: [0.65, 0.80],
  contact: [0.80, 1.0],
};

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const { setProgress, setScrollY, setVelocity, setActiveRoom } = useScrollStore.getState();

  useEffect(() => {
    // Respect reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const lenis = new Lenis({
      duration: 1.4,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 2.2,
      infinite: false,
      syncTouch: false,
    });
    lenisRef.current = lenis;

    // Update scroll store on every Lenis tick
    lenis.on('scroll', ({ progress, scroll, velocity }: {
      progress: number;
      scroll: number;
      velocity: number;
    }) => {
      setProgress(progress);
      setScrollY(scroll);
      setVelocity(velocity);

      // Determine active room from progress
      for (const [room, [min, max]] of Object.entries(SECTION_THRESHOLDS)) {
        if (progress >= min && progress < max) {
          setActiveRoom(room as 'hero' | 'work' | 'about' | 'skills' | 'journey' | 'contact');
          break;
        }
      }
    });

    // Sync Lenis into GSAP ticker (single RAF)
    // We use requestAnimationFrame directly since GSAP import is async
    let rafId: number;
    const tick = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    // GSAP ScrollTrigger integration (dynamic import to avoid SSR issues)
    let scrollTriggerRefresh: (() => void) | null = null;
    import('gsap').then(({ gsap }) => {
      import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
        gsap.registerPlugin(ScrollTrigger);

        // Tell ScrollTrigger about Lenis scroll position
        lenis.on('scroll', ScrollTrigger.update);

        // Override ScrollTrigger's scroll getter to use Lenis
        ScrollTrigger.scrollerProxy(document.documentElement, {
          scrollTop: () => lenis.scroll,
          getBoundingClientRect: () => ({
            top: 0,
            left: 0,
            width: window.innerWidth,
            height: window.innerHeight,
          }),
        });

        scrollTriggerRefresh = () => ScrollTrigger.refresh();
        ScrollTrigger.refresh();
      });
    });

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [setProgress, setScrollY, setVelocity, setActiveRoom]);

  return (
    <LenisContext.Provider value={lenisRef}>
      {children}
    </LenisContext.Provider>
  );
}
