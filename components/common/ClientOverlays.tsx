/**
 * ClientOverlays — Dynamically imported client-side UI overlays.
 * Loaded after initial paint to not block LCP.
 * No server-side rendering for any of these components.
 */
'use client';

import dynamic from 'next/dynamic';

const CustomCursor = dynamic(
  () => import('@/components/ui/CustomCursor').then((m) => m.CustomCursor),
  { ssr: false }
);

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

const EasterEgg = dynamic(
  () => import('@/components/ui/EasterEgg').then((m) => m.EasterEgg),
  { ssr: false }
);

// Note: InteractiveBackground removed — replaced by persistent SceneCanvas
// QualityToggle added for user control of rendering quality
const QualityToggle = dynamic(
  () => import('@/components/ui/QualityToggle').then((m) => m.QualityToggle),
  { ssr: false }
);

export function ClientOverlays() {
  return (
    <>
      <ScrollProgress />
      <CustomCursor />
      <BackToTop />
      <CommandPalette />
      <EasterEgg />
      <QualityToggle />
    </>
  );
}
