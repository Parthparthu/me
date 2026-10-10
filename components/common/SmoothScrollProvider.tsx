'use client';

import { createContext, useContext, useRef, type ReactNode } from 'react';

const SmoothScrollContext = createContext<unknown>(null);
export const useLenis = () => useContext(SmoothScrollContext);

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
