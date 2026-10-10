import type { Metadata } from 'next';
import { Inter, Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/ui/ThemeProvider';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ClientOverlays } from '@/components/common/ClientOverlays';
import { GlassSVGFilter } from '@/components/glass/GlassSVGFilter';

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

export const metadata: Metadata = {
  title: {
    default: 'Pradyumna: Software Developer and Product Builder',
    template: '%s | Pradyumna',
  },
  description:
    'Computer Science student and full-stack software engineer building offline-first applications and financial data pipelines. World Memory Championship Bronze Medalist.',
  keywords: [
    'Pradyumna',
    'developer',
    'portfolio',
    'full-stack',
    'React',
    'Next.js',
    'TypeScript',
    'FastAPI',
    'Python',
    'Three.js',
    'World Memory Championship',
  ],
  authors: [{ name: 'Pradyumna', url: 'https://github.com/Parthparthu' }],
  creator: 'Pradyumna',
  metadataBase: new URL(siteUrl),
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
  },
  manifest: '/manifest.webmanifest',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    title: 'Pradyumna: Software Developer and Product Builder',
    description:
      'Computer Science student and full-stack software engineer building offline-first applications and financial data pipelines.',
    siteName: 'Pradyumna Portfolio',
  },
  twitter: {
    card: 'summary',
    title: 'Pradyumna: Software Developer and Product Builder',
    description:
      'Computer Science student and full-stack software engineer building offline-first applications and financial data pipelines.',
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
              name: 'Pradyumna',
              url: siteUrl,
              email: 'pradyumna05@outlook.in',
              sameAs: [
                'https://github.com/Parthparthu',
                'https://www.linkedin.com/in/pradyumna05',
                'https://www.instagram.com/pradyumna_in_/',
              ],
              jobTitle: 'Software Developer',
              description:
                'Computer Science student and full-stack developer. World Memory Championship Bronze Medalist.',
              knowsAbout: [
                'React',
                'TypeScript',
                'Python',
                'Next.js',
                'Three.js',
                'FastAPI',
                'Offline-first architecture',
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
        <meta name="theme-color" content="#0a0c10" />
        <meta name="color-scheme" content="dark light" />

        {/* Viewport: never disable zoom */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
      </head>
      <body suppressHydrationWarning className="bg-[var(--bg-app)] text-[var(--text-primary)] antialiased">
        <ThemeProvider>
          {/* SVG refraction filter definition */}
          <GlassSVGFilter />

          {/* Skip link for keyboard users */}
          <a href="#main-content" className="skip-link">
            Skip to content
          </a>

          {/* Top navigation */}
          <Header />

          {/* Main content */}
          <main id="main-content" className="flex-1">
            {children}
          </main>

          {/* Footer */}
          <Footer />

          {/* UI Utilities: ScrollProgress, BackToTop, CommandPalette */}
          <ClientOverlays />
        </ThemeProvider>
      </body>
    </html>
  );
}
