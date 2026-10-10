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
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 2.0,
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

    let tickerFunction: ((time: number) => void) | null = null;
    let fallbackRafId: number | null = null;

    // Single unified animation loop via GSAP ticker
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

        // Cancel initial fallback RAF once GSAP is ready
        if (fallbackRafId !== null) {
          cancelAnimationFrame(fallbackRafId);
          fallbackRafId = null;
        }

        // Single shared loop driven by gsap.ticker
        tickerFunction = (time: number) => {
          lenis.raf(time * 1000);
        };
        gsap.ticker.add(tickerFunction);
        gsap.ticker.lagSmoothing(0);

        ScrollTrigger.refresh();
      });
    });

    // Temporary fallback loop until GSAP loads
    const initialTick = (time: number) => {
      if (!tickerFunction) {
        lenis.raf(time);
        fallbackRafId = requestAnimationFrame(initialTick);
      }
    };
    fallbackRafId = requestAnimationFrame(initialTick);

    return () => {
      if (fallbackRafId !== null) {
        cancelAnimationFrame(fallbackRafId);
      }
      if (tickerFunction) {
        import('gsap').then(({ gsap }) => {
          if (tickerFunction) gsap.ticker.remove(tickerFunction);
        });
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
