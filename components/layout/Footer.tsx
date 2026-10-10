import Link from 'next/link';
import { Github, Linkedin, Mail, Instagram } from 'lucide-react';
import { socials } from '@/data/socials';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-[var(--border-subtle)] bg-[var(--bg-surface)] py-12">
      <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center gap-4 text-sm text-[var(--text-secondary)]">
          <p>© {currentYear} Pradyumna. All rights reserved.</p>
          <div className="flex items-center gap-3 text-xs text-[var(--text-muted)]">
            <Link href="/privacy" className="hover:text-[var(--text-primary)] transition-colors underline-offset-4 hover:underline">
              Privacy Policy
            </Link>
            <span>·</span>
            <Link href="/terms" className="hover:text-[var(--text-primary)] transition-colors underline-offset-4 hover:underline">
              Terms of Use
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="https://github.com/Parthparthu"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center rounded-md hover:bg-white/5"
            aria-label="GitHub profile"
          >
            <Github size={18} />
          </a>
          <a
            href="https://www.linkedin.com/in/pradyumna05"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center rounded-md hover:bg-white/5"
            aria-label="LinkedIn profile"
          >
            <Linkedin size={18} />
          </a>
          <a
            href="https://www.instagram.com/pradyumna_in_/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center rounded-md hover:bg-white/5"
            aria-label="Instagram profile"
          >
            <Instagram size={18} />
          </a>
          <a
            href="mailto:pradyumna05@outlook.in"
            className="p-2.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center rounded-md hover:bg-white/5"
            aria-label="Send email"
          >
            <Mail size={18} />
          </a>
        </div>
      </div>
    </footer>
  );
}
