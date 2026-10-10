/**
 * ClientOverlays: Dynamically imported client-side UI overlays.
 * Loaded after initial paint to not block LCP.
 * No server-side rendering for any of these components.
 */
'use client';

import dynamic from 'next/dynamic';

const BackToTop = dynamic(
  () => import('@/components/ui/BackToTop').then((m) => m.BackToTop),
  { ssr: false }
);

const ScrollProgress = dynamic(
  () => import('@/components/ui/ScrollProgress').then((m) => m.ScrollProgress),
  { ssr: false }
);

const CommandPalette = dynamic(
  () => import('@/components/ui/CommandPalette').then((m) => m.CommandPalette),
  { ssr: false }
);

export function ClientOverlays() {
  return (
    <>
      <ScrollProgress />
      <BackToTop />
      <CommandPalette />
    </>
  );
}
