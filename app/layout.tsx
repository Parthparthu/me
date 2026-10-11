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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://parthparthu.github.io/me';
const basePath = process.env.NEXT_PUBLIC_BASE_PATH
  ? (process.env.NEXT_PUBLIC_BASE_PATH.endsWith('/')
      ? process.env.NEXT_PUBLIC_BASE_PATH.slice(0, -1)
      : process.env.NEXT_PUBLIC_BASE_PATH)
  : '';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Pradyumna: Software & Web Developer',
    template: '%s | Pradyumna',
  },
  description:
    'First-year B.Tech CSE (AI/ML) student at GL Bajaj ITM building practical web applications, data tools, and systems. World Memory Championship Bronze Medalist (2023).',
  applicationName: 'Pradyumna Portfolio',
  generator: 'Next.js',
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
    'GL Bajaj ITM',
    'internship',
  ],
  authors: [{ name: 'Pradyumna', url: 'https://github.com/Parthparthu' }],
  creator: 'Pradyumna',
  publisher: 'Pradyumna',
  alternates: {
    canonical: 'https://parthparthu.github.io/me/',
  },
  icons: {
    icon: [
      { url: `${basePath}/favicon.svg`, type: 'image/svg+xml' },
      { url: `${basePath}/favicon.ico`, sizes: 'any' },
      { url: `${basePath}/icon-192.png`, type: 'image/png', sizes: '192x192' },
      { url: `${basePath}/icon-512.png`, type: 'image/png', sizes: '512x512' },
    ],
    shortcut: [`${basePath}/favicon.ico`],
    apple: [{ url: `${basePath}/apple-touch-icon.png`, sizes: '180x180' }],
  },
  manifest: `${basePath}/manifest.webmanifest`,
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://parthparthu.github.io/me/',
    title: 'Pradyumna: Software & Web Developer',
    description:
      'First-year B.Tech CSE (AI/ML) student at GL Bajaj ITM building practical web applications, data tools, and systems. World Memory Championship Bronze Medalist (2023).',
    siteName: 'Pradyumna Portfolio',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Pradyumna: Software and Web Developer Portfolio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pradyumna: Software & Web Developer',
    description:
      'First-year B.Tech CSE (AI/ML) student at GL Bajaj ITM. Software and web developer. World Memory Championship Bronze Medalist (2023).',
    creator: '@Parthparthu',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Pradyumna',
  },
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
        {/* JSON-LD Structured Data Graph */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@graph': [
                {
                  '@type': 'Person',
                  '@id': 'https://parthparthu.github.io/me/#person',
                  name: 'Pradyumna',
                  url: 'https://parthparthu.github.io/me/',
                  image: 'https://parthparthu.github.io/me/icon-512.png',
                  sameAs: [
                    'https://github.com/Parthparthu',
                    'https://www.linkedin.com/in/pradyumna05',
                    'https://www.instagram.com/pradyumna_in_/',
                  ],
                  jobTitle: 'Software Developer',
                  email: 'pradyumna05@outlook.in',
                  alumniOf: {
                    '@type': 'CollegeOrUniversity',
                    name: 'GL Bajaj Institute of Technology & Management',
                  },
                  award: 'World Memory Championship 2023 Bronze Medal (Amateur Category)',
                  knowsAbout: [
                    'React',
                    'TypeScript',
                    'Python',
                    'Next.js',
                    'Three.js',
                    'FastAPI',
                    'Progressive Web Apps',
                    'Machine Learning',
                  ],
                },
                {
                  '@type': 'WebSite',
                  '@id': 'https://parthparthu.github.io/me/#website',
                  url: 'https://parthparthu.github.io/me/',
                  name: 'Pradyumna Portfolio',
                  publisher: { '@id': 'https://parthparthu.github.io/me/#person' },
                },
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

        {/* Theme color and color-scheme */}
        <meta name="theme-color" content="#0a0e1a" />
        <meta name="color-scheme" content="dark light" />

        {/* Viewport: safe areas, never disable user zoom */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
        {/* Anti-FOUC theme initialization script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('portfolio-theme');if(!t){var s=localStorage.getItem('portfolio-scene-store');if(s){t=JSON.parse(s)?.state?.theme;}}if(!t){t=window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark';}document.documentElement.setAttribute('data-theme',t);document.documentElement.style.colorScheme=t;}catch(e){}})()`,
          }}
        />
      </head>
      <body suppressHydrationWarning>
        <ThemeProvider>
          {/* Branded first-visit preloader */}
          <Preloader />

          {/* 3D canvas: persistent, ambient, behind everything */}
          <SceneCanvas />

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
