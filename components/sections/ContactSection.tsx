/**
 * ContactSection — Liquid Glass contact form with serverless delivery.
 * Posts directly to /api/contact with client-side validation, inline error messaging,
 * and social profiles in glass cards.
 */
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Github, Linkedin, Mail, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { socials } from '@/data/socials';
import { LiquidGlass } from '@/components/glass/LiquidGlass';
import { GlassInput, GlassTextarea, GlassButton } from '@/components/glass/GlassVariants';

const SPRING = { type: 'spring', stiffness: 280, damping: 28 } as const;

export function ContactSection() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setStatus('error');
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    if (formData.message.trim().length < 10) {
      setStatus('error');
      setErrorMessage('Message must be at least 10 characters long.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      setStatus('error');
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setStatus('submitting');
    setErrorMessage('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          subject: formData.subject.trim() || undefined,
          message: formData.message.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to send message.');
      }

      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });

      setTimeout(() => {
        setStatus('idle');
      }, 6000);
    } catch (err: unknown) {
      setStatus('error');
      setErrorMessage(
        err instanceof Error ? err.message : 'An unexpected error occurred. Please try again.'
      );
    }
  };

  return (
    <section
      id="contact"
      className="py-28 px-4 md:px-8 max-w-6xl mx-auto w-full scroll-mt-24"
      aria-label="Contact Pradyumna"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={SPRING}
        className="mb-14"
      >
        <span className="section-label">
          <span aria-hidden="true">◈</span>
          Contact
        </span>
        <h2 className="section-title text-white mt-1">
          Let’s Build Together
        </h2>
        <p className="section-subtitle mt-2">
          Open to software engineering internships, collaborative builds, and technical discussions.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Contact Form */}
        <motion.div
          className="lg:col-span-7"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={SPRING}
        >
          <LiquidGlass
            elevation={3}
            tint="neutral"
            radius={28}
            dynamicLight
            className="p-7 md:p-9"
          >
            <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <GlassInput
                  id="contact-name"
                  name="name"
                  label="Your Name"
                  placeholder="e.g. Satoshi Nakamoto…"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  autoComplete="name"
                />

                <GlassInput
                  id="contact-email"
                  name="email"
                  type="email"
                  label="Email Address"
                  placeholder="e.g. satoshi@bitcoin.org…"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                  inputMode="email"
                />
              </div>

              <GlassInput
                id="contact-subject"
                name="subject"
                label="Subject"
                placeholder="e.g. Internship Inquiry / System Architecture…"
                value={formData.subject}
                onChange={handleChange}
                autoComplete="off"
              />

              <GlassTextarea
                id="contact-message"
                name="message"
                label="Message"
                placeholder="Tell me about your project, team, or opportunity…"
                rows={5}
                value={formData.message}
                onChange={handleChange}
                required
              />

              {/* Status alerts */}
              <AnimatePresence>
                {status === 'error' && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-sm flex items-center gap-2"
                    role="alert"
                    aria-live="polite"
                  >
                    <AlertCircle size={16} className="flex-shrink-0" />
                    <span>{errorMessage}</span>
                  </motion.div>
                )}

                {status === 'success' && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-sm flex items-center gap-2"
                    role="status"
                    aria-live="polite"
                  >
                    <CheckCircle2 size={16} className="flex-shrink-0" />
                    <span>Message received! Thank you for reaching out — I’ll respond promptly.</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit CTA */}
              <div className="pt-2">
                <GlassButton
                  type="submit"
                  variant="primary"
                  disabled={status === 'submitting'}
                  className="w-full sm:w-auto"
                >
                  {status === 'submitting' ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Sending Message…</span>
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      <span>Send Message</span>
                    </>
                  )}
                </GlassButton>
              </div>
            </form>
          </LiquidGlass>
        </motion.div>

        {/* Socials & Info Column */}
        <motion.div
          className="lg:col-span-5 flex flex-col gap-4"
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={SPRING}
        >
          {/* Quick Connect card */}
          <LiquidGlass
            elevation={2}
            tint="neutral"
            radius={24}
            dynamicLight
            className="p-7"
          >
            <h3 className="text-lg font-display font-bold text-white mb-2">
              Direct Channels
            </h3>
            <p className="text-sm text-[var(--text-tertiary)] leading-relaxed mb-6">
              Prefer direct asynchronous communication? Reach out via GitHub, LinkedIn, or Email.
            </p>

            <div className="flex flex-col gap-3">
              {socials.map((social) => {
                const icon =
                  social.platform === 'GitHub'
                    ? Github
                    : social.platform === 'LinkedIn'
                    ? Linkedin
                    : Mail;
                const Icon = icon;

                return (
                  <a
                    key={social.platform}
                    href={social.url}
                    target={social.platform === 'Email' ? undefined : '_blank'}
                    rel={social.platform === 'Email' ? undefined : 'noopener noreferrer'}
                    className="group flex items-center justify-between p-3.5 rounded-xl bg-white/5 border border-white/8 hover:bg-white/10 hover:border-white/15 transition-all min-h-[44px]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-white/6 text-[var(--accent-cyan)] group-hover:text-white transition-colors">
                        <Icon size={18} />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-white group-hover:text-[var(--accent-cyan)] transition-colors">
                          {social.platform}
                        </div>
                        <div className="text-xs text-[var(--text-muted)] truncate max-w-[200px]">
                          {social.label}
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-mono text-[var(--text-muted)] group-hover:translate-x-0.5 transition-transform">
                      →
                    </span>
                  </a>
                );
              })}
            </div>
          </LiquidGlass>
        </motion.div>
      </div>
    </section>
  );
}
