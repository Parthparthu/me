'use client';

import { useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useLenis } from '@/components/common/SmoothScrollProvider';
import { useScrollStore, type RoomId } from '@/store/useScrollStore';

export interface SmoothScrollOptions {
  offset?: number;
  duration?: number;
  easing?: (t: number) => number;
  immediate?: boolean;
  onComplete?: () => void;
}

/**
 * Smooth cubic-bezier easeInOut curve for cinematic, buttery scroll feel
 */
const defaultEasing = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

export function useSmoothScroll() {
  const lenisRef = useLenis();
  const router = useRouter();
  const pathname = usePathname();

  /**
   * Smoothly scrolls to a numeric position, element, or selector string.
   * Leverages Lenis for butter-smooth 60fps/120fps camera & DOM interpolation.
   * Includes high-precision RAF cubic easing fallback if Lenis is unavailable.
   */
  const scrollTo = useCallback(
    (
      target: string | number | HTMLElement,
      options: SmoothScrollOptions = {}
    ) => {
      if (typeof window === 'undefined') return;

      const {
        offset = -60,
        duration = 1.25,
        easing = defaultEasing,
        immediate = false,
        onComplete,
      } = options;

      const prefersReducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches;

      console.log('[useSmoothScroll]', JSON.stringify({ target: String(target), prefersReducedMotion, hasLenis: !!lenisRef?.current }));

      // Handle numeric target (e.g. 0 for top of page)
      if (typeof target === 'number') {
        if (prefersReducedMotion || immediate) {
          window.scrollTo({ top: target, behavior: 'instant' as ScrollBehavior });
          onComplete?.();
          return;
        }

        if (lenisRef?.current) {
          lenisRef.current.scrollTo(target, {
            offset,
            duration,
            easing,
            onComplete,
          });
          return;
        }

        // High-precision RAF cubic-bezier fallback
        const startY = window.scrollY;
        const diff = target - startY;
        const startTime = performance.now();
        const durationMs = duration * 1000;

        const step = (now: number) => {
          const elapsed = Math.min((now - startTime) / durationMs, 1);
          const ease =
            elapsed < 0.5
              ? 4 * elapsed * elapsed * elapsed
              : 1 - Math.pow(-2 * elapsed + 2, 3) / 2;
          window.scrollTo(0, startY + diff * ease);
          if (elapsed < 1) {
            requestAnimationFrame(step);
          } else {
            onComplete?.();
          }
        };
        requestAnimationFrame(step);
        return;
      }

      // Handle selector string or element
      let element: HTMLElement | null = null;
      if (typeof target === 'string') {
        const cleanId = target.replace(/^[#/]+/, '');
        if (cleanId === '' || cleanId === 'hero') {
          scrollTo(0, options);
          return;
        }
        element =
          document.getElementById(cleanId) ||
          (cleanId === 'work' ? document.getElementById('selected-work') : null) ||
          document.querySelector<HTMLElement>(target.startsWith('#') ? target : `#${cleanId}`);
      } else if (target instanceof HTMLElement) {
        element = target;
      }

      if (!element) {
        console.warn(`[useSmoothScroll] Element not found for target:`, target);
        return;
      }

      const rect = element.getBoundingClientRect();
      const targetY = Math.max(0, Math.round(rect.top + window.scrollY + offset));
      console.log('[useSmoothScroll targetY]', JSON.stringify({ targetY, rectTop: rect.top, scrollY: window.scrollY }));

      if (prefersReducedMotion || immediate) {
        window.scrollTo({ top: targetY, behavior: 'instant' as ScrollBehavior });
        onComplete?.();
        return;
      }

      if (lenisRef?.current) {
        lenisRef.current.scrollTo(targetY, {
          duration,
          onComplete,
        });
        return;
      }

      // Fallback RAF scroll
      const startY = window.scrollY;
      const diff = targetY - startY;
      const startTime = performance.now();
      const durationMs = duration * 1000;

      const step = (now: number) => {
        const elapsed = Math.min((now - startTime) / durationMs, 1);
        const ease =
          elapsed < 0.5
            ? 4 * elapsed * elapsed * elapsed
            : 1 - Math.pow(-2 * elapsed + 2, 3) / 2;
        window.scrollTo(0, startY + diff * ease);
        if (elapsed < 1) {
          requestAnimationFrame(step);
        } else {
          onComplete?.();
        }
      };
      requestAnimationFrame(step);
    },
    [lenisRef]
  );

  /**
   * High-level navigation helper that updates browser history without
   * triggering jarring browser anchor jumps, and smoothly glides to section.
   */
  const navigateTo = useCallback(
    (href: string, section?: string) => {
      // If external or separate route like /resume
      if (!href.startsWith('/#') && href !== '/' && !section) {
        router.push(href);
        return;
      }

      if (pathname === '/') {
        const targetId =
          section ||
          (href.startsWith('/#') ? href.replace('/#', '') : href.replace('#', ''));

        if (!targetId || targetId === 'hero') {
          useScrollStore.getState().lockActiveRoom('hero', 3000);
          window.history.pushState(null, '', '/');
          scrollTo(0, {
            onComplete: () => useScrollStore.getState().unlockActiveRoom(),
          });
        } else {
          const roomMap: Record<string, RoomId> = {
            'selected-work': 'work',
            work: 'work',
            about: 'about',
            journey: 'journey',
            contact: 'contact',
          };
          const room = roomMap[targetId];
          if (room) {
            useScrollStore.getState().lockActiveRoom(room, 3000);
          }
          window.history.pushState(null, '', `/#${targetId}`);
          scrollTo(targetId, {
            offset: -60,
            onComplete: () => useScrollStore.getState().unlockActiveRoom(),
          });
        }
      } else {
        router.push(href);
      }
    },
    [pathname, router, scrollTo]
  );

  return { scrollTo, navigateTo };
}
