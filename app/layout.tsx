import type { Metadata } from 'next';
import { Inter, Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/ui/ThemeProvider';
import { SmoothScrollProvider } from '@/components/common/SmoothScrollProvider';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ClientOverlays } from '@/components/common/ClientOverlays';
import { GlassSVGFilter } from '@/components/glass/GlassSVGFilter';
import { SceneCanvas } from '@/components/canvas/SceneCanvas';
import { Preloader } from '@/components/layout/Preloader';

// Configure fonts with CSS variables
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});
const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
});
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Pradyumna — Software Developer & Product Builder',
    template: '%s | Pradyumna',
  },
  description:
    'B.Tech CSE (AI/ML) student and full-stack developer building production-grade applications. World Memory Championship Bronze Medalist. Open to Software Engineering internships.',
  keywords: [
    'Pradyumna',
    'developer',
    'portfolio',
    'full-stack',
    'React',
    'Next.js',
    'TypeScript',
    'AI',
    'ML',
    'Three.js',
    'FastAPI',
    'Python',
    'World Memory Championship',
  ],
  authors: [{ name: 'Pradyumna', url: 'https://github.com/Parthparthu' }],
  creator: 'Pradyumna',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://pradyumna.dev',
    title: 'Pradyumna — Software Developer & Product Builder',
    description:
      'B.Tech CSE (AI/ML) student building production-grade applications. World Memory Championship Bronze Medalist.',
    siteName: 'Pradyumna Portfolio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pradyumna — Software Developer & Product Builder',
    description:
      'B.Tech CSE (AI/ML) student. Full-stack developer. World Memory Championship Bronze Medalist.',
    creator: '@Parthparthu',
  },
  robots: { index: true, follow: true },
  // JSON-LD via metadata is limited — full JSON-LD added via script in layout body
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        {/* JSON-LD Person schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Person',
              name: 'Pradyumna',
              url: 'https://pradyumna.dev',
              sameAs: [
                'https://github.com/Parthparthu',
                'https://linkedin.com/in/pradyumna',
              ],
              jobTitle: 'Software Developer',
              description:
                'B.Tech CSE (AI/ML) student and full-stack developer. World Memory Championship Bronze Medalist.',
              knowsAbout: [
                'React',
                'TypeScript',
                'Python',
                'Next.js',
                'Three.js',
                'FastAPI',
                'Machine Learning',
                'Full-Stack Development',
              ],
            }),
          }}
        />

        {/* Preconnect to Google Fonts CDN */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        {/* Theme color for mobile browser UI */}
        <meta name="theme-color" content="#05060a" />
        <meta name="color-scheme" content="dark light" />

        {/* Viewport — never disable zoom */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
      </head>
      <body suppressHydrationWarning>
        {/*
         * Architecture:
         * SceneCanvas — fixed, full-viewport, z-index: 0, pointer-events: none
         *   ↕ DOM sections float above the canvas ↕
         * ThemeProvider / SmoothScrollProvider — context only, no DOM overhead
         * Preloader — z-index: 9999, exits and reveals hero
         * GlassSVGFilter — invisible <svg> with <defs>, mounted once
         * Header — fixed, z-index: 200, glass dock nav
         * main — scroll container with all sections
         * Footer — bottom of scroll
         * ClientOverlays — cursor, command palette, easter egg
         */}

        {/* 3D canvas — persistent, behind everything */}
        <SceneCanvas />

        <ThemeProvider>
          <SmoothScrollProvider>
            {/* SVG refraction filter definitions */}
            <GlassSVGFilter />

            {/* Branded preloader with "Enter Site" */}
            <Preloader />

            {/* Skip to main content for keyboard/screen reader users */}
            <a href="#main-content" className="skip-link">
              Skip to content
            </a>

            {/* Glass dock navigation */}
            <Header />

            {/* Main content — sections scroll over the fixed canvas */}
            <main id="main-content" className="flex-1 relative">
              {children}
            </main>

            <Footer />

            {/* Cursor, command palette, toast, easter egg */}
            <ClientOverlays />
          </SmoothScrollProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
