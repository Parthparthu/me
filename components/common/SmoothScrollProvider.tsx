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
    // Respect reduced motion: native scroll without inertia
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const handleNativeScroll = () => {
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = scrollHeight > 0 ? Math.min(Math.max(window.scrollY / scrollHeight, 0), 1) : 0;
        setProgress(progress);
        setScrollY(window.scrollY);

        for (const [room, [min, max]] of Object.entries(SECTION_THRESHOLDS)) {
          if (progress >= min && progress < max) {
            setActiveRoom(room as 'hero' | 'work' | 'about' | 'skills' | 'journey' | 'contact');
            break;
          }
        }
      };

      window.addEventListener('scroll', handleNativeScroll, { passive: true });
      return () => window.removeEventListener('scroll', handleNativeScroll);
    }

    const lenis = new Lenis({
      duration: 1.25,
      easing: (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
      touchMultiplier: 2.0,
      infinite: false,
      syncTouch: false,
      autoRaf: false,
    });
    lenisRef.current = lenis;
    if (typeof window !== 'undefined') {
      (window as any).__lenis = lenis;
    }

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

    // Rock-solid RAF loop with clamped delta: prevents single-frame teleportation
    // when tabs are blurred, sleeping, throttled, or transitioning
    let lastTime = performance.now();
    let rafId: number | null = null;
    let virtualTime = performance.now();

    const tick = (now: number) => {
      const elapsed = Math.max(0, now - lastTime);
      lastTime = now;
      const clampedDelta = Math.min(elapsed, 33.33);
      virtualTime += clampedDelta;
      lenis.raf(virtualTime);
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    // Register Lenis scroll sync with GSAP ScrollTrigger
    import('gsap').then(({ gsap }) => {
      import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
        gsap.registerPlugin(ScrollTrigger);

        lenis.on('scroll', ScrollTrigger.update);

        ScrollTrigger.scrollerProxy(document.documentElement, {
          scrollTop: () => lenis.scroll,
          getBoundingClientRect: () => ({
            top: 0,
            left: 0,
            width: window.innerWidth,
            height: window.innerHeight,
          }),
        });

        ScrollTrigger.refresh();
      });
    });

    // Handle initial hash in URL (e.g. direct load to /#about)
    let initialHashTimer: NodeJS.Timeout | null = null;
    if (typeof window !== 'undefined' && window.location.hash) {
      const hash = window.location.hash;
      initialHashTimer = setTimeout(() => {
        const target = document.querySelector(hash);
        if (target) {
          lenis.scrollTo(target as HTMLElement, {
            offset: -80,
            duration: 1.25,
            easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          });
        }
      }, 300);
    }

    // Handle browser back/forward button hash changes
    const handlePopState = () => {
      const hash = window.location.hash;
      if (hash) {
        const target = document.querySelector(hash);
        if (target) {
          lenis.scrollTo(target as HTMLElement, {
            offset: -80,
            duration: 1.25,
            easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          });
        }
      } else {
        lenis.scrollTo(0, {
          duration: 1.25,
          easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        });
      }
    };
    window.addEventListener('popstate', handlePopState);

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      if (initialHashTimer) clearTimeout(initialHashTimer);
      window.removeEventListener('popstate', handlePopState);
      if (typeof window !== 'undefined') {
        delete (window as any).__lenis;
      }
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
