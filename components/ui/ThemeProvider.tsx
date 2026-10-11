/**
 * ThemeProvider: Bridges the Zustand theme store with the DOM data-theme attribute.
 * Syncs the Zustand store with localStorage on mount for SSR hydration safety.
 * Handles system preference listeners, favicon swapping, and theme-color meta updates.
 */
'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
  type ReactNode,
} from 'react';
import { useSceneStore } from '@/store/useSceneStore';

type Theme = 'dark' | 'light';

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  isManualOverride: boolean;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { theme: zustandTheme, setTheme: setZustandTheme } = useSceneStore();
  const [mounted, setMounted] = useState(false);
  const isManualRef = useRef(false);

  useEffect(() => {
    // Check localStorage on mount
    const stored = localStorage.getItem('portfolio-theme') as Theme | null;
    if (stored === 'dark' || stored === 'light') {
      isManualRef.current = true;
      setZustandTheme(stored);
    } else {
      const systemIsLight = window.matchMedia('(prefers-color-scheme: light)').matches;
      setZustandTheme(systemIsLight ? 'light' : 'dark');
    }
    setMounted(true);

    // Listen to system preference changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: light)');
    const handleSystemChange = (e: MediaQueryListEvent) => {
      // If user has not explicitly set a manual preference in this session, follow system
      if (!isManualRef.current) {
        const newTheme: Theme = e.matches ? 'light' : 'dark';
        setZustandTheme(newTheme);
      }
    };

    mediaQuery.addEventListener('change', handleSystemChange);
    return () => mediaQuery.removeEventListener('change', handleSystemChange);
  }, [setZustandTheme]);

  // Synchronize DOM attributes, color-scheme, meta theme-color, and favicon
  useEffect(() => {
    if (!mounted) return;

    // Apply data-theme to <html>
    document.documentElement.setAttribute('data-theme', zustandTheme);
    document.documentElement.style.colorScheme = zustandTheme;

    // Update meta theme-color
    const themeColor = zustandTheme === 'dark' ? '#0a0e1a' : '#f5f7fa';
    const metaThemeColors = document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]');
    if (metaThemeColors.length > 0) {
      metaThemeColors.forEach((m) => m.setAttribute('content', themeColor));
    } else {
      const meta = document.createElement('meta');
      meta.setAttribute('name', 'theme-color');
      meta.setAttribute('content', themeColor);
      document.head.appendChild(meta);
    }

    // Update SVG favicon to match theme
    const svgFavicon = document.querySelector<HTMLLinkElement>('link[rel="icon"][type="image/svg+xml"]');
    if (svgFavicon) {
      svgFavicon.href = zustandTheme === 'dark' ? '/favicon.svg' : '/favicon-light.svg';
    }
  }, [zustandTheme, mounted]);

  const setTheme = useCallback(
    (t: Theme) => {
      isManualRef.current = true;
      localStorage.setItem('portfolio-theme', t);
      setZustandTheme(t);
    },
    [setZustandTheme]
  );

  const toggleTheme = useCallback(() => {
    isManualRef.current = true;
    const nextTheme: Theme = zustandTheme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('portfolio-theme', nextTheme);
    setZustandTheme(nextTheme);
  }, [zustandTheme, setZustandTheme]);

  return (
    <ThemeContext.Provider
      value={{
        theme: zustandTheme,
        setTheme,
        toggleTheme,
        isManualOverride: isManualRef.current,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
}
