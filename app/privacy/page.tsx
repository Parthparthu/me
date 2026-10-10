import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy policy for Pradyuma\'s personal developer portfolio.',
};

export default function PrivacyPage() {
  return (
    <div className="py-24 px-4 md:px-8 max-w-4xl mx-auto w-full">
      <div className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-white transition-colors mb-6 rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--border-focus)] p-1"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          <span>Back to Home</span>
        </Link>
        <h1 className="text-3xl md:text-4xl font-display font-bold text-white tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-sm text-[var(--text-muted)] font-mono mt-2">
          Last Updated: October 2026 (Subject to legal review)
        </p>
      </div>

      <div className="space-y-8 text-[var(--text-secondary)] text-sm md:text-base leading-relaxed bg-[var(--bg-surface)] p-6 md:p-8 rounded-xl border border-[var(--border-subtle)]">
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-white">Overview</h2>
          <p>
            This website is a personal portfolio operated by Pradyuma. I value privacy and maintain minimal data collection. This document explains what information is collected, how it is handled, and your rights.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-white">Information Collected</h2>
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
          <h2 className="text-lg font-semibold text-white">Analytics and Cookies</h2>
          <p>
            This site does not use cookies, advertising identifiers, or analytics services. Your browsing activity is not tracked across the web.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-white">Third-Party Service Providers</h2>
          <p>
            To deliver this website and handle incoming inquiries, the following third-party services are utilized:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-[var(--text-secondary)]">
            <li>
              <strong className="text-white">GitHub Pages:</strong> Hosts static website files and delivers content. Standard server access logs may be collected by GitHub in accordance with their privacy policy.
            </li>
            <li>
              <strong className="text-white">Resend:</strong> Used solely to process and forward submitted contact form messages directly to pradyumna05@outlook.in.
            </li>
            <li>
              <strong className="text-white">Google Fonts:</strong> Font assets are self-hosted and bundled at build time through Next.js. Your browser does not send requests to Google servers during your visit.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-white">Data Retention</h2>
          <p>
            Messages received through the contact form are retained only as long as necessary to read, evaluate, and reply to your inquiry, typically up to 90 days. Messages are deleted once the conversation is concluded unless required for legitimate ongoing professional correspondence.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-white">Your Rights and Contact Information</h2>
          <p>
            You have the right to request access to any personal information submitted via the contact form, or to request correction or complete deletion of your messages. To make a request, contact:
          </p>
          <p className="font-mono text-sm text-[var(--accent-primary)]">
            pradyumna05@outlook.in
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-white">Governing Law</h2>
          <p>
            This privacy policy is governed by and construed in accordance with the applicable laws of India.
          </p>
        </section>
      </div>
    </div>
  );
}
