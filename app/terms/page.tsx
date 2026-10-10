import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Terms and Conditions',
  description: 'Terms and conditions for Pradyuma\'s personal developer portfolio.',
};

export default function TermsPage() {
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
          Terms and Conditions
        </h1>
        <p className="text-sm text-[var(--text-muted)] font-mono mt-2">
          Last Updated: October 2026 (Subject to legal review)
        </p>
      </div>

      <div className="space-y-8 text-[var(--text-secondary)] text-sm md:text-base leading-relaxed bg-[var(--bg-surface)] p-6 md:p-8 rounded-xl border border-[var(--border-subtle)]">
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-white">1. Acceptance of Terms</h2>
          <p>
            By accessing and browsing this portfolio website, you agree to these Terms and Conditions. If you do not agree, please discontinue using the site.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-white">2. Permitted Use</h2>
          <p>
            This website is provided solely for personal, non-commercial informational purposes: to showcase my background, projects, engineering case studies, and to enable professional communication regarding internship or engineering opportunities.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-white">3. Intellectual Property</h2>
          <p>
            All original text, technical write-ups, case study analyses, and design assets on this website are the intellectual property of Pradyuma, unless indicated otherwise.
          </p>
          <p>
            Source code repositories linked from this site (such as on GitHub) are subject to their respective open-source licenses as stated in their repositories. Third-party brand names, trademarks, and logos (such as React, Python, or Next.js) belong to their respective owners.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-white">4. External Links</h2>
          <p>
            This website contains links to external platforms and live project deployments, including GitHub, LinkedIn, and Instagram. I do not control or endorse the content, policies, or practices of external third-party websites.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-white">5. Disclaimer of Warranties</h2>
          <p>
            This website and its contents are provided on an &quot;as is&quot; and &quot;as available&quot; basis without warranties of any kind, either express or implied. I make no guarantee that the site will be error-free, uninterrupted, or that external project demonstrations will remain online indefinitely.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-white">6. Limitation of Liability</h2>
          <p>
            In no event shall Pradyumna be held liable for any direct, indirect, incidental, or consequential damages resulting from the use of or inability to use this website.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-white">7. Governing Law</h2>
          <p>
            These terms are governed by and construed in accordance with the laws of India, without regard to conflict of law principles.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-white">8. Contact</h2>
          <p>
            For any inquiries regarding these terms, please contact:
          </p>
          <p className="font-mono text-sm text-[var(--accent-primary)]">
            pradyumna05@outlook.in
          </p>
        </section>
      </div>
    </div>
  );
}
