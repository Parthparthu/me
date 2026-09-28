/**
 * ThemeProvider — Bridges the Zustand theme store with the DOM data-theme attribute.
 * Also syncs the Zustand store with localStorage on mount for SSR hydration safety.
 * Maintains the existing ThemeContext for backward compatibility.
 */
'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import { useSceneStore } from '@/store/useSceneStore';

type Theme = 'dark' | 'light';

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { theme: zustandTheme, setTheme: setZustandTheme } = useSceneStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // On mount, check localStorage (from old storage key) + system preference
    // Zustand persist handles 'portfolio-scene-store' key
    // But also check old 'portfolio-theme' key for backwards compat
    const oldStored = localStorage.getItem('portfolio-theme') as Theme | null;
    if (oldStored && (oldStored === 'dark' || oldStored === 'light')) {
      setZustandTheme(oldStored);
    } else if (
      !localStorage.getItem('portfolio-scene-store') &&
      window.matchMedia('(prefers-color-scheme: light)').matches
    ) {
      setZustandTheme('light');
    }
    setMounted(true);
  }, [setZustandTheme]);

  // Apply theme to <html> data-theme attribute
  useEffect(() => {
    if (!mounted) return;
    document.documentElement.setAttribute('data-theme', zustandTheme);
    // Also set meta theme-color for mobile browser chrome
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute(
        'content',
        zustandTheme === 'dark' ? '#05060a' : '#f0f4ff'
      );
    }
  }, [zustandTheme, mounted]);

  const setTheme = useCallback((t: Theme) => setZustandTheme(t), [setZustandTheme]);
  const toggleTheme = useCallback(
    () => setZustandTheme(zustandTheme === 'dark' ? 'light' : 'dark'),
    [zustandTheme, setZustandTheme]
  );

  return (
    <ThemeContext.Provider value={{ theme: zustandTheme, setTheme, toggleTheme }}>
      {/* Anti-FOUC script — runs synchronously before paint */}
      <script
        dangerouslySetInnerHTML={{
          __html: `(function(){try{var s=localStorage.getItem('portfolio-scene-store');var t=s?JSON.parse(s)?.state?.theme:null;if(!t){t=localStorage.getItem('portfolio-theme')}if(!t){t=window.matchMedia('(prefers-color-scheme:light)').matches?'light':'dark'}document.documentElement.setAttribute('data-theme',t)}catch(e){document.documentElement.setAttribute('data-theme','dark')}})()`,
        }}
      />
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
}
