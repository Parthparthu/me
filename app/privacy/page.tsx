import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy policy detailing data collection, processing, and retention practices for this portfolio website.',
};

export default function PrivacyPage() {
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
            Privacy Policy
          </h1>
          <p className="text-xs font-mono text-[var(--text-muted)] mt-2">
            Last Updated: October 10, 2026 (Subject to User Legal Review)
          </p>
        </header>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[var(--text-primary)]">1. Overview</h2>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            This portfolio website is operated by Pradyumna. The site is designed with a strict privacy-first architecture. It does not use advertising trackers, does not sell personal data, and sets zero tracking or marketing cookies.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[var(--text-primary)]">2. Information Collected</h2>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            The only personal data collected on this site is the information you deliberately provide via the contact form:
          </p>
          <ul className="list-disc pl-5 text-sm text-[var(--text-secondary)] space-y-1">
            <li>Your name</li>
            <li>Your email address</li>
            <li>Message subject (optional)</li>
            <li>Message body</li>
          </ul>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            No account creation or automated background profiling exists on this site.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[var(--text-primary)]">3. How Information is Used</h2>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            Information submitted through the contact form is used solely to read and reply to your inquiry regarding software engineering opportunities, technical projects, or collaborations. It is never used for marketing newsletters or shared with advertisers.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[var(--text-primary)]">4. Cookies and Local Storage</h2>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            This website does not use cookies for tracking, analytics, or behavioral advertising. Client-side local storage may be used exclusively to persist your interface preference (light or dark mode) and is stored entirely within your browser without transmission to any remote server.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[var(--text-primary)]">5. Third-Party Services</h2>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            Limited third-party infrastructure providers assist in serving this site:
          </p>
          <ul className="list-disc pl-5 text-sm text-[var(--text-secondary)] space-y-1">
            <li>Hosting: Vercel (processes HTTP request logs for security and performance delivery)</li>
            <li>Email Delivery: Resend (transmits contact form messages securely to the recipient inbox)</li>
            <li>Fonts: Google Fonts (standard font stylesheets)</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[var(--text-primary)]">6. Data Retention and Deletion Requests</h2>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            Contact form submissions are retained in the owner email inbox only as long as needed to address your conversation. To request deletion or access to any communication history you have provided, email: <a href="mailto:pradyumna05@outlook.in" className="text-[var(--accent-primary)] hover:underline">pradyumna05@outlook.in</a>.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[var(--text-primary)]">7. Governing Law</h2>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            This policy is provided under the laws applicable to the site owner in India, subject to review under your relevant national jurisdiction.
          </p>
        </section>
      </div>
    </div>
  );
}
