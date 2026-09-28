import Link from 'next/link';
import { Github, Linkedin, Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer className="relative border-t border-[var(--border-subtle)] bg-[var(--bg-surface)] py-12">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[var(--brand-cyan)] to-transparent opacity-30"></div>
      <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <p className="text-[var(--text-secondary)] text-sm font-medium">
          © {new Date().getFullYear()} Pradyumna. Built with Next.js, Three.js & a lot of ☕
        </p>
        <div className="flex items-center gap-4">
          <Link href="https://github.com/Parthparthu" target="_blank" rel="noopener noreferrer" className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors" aria-label="GitHub">
            <Github size={20} />
          </Link>
          <Link href="https://linkedin.com/in/pradyumna" target="_blank" rel="noopener noreferrer" className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors" aria-label="LinkedIn">
            <Linkedin size={20} />
          </Link>
          <Link href="mailto:contact@example.com" className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors" aria-label="Email">
            <Mail size={20} />
          </Link>
        </div>
      </div>
    </footer>
  );
}
