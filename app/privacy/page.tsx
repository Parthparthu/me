import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy policy for Pradyumna\'s personal developer portfolio.',
};

export default function PrivacyPage() {
  return (
    <div className="py-24 px-4 md:px-8 max-w-4xl mx-auto w-full">
      <div className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors mb-6 rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--border-focus)] p-1"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          <span>Back to Home</span>
        </Link>
        <h1 className="text-3xl md:text-4xl font-display font-bold text-[var(--text-primary)] tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-sm text-[var(--text-muted)] font-mono mt-2">
          Last Updated: October 2026 (Subject to legal review)
        </p>
      </div>

      <div className="space-y-8 text-[var(--text-secondary)] text-sm md:text-base leading-relaxed bg-[var(--bg-surface)] p-6 md:p-8 rounded-xl border border-[var(--border-subtle)]">
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">Overview</h2>
          <p>
            This website is a personal portfolio operated by Pradyumna. I value privacy and maintain minimal data collection. This document explains what information is collected, how it is handled, and your rights.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">Information Collected</h2>
          <p>
            This site does not use user accounts, tracking cookies, or tracking pixels. The only personal information collected is information you voluntarily provide through the contact form:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-[var(--text-secondary)]">
            <li>Your name</li>
            <li>Your email address</li>
            <li>Subject line (optional)</li>
            <li>Message content</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">Analytics and Cookies</h2>
          <p>
            This site does not use cookies, advertising identifiers, or analytics services. Your browsing activity is not tracked across the web.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">Third-Party Service Providers</h2>
          <p>
            To deliver this website and handle incoming inquiries, the following third-party services are utilized:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-[var(--text-secondary)]">
            <li>
              <strong className="text-[var(--text-primary)]">GitHub Pages:</strong> Hosts static website files and delivers content. Standard server access logs may be collected by GitHub in accordance with their privacy policy.
            </li>
            <li>
              <strong className="text-[var(--text-primary)]">Contact Submission Provider:</strong> Form submissions are handled directly from the client via Web3Forms or Formspree to deliver messages to pradyumna05@outlook.in, or through a direct mailto link. No message content is stored in an intermediate database on this site.
            </li>
            <li>
              <strong className="text-[var(--text-primary)]">Google Fonts:</strong> Font assets are self-hosted and bundled at build time through Next.js. Your browser does not send requests to Google servers during your visit.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">Data Retention</h2>
          <p>
            Messages received through the contact form are retained only as long as necessary to read, evaluate, and reply to your inquiry, typically up to 90 days. Messages are deleted once the conversation is concluded unless required for legitimate ongoing professional correspondence.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">Your Rights and Contact Information</h2>
          <p>
            You have the right to request access to any personal information submitted via the contact form, or to request correction or complete deletion of your messages. To make a request, contact:
          </p>
          <p className="font-mono text-sm text-[var(--accent-primary)]">
            pradyumna05@outlook.in
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">Governing Law</h2>
          <p>
            This privacy policy is governed by and construed in accordance with the applicable laws of India.
          </p>
        </section>
      </div>
    </div>
  );
}
