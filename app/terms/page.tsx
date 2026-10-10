import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Terms of Use',
  description: 'Terms and conditions governing the use of this portfolio website.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors min-h-[44px]"
        >
          <ArrowLeft size={16} />
          Back to Portfolio
        </Link>
      </div>

      <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl p-6 sm:p-10 space-y-8">
        <header className="border-b border-[var(--border-subtle)] pb-6">
          <span className="section-label">Legal</span>
          <h1 className="text-3xl font-display font-bold text-[var(--text-primary)] mt-1">
            Terms of Use
          </h1>
          <p className="text-xs font-mono text-[var(--text-muted)] mt-2">
            Last Updated: October 10, 2026 (Subject to User Legal Review)
          </p>
        </header>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[var(--text-primary)]">1. Purpose and Acceptance</h2>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            This portfolio website is operated by Pradyumna for the purpose of showcasing software engineering projects, code samples, and technical experience. By accessing this site, you agree to these Terms of Use.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[var(--text-primary)]">2. Intellectual Property</h2>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            All original text, architectural case studies, diagrams, and site design are the intellectual property of Pradyumna unless otherwise stated. Open-source software projects linked from this site are governed by their respective repository licenses (e.g. MIT, Apache 2.0). Third-party trademarks and brand logos belong to their respective owners.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[var(--text-primary)]">3. External Links</h2>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            This website contains links to external platforms including GitHub, LinkedIn, and live project deployments. Pradyumna is not responsible for the content, privacy practices, or availability of third-party websites.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[var(--text-primary)]">4. Disclaimer and Limitation of Liability</h2>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            This site and its content are provided on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo; basis without warranties of any kind. Project demonstrations, case studies, and code snippets are presented for informational and evaluative purposes only. To the extent permitted by applicable law, the author disclaims all liability for any direct, indirect, or incidental damages arising from use of this site.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[var(--text-primary)]">5. Contact Information</h2>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            If you have questions regarding these terms, contact: <a href="mailto:pradyumna05@outlook.in" className="text-[var(--accent-primary)] hover:underline">pradyumna05@outlook.in</a>.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[var(--text-primary)]">6. Governing Law</h2>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            These terms are governed by the laws of India, subject to user legal review.
          </p>
        </section>
      </div>
    </div>
  );
}
