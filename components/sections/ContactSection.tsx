/**
 * ContactSection: Liquid Glass contact form with serverless delivery.
 * Validates on submit, prevents spam, and provides direct social links.
 */
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Github, Linkedin, Instagram, Mail, CheckCircle2, AlertCircle, Loader2, ChevronRight } from 'lucide-react';
import { socials } from '@/data/socials';
import { LiquidGlass } from '@/components/glass/LiquidGlass';
import { GlassInput, GlassTextarea, GlassButton } from '@/components/glass/GlassVariants';
import { ContactSettling } from '@/components/parallax';

const SPRING = { type: 'spring', stiffness: 280, damping: 28 } as const;

export function ContactSection() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '', honeypot: '' });
  const [fieldErrors, setFieldErrors] = useState<{ name?: string; email?: string; message?: string }>({});
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name as keyof typeof fieldErrors]) {
      setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = () => {
    const errors: { name?: string; email?: string; message?: string } = {};
    const trimmedName = formData.name.trim();
    const trimmedEmail = formData.email.trim();
    const trimmedMessage = formData.message.trim();

    if (!trimmedName) {
      errors.name = 'Please enter your name.';
    } else if (trimmedName.length < 2) {
      errors.name = 'Name must be at least 2 characters.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!trimmedEmail) {
      errors.email = 'Please enter your email address.';
    } else if (!emailRegex.test(trimmedEmail)) {
      errors.email = 'Please enter a valid email address.';
    }

    if (!trimmedMessage) {
      errors.message = 'Please enter your message.';
    } else if (trimmedMessage.length < 10) {
      errors.message = 'Message must be at least 10 characters long.';
    }

    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Spam honeypot check
    if (formData.honeypot) {
      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '', honeypot: '' });
      return;
    }

    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setStatus('error');
      setErrorMessage('Please correct the highlighted fields before submitting.');

      // Focus first field with an error
      if (errors.name) {
        document.getElementById('contact-name')?.focus();
      } else if (errors.email) {
        document.getElementById('contact-email')?.focus();
      } else if (errors.message) {
        document.getElementById('contact-message')?.focus();
      }
      return;
    }

    setStatus('submitting');
    setErrorMessage('');
    setFieldErrors({});

    const formspreeId = process.env.NEXT_PUBLIC_FORMSPREE_ID;
    const web3FormsKey = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;

    try {
      if (formspreeId) {
        const res = await fetch(`https://formspree.io/f/${formspreeId}`, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: formData.name.trim(),
            email: formData.email.trim(),
            subject: formData.subject.trim() || undefined,
            message: formData.message.trim(),
          }),
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => null);
          throw new Error(errData?.error || 'Failed to submit via Formspree.');
        }
      } else if (web3FormsKey) {
        const res = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            access_key: web3FormsKey,
            name: formData.name.trim(),
            email: formData.email.trim(),
            subject: formData.subject.trim() || 'Portfolio Inquiry',
            message: formData.message.trim(),
          }),
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => null);
          throw new Error(errData?.message || 'Failed to submit via Web3Forms.');
        }
      } else {
        // Fallback for static hosting without third-party form provider key:
        // Launch user mail client with pre-filled message
        const mailSubject = encodeURIComponent(
          formData.subject.trim() || `Portfolio Inquiry from ${formData.name.trim()}`
        );
        const mailBody = encodeURIComponent(
          `Name: ${formData.name.trim()}\nEmail: ${formData.email.trim()}\n\nMessage:\n${formData.message.trim()}`
        );
        window.location.href = `mailto:pradyumna05@outlook.in?subject=${mailSubject}&body=${mailBody}`;
      }

      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '', honeypot: '' });

      setTimeout(() => {
        setStatus('idle');
      }, 7000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unable to send message right now.';
      // Fallback on error: trigger mailto
      const mailSubject = encodeURIComponent(
        formData.subject.trim() || `Portfolio Inquiry from ${formData.name.trim()}`
      );
      const mailBody = encodeURIComponent(
        `Name: ${formData.name.trim()}\nEmail: ${formData.email.trim()}\n\nMessage:\n${formData.message.trim()}`
      );
      window.location.href = `mailto:pradyumna05@outlook.in?subject=${mailSubject}&body=${mailBody}`;

      setStatus('error');
      setErrorMessage(`${msg} Opening default email client as fallback.`);
    }
  };

  return (
    <section
      id="contact"
      className="py-24 px-4 md:px-8 max-w-6xl mx-auto w-full scroll-mt-24"
      aria-label="Contact Pradyumna"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={SPRING}
        className="mb-14"
      >
        <span className="section-label">
          <span aria-hidden="true">#</span>
          Contact
        </span>
        <h2 className="section-title text-[var(--text-primary)] mt-1">
          Get in Touch
        </h2>
        <p className="section-subtitle mt-2">
          Open to software engineering internships, technical collaborations, and project discussions.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Contact Form with Settling Physics */}
        <ContactSettling side="left" className="lg:col-span-7">
          <LiquidGlass
            elevation={3}
            tint="neutral"
            radius={14}
            className="p-6 md:p-8"
          >
            <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
              {/* Anti-spam Honeypot field */}
              <div className="hidden" aria-hidden="true" style={{ display: 'none' }}>
                <label htmlFor="contact-honeypot">Leave this field blank</label>
                <input
                  type="text"
                  id="contact-honeypot"
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
                  placeholder="e.g. Alex Chen…"
                  value={formData.name}
                  onChange={handleChange}
                  error={fieldErrors.name}
                  required
                  autoComplete="name"
                />

                <GlassInput
                  id="contact-email"
                  name="email"
                  type="email"
                  label="Email Address"
                  placeholder="e.g. alex@example.com…"
                  value={formData.email}
                  onChange={handleChange}
                  error={fieldErrors.email}
                  required
                  autoComplete="email"
                  inputMode="email"
                  spellCheck={false}
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
                error={fieldErrors.message}
                required
                onKeyDown={(e) => {
                  if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
                    handleSubmit(e);
                  }
                }}
              />

              {/* Status alerts */}
              <AnimatePresence>
                {status === 'error' && errorMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="p-3.5 rounded-lg bg-red-500/15 border border-red-500/30 text-red-700 dark:text-red-300 text-sm flex items-center gap-2"
                    role="alert"
                    aria-live="polite"
                  >
                    <AlertCircle size={16} className="flex-shrink-0" aria-hidden="true" />
                    <span>{errorMessage}</span>
                  </motion.div>
                )}

                {status === 'success' && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="p-3.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-sm flex items-center gap-2"
                    role="status"
                    aria-live="polite"
                  >
                    <CheckCircle2 size={16} className="flex-shrink-0" aria-hidden="true" />
                    <span>Message received! Thank you for reaching out: I will respond promptly.</span>
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
                      <Loader2 size={16} className="animate-spin" aria-hidden="true" />
                      <span>Send Message</span>
                    </>
                  ) : (
                    <>
                      <Send size={16} aria-hidden="true" />
                      <span>Send Message</span>
                    </>
                  )}
                </GlassButton>
              </div>
            </form>
          </LiquidGlass>
        </ContactSettling>

        {/* Socials & Info Column with Settling Physics */}
        <ContactSettling side="right" className="lg:col-span-5 flex flex-col gap-4">
          {/* Quick Connect card */}
          <LiquidGlass
            elevation={2}
            tint="neutral"
            radius={14}
            className="p-6 md:p-7"
          >
            <h3 className="text-lg font-display font-bold text-[var(--text-primary)] mb-2">
              Direct Channels
            </h3>
            <p className="text-sm text-[var(--text-tertiary)] leading-relaxed mb-6">
              Prefer asynchronous direct communication? Reach out directly via GitHub, LinkedIn, Instagram, or Email.
            </p>

            <div className="rounded-[var(--radius-sm)] border border-[var(--separator)] bg-[var(--bg-grouped)] overflow-hidden divide-y divide-[var(--separator)]">
              {socials.map((social) => {
                const icon =
                  social.platform === 'GitHub'
                    ? Github
                    : social.platform === 'LinkedIn'
                    ? Linkedin
                    : social.platform === 'Instagram'
                    ? Instagram
                    : Mail;
                const Icon = icon;

                return (
                  <a
                    key={social.platform}
                    href={social.url}
                    target={social.platform === 'Email' ? undefined : '_blank'}
                    rel={social.platform === 'Email' ? undefined : 'noopener noreferrer'}
                    className="group flex items-center justify-between p-3.5 hover:bg-[var(--bg-hover)] transition-colors min-h-[48px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--focus-ring)]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-[var(--radius-xs)] bg-[var(--bg-secondary)] text-[var(--accent)] group-hover:text-[var(--accent-hover)] transition-colors">
                        <Icon size={18} aria-hidden="true" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-[var(--label-primary)] group-hover:text-[var(--accent)] transition-colors">
                          {social.platform}
                        </div>
                        <div className="text-xs text-[var(--label-tertiary)] font-mono truncate max-w-[200px]">
                          {social.label}
                        </div>
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-[var(--label-quaternary)] group-hover:text-[var(--label-secondary)] group-hover:translate-x-0.5 transition-all" aria-hidden="true" />
                  </a>
                );
              })}
            </div>
          </LiquidGlass>
        </ContactSettling>
      </div>
    </section>
  );
}
