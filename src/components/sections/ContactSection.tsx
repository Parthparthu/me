import React, { useState, useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Send, Check, Copy, ExternalLink, Sparkles } from 'lucide-react';
import { GithubIcon } from '../common/Icons';
import { socialsData } from '../../data/socials';
import { SpotlightCard } from '../common/SpotlightCard';

const contactSchema = z.object({
  name:    z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email:   z.string().email({ message: 'Please provide a valid email address.' }),
  subject: z.string().min(3, { message: 'Subject must be at least 3 characters.' }),
  message: z.string().min(10, { message: 'Message must be at least 10 characters.' })
});

type ContactFormData = z.infer<typeof contactSchema>;

const configuredEmail = typeof import.meta !== 'undefined' && import.meta.env?.VITE_CONTACT_EMAIL
  ? String(import.meta.env.VITE_CONTACT_EMAIL).trim()
  : '';

export const ContactSection: React.FC = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema)
  });

  const onSubmit = async (data: ContactFormData) => {
    const targetEmail = configuredEmail || 'contact@example.com';
    const mailtoUrl = `mailto:${targetEmail}?subject=${encodeURIComponent(data.subject)}&body=${encodeURIComponent(`Name: ${data.name}\nEmail: ${data.email}\n\n${data.message}`)}`;
    window.open(mailtoUrl, '_blank');
    setIsSubmitted(true);
    reset();
    setTimeout(() => setIsSubmitted(false), 8000);
  };

  const copyEmail = async () => {
    if (!configuredEmail) return;
    try {
      await navigator.clipboard.writeText(configuredEmail);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 3000);
    } catch {
      // fallback
    }
  };

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="contact-editorial-section section"
      aria-labelledby="contact-title"
    >
      <div className="container">
        {/* Editorial Grand Title */}
        <motion.div
          className="contact-editorial-header"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1, type: 'spring', stiffness: 200, damping: 26 }}
        >
          <div className="section-label">
            <Sparkles size={14} style={{ color: 'var(--neon-cyan)' }} aria-hidden="true" />
            <span className="animate-rainbow-text font-bold">Direct Connection</span>
          </div>

          <h2 id="contact-title" className="contact-grand-title animate-rainbow-text">
            {["LET'S", "BUILD", "SOMETHING."].map((word, i) => (
              <motion.span
                key={word}
                style={{ display: 'inline-block', marginRight: '0.25em' }}
                initial={{ opacity: 0, y: 40, skewY: 4 }}
                animate={isInView ? { opacity: 1, y: 0, skewY: 0 } : {}}
                transition={{ delay: 0.2 + i * 0.1, type: 'spring', stiffness: 200, damping: 22 }}
              >
                {word}
              </motion.span>
            ))}
          </h2>

          <p className="contact-grand-subtitle">
            Have an internship opportunity, systems challenge, or open-source initiative? Let's connect directly.
          </p>
        </motion.div>

        <div className="contact-spatial-grid">
          {/* Left Column: Direct Proof & Outlets */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.35, type: 'spring', stiffness: 200, damping: 26 }}
          >
            <SpotlightCard
              spotlightColor="rgba(0, 240, 255, 0.2)"
              borderColor="rgba(0, 240, 255, 0.45)"
              className="contact-outreach-card"
            >
              <h3 className="outreach-card-title">Verified Channels</h3>
              <p className="outreach-card-desc">
                Currently seeking software engineering &amp; AI/ML internships. The most direct place to review my code or reach out is on GitHub.
              </p>

              {/* GitHub Verified Channel Feature */}
              <motion.a
                href="https://github.com/Parthparthu"
                target="_blank"
                rel="noopener noreferrer"
                className="outreach-github-banner"
                whileHover={{ scale: 1.02, y: -2, borderColor: '#6366f1', boxShadow: '0 0 20px rgba(99, 102, 241, 0.25)' }}
                whileTap={{ scale: 0.99 }}
              >
                <div className="github-banner-icon" aria-hidden="true">
                  <GithubIcon size={22} />
                </div>
                <div className="github-banner-info">
                  <strong className="github-banner-user">@Parthparthu</strong>
                  <span className="github-banner-stat">52 Public Repositories · Active</span>
                </div>
                <ExternalLink size={16} className="github-banner-arrow" aria-hidden="true" />
              </motion.a>

              {/* Configured Email (if present) */}
              {configuredEmail && (
                <div className="outreach-email-row">
                  <code className="outreach-email-val">{configuredEmail}</code>
                  <button
                    type="button"
                    onClick={copyEmail}
                    className="btn btn-secondary"
                    style={{ minHeight: '36px', padding: '0 var(--space-3)', gap: 'var(--space-1-5)' }}
                    aria-label="Copy email address to clipboard"
                  >
                    {copiedEmail ? <Check size={14} aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}
                    <span>{copiedEmail ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              )}

              {/* Other Configured Socials */}
              <div className="outreach-socials-list">
                {socialsData.map((s) => (
                  <motion.a
                    key={s.id}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="outreach-social-item"
                    whileHover={{ x: 4, color: '#38bdf8' }}
                  >
                    <span>{s.platform}: <strong>@{s.username}</strong></span>
                    <ExternalLink size={13} aria-hidden="true" />
                  </motion.a>
                ))}
              </div>
            </SpotlightCard>
          </motion.div>

          {/* Right Column: Direct Message Form */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.45, type: 'spring', stiffness: 200, damping: 26 }}
          >
            <SpotlightCard
              spotlightColor="rgba(255, 45, 117, 0.18)"
              borderColor="rgba(255, 45, 117, 0.45)"
              className="contact-form-card"
            >
              <h3 className="form-card-title">Send a Direct Note</h3>
              <p className="form-card-desc">
                Fill out the form below to prepare an email directly in your default mail client.
              </p>

              {isSubmitted && (
                <div
                  role="status"
                  className="contact-success-banner"
                  aria-live="polite"
                >
                  <Check size={16} aria-hidden="true" />
                  <span>Your default email client is ready with the prepared message.</span>
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} noValidate className="contact-form">
                <div className="form-two-col">
                  <div className="form-field">
                    <label htmlFor="cf-name" className="field-label">Name <span aria-hidden="true">*</span></label>
                    <input
                      id="cf-name"
                      type="text"
                      {...register('name')}
                      aria-invalid={!!errors.name}
                      aria-describedby={errors.name ? 'cf-name-err' : undefined}
                      className={`field-input${errors.name ? ' is-error' : ''}`}
                      placeholder="Your name"
                      autoComplete="name"
                    />
                    {errors.name && (
                      <p id="cf-name-err" role="alert" className="field-error-msg">{errors.name.message}</p>
                    )}
                  </div>

                  <div className="form-field">
                    <label htmlFor="cf-email" className="field-label">Email <span aria-hidden="true">*</span></label>
                    <input
                      id="cf-email"
                      type="email"
                      {...register('email')}
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? 'cf-email-err' : undefined}
                      className={`field-input${errors.email ? ' is-error' : ''}`}
                      placeholder="your@company.com"
                      autoComplete="email"
                    />
                    {errors.email && (
                      <p id="cf-email-err" role="alert" className="field-error-msg">{errors.email.message}</p>
                    )}
                  </div>
                </div>

                <div className="form-field">
                  <label htmlFor="cf-subject" className="field-label">Subject <span aria-hidden="true">*</span></label>
                  <input
                    id="cf-subject"
                    type="text"
                    {...register('subject')}
                    aria-invalid={!!errors.subject}
                    aria-describedby={errors.subject ? 'cf-subject-err' : undefined}
                    className={`field-input${errors.subject ? ' is-error' : ''}`}
                    placeholder="Internship opportunity, collaboration, or question"
                  />
                  {errors.subject && (
                    <p id="cf-subject-err" role="alert" className="field-error-msg">{errors.subject.message}</p>
                  )}
                </div>

                <div className="form-field">
                  <label htmlFor="cf-message" className="field-label">Message <span aria-hidden="true">*</span></label>
                  <textarea
                    id="cf-message"
                    rows={4}
                    {...register('message')}
                    aria-invalid={!!errors.message}
                    aria-describedby={errors.message ? 'cf-message-err' : undefined}
                    className={`field-textarea${errors.message ? ' is-error' : ''}`}
                    placeholder="Tell me about the role, team, or project..."
                  />
                  {errors.message && (
                    <p id="cf-message-err" role="alert" className="field-error-msg">{errors.message.message}</p>
                  )}
                </div>

                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary contact-submit-btn"
                  style={{ width: '100%', justifyContent: 'center' }}
                  whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(255, 45, 117, 0.5), 0 0 60px rgba(0, 240, 255, 0.3)' }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Send size={15} aria-hidden="true" />
                  <span>{isSubmitting ? 'Preparing...' : 'Compose Message'}</span>
                </motion.button>
              </form>
            </SpotlightCard>
          </motion.div>
        </div>
      </div>

      <style>{`
        .contact-editorial-section {
          background: radial-gradient(circle at 50% 100%, rgba(255, 45, 117, 0.08) 0%, rgba(0, 240, 255, 0.05) 40%, var(--bg-surface) 75%);
          border-top: 1px solid var(--border-subtle);
          padding-top: clamp(var(--space-16), 8vw, var(--space-28));
          padding-bottom: clamp(var(--space-16), 8vw, var(--space-28));
        }

        .contact-editorial-header {
          margin-bottom: var(--space-12);
        }

        .contact-grand-title {
          font-size: clamp(2.5rem, 5.5vw, 4.8rem);
          font-weight: 900;
          letter-spacing: var(--tracking-tighter);
          line-height: 1.05;
          margin-bottom: var(--space-3);
        }

        .contact-grand-subtitle {
          font-size: clamp(var(--text-base), 1.5vw, var(--text-lg));
          color: var(--text-secondary);
          max-width: 55ch;
          line-height: var(--leading-relaxed);
        }

        .contact-spatial-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: var(--space-8);
        }

        @media (min-width: 900px) {
          .contact-spatial-grid {
            grid-template-columns: 0.9fr 1.1fr;
            align-items: flex-start;
          }
        }

        /* Outreach Card */
        .contact-outreach-card {
          padding: var(--space-6);
          display: flex;
          flex-direction: column;
          border-radius: var(--radius-xl);
          background-color: var(--bg-surface);
          border: 1px solid var(--border-subtle);
          box-shadow: var(--shadow-spatial);
        }

        .outreach-card-title {
          font-size: var(--text-lg);
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: var(--space-2);
        }

        .outreach-card-desc {
          font-size: var(--text-sm);
          color: var(--text-secondary);
          line-height: var(--leading-relaxed);
          margin-bottom: var(--space-6);
        }

        .outreach-github-banner {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          padding: var(--space-3) var(--space-4);
          background-color: var(--bg-surface-elevated);
          border: 1px solid var(--border-medium);
          border-radius: var(--radius-lg);
          text-decoration: none;
          color: var(--text-primary);
          margin-bottom: var(--space-5);
          transition: border-color var(--duration-fast), background-color var(--duration-fast);
        }

        .github-banner-icon {
          color: var(--neon-cyan);
          flex-shrink: 0;
        }

        .github-banner-info {
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .github-banner-user {
          font-size: var(--text-sm);
          font-weight: 700;
          color: var(--text-primary);
        }

        .github-banner-stat {
          font-size: 11px;
          color: var(--text-tertiary);
          font-family: var(--font-mono);
        }

        .github-banner-arrow {
          color: var(--text-muted);
          transition: transform var(--duration-fast);
        }

        .outreach-email-row {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          margin-bottom: var(--space-5);
          flex-wrap: wrap;
        }

        .outreach-email-val {
          font-family: var(--font-mono);
          font-size: var(--text-xs);
          color: var(--text-primary);
          background-color: var(--bg-app);
          padding: var(--space-2) var(--space-3);
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-subtle);
          flex: 1;
        }

        .outreach-socials-list {
          display: flex;
          flex-direction: column;
          border-top: 1px solid var(--border-subtle);
          padding-top: var(--space-4);
        }

        .outreach-social-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--space-2-5, 0.625rem) 0;
          font-size: var(--text-sm);
          color: var(--text-secondary);
          text-decoration: none;
          border-bottom: 1px solid var(--border-subtle);
          transition: color var(--duration-fast);
        }

        .outreach-social-item:last-child { border-bottom: none; }

        /* Form Card */
        .contact-form-card {
          padding: var(--space-6);
          border-radius: var(--radius-xl);
          background-color: var(--bg-surface);
          border: 1px solid var(--border-subtle);
          box-shadow: var(--shadow-spatial);
        }

        .form-card-title {
          font-size: var(--text-lg);
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: var(--space-1);
        }

        .form-card-desc {
          font-size: var(--text-sm);
          color: var(--text-secondary);
          margin-bottom: var(--space-5);
        }

        .contact-success-banner {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          background-color: rgba(16, 185, 129, 0.15);
          border: 1px solid rgba(16, 185, 129, 0.4);
          color: var(--neon-emerald);
          border-radius: var(--radius-md);
          padding: var(--space-3) var(--space-4);
          font-size: var(--text-sm);
          margin-bottom: var(--space-5);
        }

        .contact-form {
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
        }

        .form-two-col {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--space-4);
        }

        @media (max-width: 500px) {
          .form-two-col { grid-template-columns: 1fr; }
        }

        .form-field {
          display: flex;
          flex-direction: column;
          gap: var(--space-1-5);
        }

        .field-label {
          font-size: var(--text-xs);
          font-weight: 600;
          color: var(--text-primary);
        }

        .field-input,
        .field-textarea {
          width: 100%;
          padding: var(--space-2-5, 0.625rem) var(--space-3);
          background-color: var(--bg-app);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          color: var(--text-primary);
          font-size: var(--text-sm);
          font-family: var(--font-sans);
          transition: border-color var(--duration-fast), box-shadow var(--duration-fast);
          outline: none;
        }

        .field-input { height: 42px; }
        .field-textarea { resize: vertical; line-height: var(--leading-relaxed); }

        .field-input::placeholder,
        .field-textarea::placeholder { color: var(--text-muted); }

        .field-input:focus,
        .field-textarea:focus {
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.25), 0 0 15px rgba(99, 102, 241, 0.15);
        }

        .field-input.is-error {
          border-color: var(--neon-pink);
        }

        .field-error-msg {
          font-size: var(--text-xs);
          color: var(--neon-pink);
          margin: 0;
        }

        .contact-submit-btn {
          background: linear-gradient(135deg, #6366f1 0%, #38bdf8 100%);
          border: none;
          color: #ffffff;
          font-weight: 700;
          box-shadow: 0 4px 20px -2px rgba(99, 102, 241, 0.4);
        }
      `}</style>
    </section>
  );
};

export default ContactSection;
