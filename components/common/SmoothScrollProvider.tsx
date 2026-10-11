'use client';

import { useEffect, useRef, createContext, useContext, type ReactNode } from 'react';
import Lenis from 'lenis';
import { useScrollStore, type RoomId } from '@/store/useScrollStore';

// Context so child components can access lenis instance if needed
const LenisContext = createContext<React.MutableRefObject<Lenis | null>>({ current: null });
export const useLenis = () => useContext(LenisContext);

const SECTION_ELEMENTS: { id: string; room: RoomId }[] = [
  { id: 'hero', room: 'hero' },
  { id: 'selected-work', room: 'work' },
  { id: 'about', room: 'about' },
  { id: 'skills', room: 'about' },
  { id: 'journey', room: 'journey' },
  { id: 'achievements', room: 'journey' },
  { id: 'now', room: 'journey' },
  { id: 'github', room: 'journey' },
  { id: 'contact', room: 'contact' },
];

function updateActiveRoom() {
  if (typeof window === 'undefined') return;
  const store = useScrollStore.getState();
  if (Date.now() < store.navLockUntil) return;

  const y = window.scrollY;

  // 1. Top of page: always hero
  if (y < 80) {
    if (store.activeRoom !== 'hero') store.setActiveRoom('hero');
    return;
  }

  // 2. Bottom of page: always contact
  const scrollHeight = document.documentElement.scrollHeight;
  const clientHeight = window.innerHeight;
  if (y + clientHeight >= scrollHeight - 60) {
    if (store.activeRoom !== 'contact') store.setActiveRoom('contact');
    return;
  }

  // 3. Scan sections from bottom to top using viewport checkpoint
  const checkpoint = Math.min(Math.max(window.innerHeight * 0.3, 140), 260);

  for (let i = SECTION_ELEMENTS.length - 1; i >= 0; i--) {
    const { id, room } = SECTION_ELEMENTS[i];
    const el = document.getElementById(id) || (id === 'selected-work' ? document.getElementById('work') : null);
    if (!el) continue;

    const rect = el.getBoundingClientRect();
    if (rect.top <= checkpoint) {
      if (store.activeRoom !== room) {
        store.setActiveRoom(room);
      }
      return;
    }
  }

  if (store.activeRoom !== 'hero') {
    store.setActiveRoom('hero');
  }
}

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const { setProgress, setScrollY, setVelocity } = useScrollStore.getState();

  useEffect(() => {
    // User interaction immediately unlocks programmatic nav lock
    const handleUserInteraction = () => {
      if (useScrollStore.getState().navLockUntil > 0) {
        useScrollStore.getState().unlockActiveRoom();
      }
    };
    window.addEventListener('wheel', handleUserInteraction, { passive: true });
    window.addEventListener('touchstart', handleUserInteraction, { passive: true });
    window.addEventListener('resize', updateActiveRoom, { passive: true });

    // Initial check on mount
    const initialTimer = setTimeout(updateActiveRoom, 100);

    // Respect reduced motion: native scroll without inertia
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const handleNativeScroll = () => {
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = scrollHeight > 0 ? Math.min(Math.max(window.scrollY / scrollHeight, 0), 1) : 0;
        setProgress(progress);
        setScrollY(window.scrollY);
        updateActiveRoom();
      };

      window.addEventListener('scroll', handleNativeScroll, { passive: true });
      return () => {
        clearTimeout(initialTimer);
        window.removeEventListener('wheel', handleUserInteraction);
        window.removeEventListener('touchstart', handleUserInteraction);
        window.removeEventListener('resize', updateActiveRoom);
        window.removeEventListener('scroll', handleNativeScroll);
      };
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
      updateActiveRoom();
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
      const cleanHash = hash.replace(/^[#/]+/, '').toLowerCase();
      let targetRoom: RoomId | null = null;
      if (cleanHash === 'selected-work' || cleanHash === 'work') targetRoom = 'work';
      else if (cleanHash === 'about') targetRoom = 'about';
      else if (cleanHash === 'journey') targetRoom = 'journey';
      else if (cleanHash === 'contact') targetRoom = 'contact';
      else if (cleanHash === 'hero') targetRoom = 'hero';

      if (targetRoom) {
        useScrollStore.getState().lockActiveRoom(targetRoom, 3000);
      }

      initialHashTimer = setTimeout(() => {
        const target =
          document.querySelector(hash) ||
          (cleanHash === 'work' ? document.getElementById('selected-work') : null);
        if (target) {
          lenis.scrollTo(target as HTMLElement, {
            offset: -80,
            duration: 1.25,
            easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            onComplete: () => useScrollStore.getState().unlockActiveRoom(),
          });
        }
      }, 300);
    }

    // Handle browser back/forward button hash changes
    const handlePopState = () => {
      const hash = window.location.hash;
      if (hash) {
        const cleanHash = hash.replace(/^[#/]+/, '').toLowerCase();
        let targetRoom: RoomId | null = null;
        if (cleanHash === 'selected-work' || cleanHash === 'work') targetRoom = 'work';
        else if (cleanHash === 'about') targetRoom = 'about';
        else if (cleanHash === 'journey') targetRoom = 'journey';
        else if (cleanHash === 'contact') targetRoom = 'contact';
        else if (cleanHash === 'hero') targetRoom = 'hero';

        if (targetRoom) {
          useScrollStore.getState().lockActiveRoom(targetRoom, 3000);
        }

        const target =
          document.querySelector(hash) ||
          (cleanHash === 'work' ? document.getElementById('selected-work') : null);
        if (target) {
          lenis.scrollTo(target as HTMLElement, {
            offset: -80,
            duration: 1.25,
            easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            onComplete: () => useScrollStore.getState().unlockActiveRoom(),
          });
        }
      } else {
        useScrollStore.getState().lockActiveRoom('hero', 3000);
        lenis.scrollTo(0, {
          duration: 1.25,
          easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          onComplete: () => useScrollStore.getState().unlockActiveRoom(),
        });
      }
    };
    window.addEventListener('popstate', handlePopState);

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      if (initialHashTimer) clearTimeout(initialHashTimer);
      clearTimeout(initialTimer);
      window.removeEventListener('wheel', handleUserInteraction);
      window.removeEventListener('touchstart', handleUserInteraction);
      window.removeEventListener('resize', updateActiveRoom);
      window.removeEventListener('popstate', handlePopState);
      if (typeof window !== 'undefined') {
        delete (window as any).__lenis;
      }
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [setProgress, setScrollY, setVelocity]);

  return (
    <LenisContext.Provider value={lenisRef}>
      {children}
    </LenisContext.Provider>
  );
}
