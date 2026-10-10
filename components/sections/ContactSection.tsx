'use client';

import { useState } from 'react';
import { Send, Github, Linkedin, Mail, Instagram, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { LiquidGlass } from '@/components/glass/LiquidGlass';
import { GlassInput, GlassTextarea } from '@/components/glass/GlassVariants';

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    honeypot: '',
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setStatus('error');
      setStatusMessage('Please fill in all required fields.');
      return;
    }

    if (formData.message.trim().length < 10) {
      setStatus('error');
      setStatusMessage('Message must be at least 10 characters long.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      setStatus('error');
      setStatusMessage('Please enter a valid email address.');
      return;
    }

    setStatus('submitting');
    setStatusMessage('');

    try {
      const res = await fetch('/api/contact/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          subject: formData.subject.trim() || undefined,
          message: formData.message.trim(),
          honeypot: formData.honeypot,
        }),
      });

      if (!res.ok) {
        let errorMsg = 'Contact endpoint is unavailable on static hosting. Please email pradyumna05@outlook.in directly.';
        try {
          const data = await res.json();
          if (data && data.message) errorMsg = data.message;
        } catch {
          // Response is non-JSON (e.g. static 404 page)
        }
        throw new Error(errorMsg);
      }

      const data = await res.json();
      setStatus('success');
      setStatusMessage('Your message has been delivered successfully. I will get back to you shortly.');
      setFormData({ name: '', email: '', subject: '', message: '', honeypot: '' });
    } catch (err: unknown) {
      setStatus('error');
      setStatusMessage(
        err instanceof Error
          ? err.message
          : 'Could not send message. Please email pradyumna05@outlook.in directly.'
      );
    }
  };

  return (
    <section
      id="contact"
      className="py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full scroll-mt-24"
      aria-label="Contact information"
    >
      <div className="mb-14">
        <span className="section-label">Contact</span>
        <h2 className="section-title text-[var(--text-primary)] mt-1">
          Initiate Conversation
        </h2>
        <p className="section-subtitle mt-2">
          Open to software engineering internships, technical collaborations, and distributed systems discussions.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Contact Form */}
        <div className="lg:col-span-7">
          <LiquidGlass
            elevation={3}
            tint="neutral"
            radius={12}
            className="p-6 sm:p-8 border border-[var(--border-subtle)]"
          >
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {/* Anti-spam Honeypot (Hidden) */}
              <div className="sr-only" aria-hidden="true">
                <label htmlFor="form-honeypot">Do not fill this field</label>
                <input
                  id="form-honeypot"
                  type="text"
                  name="honeypot"
                  value={formData.honeypot}
                  onChange={handleChange}
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <GlassInput
                  id="contact-name"
                  name="name"
                  label="Your Name"
                  required
                  placeholder="e.g. Alex Smith"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={status === 'submitting'}
                />

                <GlassInput
                  id="contact-email"
                  name="email"
                  type="email"
                  label="Email Address"
                  required
                  placeholder="e.g. alex@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={status === 'submitting'}
                />
              </div>

              <GlassInput
                id="contact-subject"
                name="subject"
                label="Subject"
                placeholder="e.g. Software Engineering Internship Inquiry"
                value={formData.subject}
                onChange={handleChange}
                disabled={status === 'submitting'}
              />

              <GlassTextarea
                id="contact-message"
                name="message"
                label="Message"
                required
                rows={5}
                placeholder="Tell me about your project, team, or opportunity…"
                value={formData.message}
                onChange={handleChange}
                disabled={status === 'submitting'}
              />

              {/* Status Announcements (Polite aria-live) */}
              <div aria-live="polite" aria-atomic="true">
                {status === 'error' && (
                  <div className="p-3 rounded-md bg-amber-500/10 border border-amber-500/25 text-xs text-amber-300 flex items-start gap-2">
                    <AlertCircle size={15} className="mt-0.5 shrink-0" />
                    <span>{statusMessage}</span>
                  </div>
                )}

                {status === 'success' && (
                  <div className="p-3 rounded-md bg-emerald-500/10 border border-emerald-500/25 text-xs text-emerald-300 flex items-start gap-2">
                    <CheckCircle2 size={15} className="mt-0.5 shrink-0" />
                    <span>{statusMessage}</span>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={status === 'submitting'}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] text-white text-sm font-semibold transition-colors disabled:opacity-60 min-h-[44px]"
              >
                {status === 'submitting' ? (
                  <>
                    <Loader2 size={16} className="animate-spin" aria-hidden="true" />
                    <span>Sending Message…</span>
                  </>
                ) : (
                  <>
                    <Send size={15} aria-hidden="true" />
                    <span>Send Inquiry</span>
                  </>
                )}
              </button>
            </form>
          </LiquidGlass>
        </div>

        {/* Right Column: Direct Contact & Social Links */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
          <LiquidGlass
            elevation={2}
            tint="neutral"
            radius={12}
            className="p-6 border border-[var(--border-subtle)] space-y-4"
          >
            <h3 className="text-sm font-mono font-bold text-[var(--text-primary)] uppercase tracking-wider">
              Direct Contact
            </h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Prefer writing directly from your email client? You can reach me directly at:
            </p>
            <a
              href="mailto:pradyumna05@outlook.in"
              className="inline-flex items-center gap-2 text-sm font-mono text-[var(--accent-primary)] hover:underline min-h-[44px]"
            >
              <Mail size={16} />
              <span>pradyumna05@outlook.in</span>
            </a>
          </LiquidGlass>

          {/* Social Links */}
          <div className="space-y-3">
            <p className="text-xs font-mono uppercase tracking-wider text-[var(--text-muted)]">
              Verified Profiles
            </p>

            <a
              href="https://github.com/Parthparthu"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[var(--border-medium)] transition-colors text-sm text-[var(--text-primary)] min-h-[44px]"
            >
              <div className="flex items-center gap-3">
                <Github size={18} className="text-[var(--text-muted)]" />
                <span>GitHub</span>
              </div>
              <span className="font-mono text-xs text-[var(--text-muted)]">@Parthparthu</span>
            </a>

            <a
              href="https://www.linkedin.com/in/pradyumna05"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[var(--border-medium)] transition-colors text-sm text-[var(--text-primary)] min-h-[44px]"
            >
              <div className="flex items-center gap-3">
                <Linkedin size={18} className="text-[var(--text-muted)]" />
                <span>LinkedIn</span>
              </div>
              <span className="font-mono text-xs text-[var(--text-muted)]">pradyumna05</span>
            </a>

            <a
              href="https://www.instagram.com/pradyumna_in_/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[var(--border-medium)] transition-colors text-sm text-[var(--text-primary)] min-h-[44px]"
            >
              <div className="flex items-center gap-3">
                <Instagram size={18} className="text-[var(--text-muted)]" />
                <span>Instagram</span>
              </div>
              <span className="font-mono text-xs text-[var(--text-muted)]">@pradyumna_in_</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
