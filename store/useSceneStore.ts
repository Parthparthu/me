/**
 * useSceneStore — Global Zustand store for 3D scene and UI state.
 * Single source of truth for quality tier, theme, cursor, active section,
 * and accent color. All components read from here; no prop-drilling.
 */
import { create } from 'zustand';
import { persist, subscribeWithSelector } from 'zustand/middleware';

export type QualityTier = 'high' | 'medium' | 'low' | 'none';
export type Theme = 'dark' | 'light';
export type AccentColor = 'indigo' | 'violet' | 'cyan' | 'rose' | 'amber';

export interface CursorState {
  x: number;
  y: number;
  /** Normalized [-1, 1] relative to viewport center */
  nx: number;
  ny: number;
  isHovering: boolean;
  /** Context label shown on the glass lens cursor */
  label: '' | 'View' | 'Drag' | 'Play' | 'Open';
}

interface SceneStore {
  // Quality
  quality: QualityTier;
  qualityOverride: QualityTier | null; // user-forced quality
  setQuality: (q: QualityTier) => void;
  setQualityOverride: (q: QualityTier | null) => void;

  // Theme
  theme: Theme;
  setTheme: (t: Theme) => void;
  toggleTheme: () => void;

  // Accent
  accent: AccentColor;
  setAccent: (a: AccentColor) => void;

  // Cursor
  cursor: CursorState;
  setCursor: (partial: Partial<CursorState>) => void;

  // Scene state
  activeSection: string;
  setActiveSection: (id: string) => void;

  // Preloader
  preloaderDone: boolean;
  setPreloaderDone: (done: boolean) => void;

  // Sound
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;

  // Canvas ready
  canvasReady: boolean;
  setCanvasReady: (ready: boolean) => void;
}

export const useSceneStore = create<SceneStore>()(
  subscribeWithSelector(
    persist(
      (set) => ({
        // Quality
        quality: 'high',
        qualityOverride: null,
        setQuality: (quality) => set({ quality }),
        setQualityOverride: (qualityOverride) => set({ qualityOverride }),

        // Theme — default dark
        theme: 'dark',
        setTheme: (theme) => set({ theme }),
        toggleTheme: () =>
          set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),

        // Accent
        accent: 'indigo',
        setAccent: (accent) => set({ accent }),

        // Cursor
        cursor: { x: 0, y: 0, nx: 0, ny: 0, isHovering: false, label: '' },
        setCursor: (partial) =>
          set((state) => ({ cursor: { ...state.cursor, ...partial } })),

        // Section
        activeSection: 'hero',
        setActiveSection: (activeSection) => set({ activeSection }),

        // Preloader
        preloaderDone: false,
        setPreloaderDone: (preloaderDone) => set({ preloaderDone }),

        // Sound
        soundEnabled: false,
        setSoundEnabled: (soundEnabled) => set({ soundEnabled }),

        // Canvas
        canvasReady: false,
        setCanvasReady: (canvasReady) => set({ canvasReady }),
      }),
      {
        name: 'portfolio-scene-store',
        // Only persist user preferences, not transient state
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
