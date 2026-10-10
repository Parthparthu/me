import Link from 'next/link';
import { Github, Linkedin, Instagram, Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer className="relative border-t border-[var(--border-subtle)] bg-[var(--bg-surface)] py-12">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[var(--border-medium)] to-transparent opacity-40" />
      <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">

        {/* Left: copyright */}
        <p className="text-[var(--text-tertiary)] text-sm">
          &copy; {new Date().getFullYear()} Pradyuma
        </p>

        {/* Center: legal links */}
        <nav aria-label="Legal" className="flex items-center gap-6 text-sm text-[var(--text-tertiary)]">
          <Link href="/privacy" className="hover:text-[var(--text-secondary)] transition-colors">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:text-[var(--text-secondary)] transition-colors">
            Terms
          </Link>
        </nav>

        {/* Right: social links */}
        <nav aria-label="Social links" className="flex items-center gap-2">
          <Link
            href="https://github.com/Parthparthu"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors rounded-lg min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="GitHub profile"
          >
            <Github size={18} aria-hidden="true" />
          </Link>
          <Link
            href="https://www.linkedin.com/in/pradyumna05"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors rounded-lg min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="LinkedIn profile"
          >
            <Linkedin size={18} aria-hidden="true" />
          </Link>
          <Link
            href="https://www.instagram.com/pradyumna_in_/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors rounded-lg min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Instagram profile"
          >
            <Instagram size={18} aria-hidden="true" />
          </Link>
          <Link
            href="mailto:pradyumna05@outlook.in"
            className="p-2 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors rounded-lg min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Send email"
          >
            <Mail size={18} aria-hidden="true" />
          </Link>
        </nav>

      </div>
    </footer>
  );
}
