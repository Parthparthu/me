import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUp, Terminal } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '../common/Icons';
import { Mail } from 'lucide-react';
import { socialsData } from '../../data/socials';
import { motion, useInView } from 'motion/react';

const NAV_LINKS = [
  { label: 'Selected Work', to: '/#projects' },
  { label: 'All Projects', to: '/projects' },
  { label: 'About', to: '/#about' },
  { label: 'Skills', to: '/#skills' },
  { label: 'Journey', to: '/#journey' },
  { label: 'Achievements', to: '/#achievements' },
  { label: 'Contact', to: '/#contact' },
];

export const Footer: React.FC = () => {
  const footerRef = useRef<HTMLElement>(null);
  const isInView = useInView(footerRef, { once: true, amount: 0.1 });

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const getSocialIcon = (iconName: string) => {
    switch (iconName) {
      case 'github': return <GithubIcon size={18} aria-hidden="true" />;
      case 'linkedin': return <LinkedinIcon size={18} aria-hidden="true" />;
      default: return <Mail size={18} aria-hidden="true" />;
    }
  };

  return (
    <footer ref={footerRef} role="contentinfo" className="site-footer">
      <div className="container">
        <motion.div
          className="footer-top"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Brand column */}
          <div className="footer-brand">
            <div className="footer-logo">
              <Terminal size={16} aria-hidden="true" />
            </div>
            <div>
              <div className="footer-name">Pradyumna</div>
              <p className="footer-tagline">
                B.Tech CSE (AI/ML) · GL Bajaj ITM<br />
                Greater Noida, Uttar Pradesh, India
              </p>
              <div className="footer-status">
                <span
                  className="animate-status-pulse"
                  style={{ width: '7px', height: '7px', borderRadius: 'var(--radius-full)', backgroundColor: 'var(--accent-emerald)', flexShrink: 0 }}
                  aria-hidden="true"
                />
                <span>Available for internships &amp; engineering roles</span>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav aria-label="Footer navigation">
            <div className="footer-nav-label">Navigation</div>
            <ul className="footer-nav-list">
              {NAV_LINKS.map(({ label, to }) => (
                <li key={label}>
                  <Link to={to} className="footer-nav-link">{label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Connect */}
          <div>
            <div className="footer-nav-label">Connect</div>
            <div className="footer-socials">
              {socialsData.map((s) => (
                <motion.a
                  key={s.id}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-social-icon touch-target"
                  aria-label={`${s.platform}: ${s.username}`}
                  title={`${s.platform}: ${s.username}`}
                  whileHover={{ scale: 1.15, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {getSocialIcon(s.iconName)}
                </motion.a>
              ))}
            </div>
            <p className="footer-cmd-hint">
              Press <kbd className="footer-kbd">⌘K</kbd> to open Command Palette
            </p>
          </div>
        </motion.div>

        {/* Bottom bar */}
        <div className="footer-bottom">
          <p className="footer-copyright">
            &copy; {new Date().getFullYear()} Pradyumna. Built with React 19, TypeScript &amp; Vite.
          </p>
          <motion.button
            type="button"
            onClick={scrollToTop}
            className="footer-back-top btn btn-ghost"
            aria-label="Back to top of page"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
          >
            <span>Back to top</span>
            <ArrowUp size={14} aria-hidden="true" />
          </motion.button>
        </div>
      </div>

      <style>{`
        .site-footer {
          margin-top: auto;
          border-top: 1px solid var(--border-subtle);
          background-color: var(--bg-surface);
          padding-top: var(--space-12);
          padding-bottom: var(--space-10);
        }

        .footer-top {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(min(100%, 220px), 1fr));
          gap: var(--space-10);
          margin-bottom: var(--space-10);
        }

        .footer-brand {
          display: flex;
          gap: var(--space-3);
          align-items: flex-start;
        }

        .footer-logo {
          width: 32px;
          height: 32px;
          border-radius: var(--radius-md);
          background-color: var(--bg-surface-elevated);
          border: 1px solid var(--border-medium);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--accent-primary);
          flex-shrink: 0;
        }

        .footer-name {
          font-size: var(--text-base);
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: var(--space-1-5);
          letter-spacing: var(--tracking-snug);
        }

        .footer-tagline {
          font-size: var(--text-xs);
          color: var(--text-tertiary);
          line-height: var(--leading-relaxed);
          margin-bottom: var(--space-3);
        }

        .footer-status {
          display: inline-flex;
          align-items: center;
          gap: var(--space-2);
          font-size: var(--text-xs);
          color: var(--accent-emerald);
        }

        .footer-nav-label {
          font-size: var(--text-xs);
          font-weight: 600;
          color: var(--text-primary);
          text-transform: uppercase;
          letter-spacing: var(--tracking-wider);
          margin-bottom: var(--space-3);
        }

        .footer-nav-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
        }

        .footer-nav-link {
          font-size: var(--text-sm);
          color: var(--text-secondary);
          text-decoration: none;
          transition: color var(--duration-fast);
        }

        .footer-nav-link:hover { color: var(--text-primary); }

        .footer-socials {
          display: flex;
          gap: var(--space-2);
          margin-bottom: var(--space-4);
        }

        .footer-social-icon {
          width: 40px;
          height: 40px;
          border-radius: var(--radius-md);
          border: 1px solid var(--border-subtle);
          background-color: var(--bg-surface-elevated);
          color: var(--text-secondary);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          transition: color var(--duration-fast), border-color var(--duration-fast), background-color var(--duration-fast);
        }

        .footer-social-icon:hover {
          color: var(--text-primary);
          border-color: var(--border-medium);
          background-color: var(--bg-surface-hover);
        }

        .footer-cmd-hint {
          font-size: var(--text-xs);
          color: var(--text-muted);
        }

        .footer-kbd {
          display: inline-block;
          background-color: var(--bg-surface-elevated);
          border: 1px solid var(--border-medium);
          border-radius: var(--radius-xs);
          padding: 1px 5px;
          font-family: var(--font-mono);
          font-size: 10px;
          color: var(--text-muted);
        }

        .footer-bottom {
          border-top: 1px solid var(--border-subtle);
          padding-top: var(--space-6);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: var(--space-4);
          flex-wrap: wrap;
        }

        .footer-copyright {
          font-size: var(--text-xs);
          color: var(--text-muted);
          margin: 0;
        }

        .footer-back-top {
          font-size: var(--text-xs);
          min-height: 36px;
          padding: 0 var(--space-3);
          gap: var(--space-1-5);
        }
      `}</style>
    </footer>
  );
};
