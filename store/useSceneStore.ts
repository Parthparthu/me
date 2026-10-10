/**
 * useSceneStore: Global Zustand store for 3D scene and UI state.
 * Single source of truth for quality tier, theme, cursor, active section,
 * and accent color.
 */
import { create } from 'zustand';
import { persist, subscribeWithSelector } from 'zustand/middleware';

export type QualityTier = 'high' | 'medium' | 'low' | 'none';
export type Theme = 'dark' | 'light';
export type AccentColor = 'cyan' | 'sky' | 'amber' | 'emerald' | 'indigo' | 'violet';

export interface CursorState {
  x: number;
  y: number;
  nx: number;
  ny: number;
  isHovering: boolean;
  label: '' | 'View' | 'Drag' | 'Play' | 'Open';
}

interface SceneStore {
  quality: QualityTier;
  qualityOverride: QualityTier | null;
  setQuality: (q: QualityTier) => void;
  setQualityOverride: (q: QualityTier | null) => void;

  theme: Theme;
  setTheme: (t: Theme) => void;
  toggleTheme: () => void;

  accent: AccentColor;
  setAccent: (a: AccentColor) => void;

  cursor: CursorState;
  setCursor: (partial: Partial<CursorState>) => void;

  activeSection: string;
  setActiveSection: (id: string) => void;

  preloaderDone: boolean;
  setPreloaderDone: (done: boolean) => void;

  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;

  canvasReady: boolean;
  setCanvasReady: (ready: boolean) => void;
}

export const useSceneStore = create<SceneStore>()(
  subscribeWithSelector(
    persist(
      (set) => ({
        quality: 'high',
        qualityOverride: null,
        setQuality: (quality) => set({ quality }),
        setQualityOverride: (qualityOverride) => set({ qualityOverride }),

        theme: 'dark',
        setTheme: (theme) => set({ theme }),
        toggleTheme: () =>
          set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),

        accent: 'cyan',
        setAccent: (accent) => set({ accent }),

        cursor: { x: 0, y: 0, nx: 0, ny: 0, isHovering: false, label: '' },
        setCursor: (partial) =>
          set((state) => ({ cursor: { ...state.cursor, ...partial } })),

        activeSection: 'hero',
        setActiveSection: (activeSection) => set({ activeSection }),

        preloaderDone: true,
        setPreloaderDone: (preloaderDone) => set({ preloaderDone }),

        soundEnabled: false,
        setSoundEnabled: (soundEnabled) => set({ soundEnabled }),

        canvasReady: false,
        setCanvasReady: (canvasReady) => set({ canvasReady }),
      }),
      {
        name: 'portfolio-scene-store',
        partialize: (state) => ({
          theme: state.theme,
          accent: state.accent,
          qualityOverride: state.qualityOverride,
          soundEnabled: state.soundEnabled,
        }),
      }
    )
  )
);

if (typeof window !== 'undefined') {
  (window as any).__PORTFOLIO_SCENE_STORE__ = useSceneStore;
}
