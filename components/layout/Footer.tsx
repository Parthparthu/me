import Link from 'next/link';
import { Github, Linkedin, Instagram, Mail } from 'lucide-react';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="relative"
      style={{
        borderTop: '1px solid var(--separator)',
        backgroundColor: 'var(--bg-grouped)',
        paddingTop: 'var(--sp-12)',
        paddingBottom: 'var(--sp-12)',
      }}
    >
      {/* Top hairline gradient */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-0 w-full h-px"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, var(--separator-strong) 30%, var(--separator-strong) 70%, transparent 100%)',
        }}
      />

      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">

          {/* Left: brand + tagline */}
          <div className="flex flex-col gap-1.5">
            <span
              className="text-base font-display font-bold"
              style={{ color: 'var(--label-primary)', letterSpacing: '-0.025em' }}
              translate="no"
            >
              P<span style={{ color: 'var(--accent)' }}>.</span>
            </span>
            <p className="text-xs" style={{ color: 'var(--label-tertiary)' }}>
              &copy;{' '}{year} Pradyumna. All rights reserved.
            </p>
          </div>

          {/* Center: grouped link rows */}
          <nav
            aria-label="Footer links"
            className="flex flex-wrap items-center gap-6 text-sm"
            style={{ color: 'var(--label-tertiary)' }}
          >
            {/* Legal */}
            <div className="flex items-center gap-4">
              <Link
                href="/privacy"
                className="hover:text-[var(--label-primary)] transition-colors min-h-[44px] flex items-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--focus-ring)] rounded"
                style={{ color: 'var(--label-tertiary)' }}
              >
                Privacy
              </Link>
              <Link
                href="/terms"
                className="hover:text-[var(--label-primary)] transition-colors min-h-[44px] flex items-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--focus-ring)] rounded"
                style={{ color: 'var(--label-tertiary)' }}
              >
                Terms
              </Link>
            </div>

            {/* Separator */}
            <div
              className="hidden md:block w-px h-4"
              style={{ backgroundColor: 'var(--separator)' }}
              aria-hidden="true"
            />

            {/* Social icons */}
            <nav aria-label="Social links" className="flex items-center gap-1">
              {[
                { href: 'https://github.com/Parthparthu', Icon: Github, label: 'GitHub profile' },
                { href: 'https://www.linkedin.com/in/pradyumna05', Icon: Linkedin, label: 'LinkedIn profile' },
                { href: 'https://www.instagram.com/pradyumna_in_/', Icon: Instagram, label: 'Instagram profile' },
                { href: 'mailto:pradyumna05@outlook.in', Icon: Mail, label: 'Send email' },
              ].map(({ href, Icon, label }) => (
                <Link
                  key={label}
                  href={href}
                  target={href.startsWith('mailto') ? undefined : '_blank'}
                  rel={href.startsWith('mailto') ? undefined : 'noopener noreferrer'}
                  className="p-2 rounded-[var(--radius-xs)] min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors text-[var(--label-tertiary)] hover:text-[var(--label-primary)] hover:bg-[var(--bg-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--focus-ring)]"
                  aria-label={label}
                >
                  <Icon size={17} aria-hidden="true" />
                </Link>
              ))}
            </nav>
          </nav>

        </div>
      </div>
    </footer>
  );
}
