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
    default: 'Pradyuma: Software Developer',
    template: '%s | Pradyuma',
  },
  description:
    'First-year B.Tech CSE (AI/ML) student at GL Bajaj ITM building practical web applications, data tools, and systems. World Memory Championship Bronze Medalist (2023).',
  keywords: [
    'Pradyuma',
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
    'internship',
  ],
  authors: [{ name: 'Pradyuma', url: 'https://github.com/Parthparthu' }],
  creator: 'Pradyuma',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
  },
  manifest: '/manifest.webmanifest',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://parthparthu.github.io/me/',
    title: 'Pradyuma: Software Developer',
    description:
      'First-year B.Tech CSE (AI/ML) student at GL Bajaj ITM building practical applications. World Memory Championship Bronze Medalist.',
    siteName: 'Pradyuma',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pradyuma: Software Developer',
    description:
      'B.Tech CSE (AI/ML) student. Software and web developer. World Memory Championship Bronze Medalist (2023).',
    creator: '@Parthparthu',
  },
  robots: { index: true, follow: true },
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
              name: 'Pradyuma',
              url: 'https://parthparthu.github.io/me/',
              sameAs: [
                'https://github.com/Parthparthu',
                'https://www.linkedin.com/in/pradyumna05',
                'https://www.instagram.com/pradyumna_in_/',
              ],
              jobTitle: 'Software Developer',
              email: 'pradyumna05@outlook.in',
              description:
                'First-year B.Tech CSE (AI/ML) student at GL Bajaj ITM. World Memory Championship Bronze Medalist (2023).',
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
        <meta name="theme-color" content="#0b0f17" />
        <meta name="color-scheme" content="dark light" />

        {/* Viewport: never disable zoom */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
      </head>
      <body suppressHydrationWarning>
        {/* 3D canvas: persistent, ambient, behind everything */}
        <SceneCanvas />

        <ThemeProvider>
          <SmoothScrollProvider>
            {/* SVG refraction filter definitions */}
            <GlassSVGFilter />

            {/* Skip to main content for keyboard/screen reader users */}
            <a href="#main-content" className="skip-link">
              Skip to content
            </a>

            {/* Glass dock navigation */}
            <Header />

            {/* Main content */}
            <main id="main-content" className="flex-1 relative">
              {children}
            </main>

            <Footer />

            {/* Command palette, back-to-top, scroll progress */}
            <ClientOverlays />
          </SmoothScrollProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
