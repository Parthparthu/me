import { create } from 'zustand';

export type RoomId = 'hero' | 'work' | 'about' | 'skills' | 'journey' | 'contact';

interface ScrollState {
  progress: number;
  scrollY: number;
  velocity: number;
  activeRoom: RoomId;
  setProgress: (progress: number) => void;
  setScrollY: (scrollY: number) => void;
  setVelocity: (velocity: number) => void;
  setActiveRoom: (room: RoomId) => void;
}

export const useScrollStore = create<ScrollState>((set) => ({
  progress: 0,
  scrollY: 0,
  velocity: 0,
  activeRoom: 'hero',
  setProgress: (progress) => set({ progress }),
  setScrollY: (scrollY) => set({ scrollY }),
  setVelocity: (velocity) => set({ velocity }),
  setActiveRoom: (activeRoom) => set({ activeRoom }),
}));
