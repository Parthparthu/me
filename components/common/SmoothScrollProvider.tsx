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

let cachedSectionOffsets: { top: number; room: RoomId }[] = [];

function recalculateSectionOffsets() {
  if (typeof window === 'undefined') return;
  const list: { top: number; room: RoomId }[] = [];
  for (let i = 0; i < SECTION_ELEMENTS.length; i++) {
    const { id, room } = SECTION_ELEMENTS[i];
    const el = document.getElementById(id) || (id === 'selected-work' ? document.getElementById('work') : null);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY;
      list.push({ top, room });
    }
  }
  cachedSectionOffsets = list;
}

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

  // If offsets have not been cached yet, calculate them
  if (cachedSectionOffsets.length === 0) {
    recalculateSectionOffsets();
  }

  // 3. Scan sections from bottom to top using viewport checkpoint
  const checkpoint = Math.min(Math.max(clientHeight * 0.3, 140), 260);

  for (let i = cachedSectionOffsets.length - 1; i >= 0; i--) {
    const item = cachedSectionOffsets[i];
    if (y >= item.top - checkpoint) {
      if (store.activeRoom !== item.room) {
        store.setActiveRoom(item.room);
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
  const { setScroll } = useScrollStore.getState();

  useEffect(() => {
    // User interaction immediately unlocks programmatic nav lock
    const handleUserInteraction = () => {
      if (useScrollStore.getState().navLockUntil > 0) {
        useScrollStore.getState().unlockActiveRoom();
      }
    };
    const handleResize = () => {
      recalculateSectionOffsets();
      updateActiveRoom();
    };

    window.addEventListener('wheel', handleUserInteraction, { passive: true });
    window.addEventListener('touchstart', handleUserInteraction, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });

    // Initial check on mount
    const initialTimer = setTimeout(() => {
      recalculateSectionOffsets();
      updateActiveRoom();
    }, 150);

    // Respect reduced motion and mobile touch devices: 100% native scrolling
    const isTouchOnly =
      typeof window !== 'undefined' &&
      window.matchMedia('(pointer: coarse)').matches &&
      !window.matchMedia('(pointer: fine)').matches;
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (isTouchOnly || prefersReduced) {
      const handleNativeScroll = () => {
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = scrollHeight > 0 ? Math.min(Math.max(window.scrollY / scrollHeight, 0), 1) : 0;
        setScroll(progress, window.scrollY, 0);
        updateActiveRoom();
      };

      window.addEventListener('scroll', handleNativeScroll, { passive: true });
      return () => {
        clearTimeout(initialTimer);
        window.removeEventListener('wheel', handleUserInteraction);
        window.removeEventListener('touchstart', handleUserInteraction);
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('scroll', handleNativeScroll);
      };
    }

    const lenis = new Lenis({
      duration: 0.5,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 1.0,
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
      setScroll(progress, scroll, velocity);
      updateActiveRoom();
    });

    let rafId: number | null = null;
    const tick = (now: number) => {
      lenis.raf(now);
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

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
  }, [setScroll]);

  return (
    <LenisContext.Provider value={lenisRef}>
      {children}
    </LenisContext.Provider>
  );
}
