/**
 * useScrollStore — Scroll progress and active room state.
 * Populated by SmoothScrollProvider; consumed by CameraRig and sections.
 */
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

interface ScrollStore {
  /** 0–1 global scroll progress */
  progress: number;
  setProgress: (p: number) => void;

  /** Current visible room for camera/lighting transitions */
  activeRoom: 'hero' | 'work' | 'about' | 'skills' | 'journey' | 'contact';
  setActiveRoom: (r: ScrollStore['activeRoom']) => void;

  /** Raw scroll Y in pixels */
  scrollY: number;
  setScrollY: (y: number) => void;

  /** Scroll velocity for momentum effects */
  velocity: number;
  setVelocity: (v: number) => void;
}

export const useScrollStore = create<ScrollStore>()(
  subscribeWithSelector((set) => ({
    progress: 0,
    setProgress: (progress) => set({ progress }),
    activeRoom: 'hero',
    setActiveRoom: (activeRoom) => set({ activeRoom }),
    scrollY: 0,
    setScrollY: (scrollY) => set({ scrollY }),
    velocity: 0,
    setVelocity: (velocity) => set({ velocity }),
  }))
);
