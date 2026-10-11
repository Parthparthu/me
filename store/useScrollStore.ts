import { create } from 'zustand';

export type RoomId = 'hero' | 'work' | 'about' | 'skills' | 'journey' | 'contact';

interface ScrollState {
  progress: number;
  scrollY: number;
  velocity: number;
  activeRoom: RoomId;
  navLockUntil: number;
  setProgress: (progress: number) => void;
  setScrollY: (scrollY: number) => void;
  setVelocity: (velocity: number) => void;
  setScroll: (progress: number, scrollY: number, velocity: number) => void;
  setActiveRoom: (room: RoomId) => void;
  lockActiveRoom: (room: RoomId, durationMs?: number) => void;
  unlockActiveRoom: () => void;
}

export const useScrollStore = create<ScrollState>((set) => ({
  progress: 0,
  scrollY: 0,
  velocity: 0,
  activeRoom: 'hero',
  navLockUntil: 0,
  setProgress: (progress) => set({ progress }),
  setScrollY: (scrollY) => set({ scrollY }),
  setVelocity: (velocity) => set({ velocity }),
  setScroll: (progress, scrollY, velocity) => set({ progress, scrollY, velocity }),
  setActiveRoom: (activeRoom) => set({ activeRoom }),
  lockActiveRoom: (activeRoom, durationMs = 3000) =>
    set({
      activeRoom,
      navLockUntil: Date.now() + durationMs,
    }),
  unlockActiveRoom: () => set({ navLockUntil: 0 }),
}));
