import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUp } from 'lucide-react';

export const BackToTop: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? Math.min(1, Math.max(0, scrollY / docHeight)) : 0;
      setScrollProgress(progress);
      setVisible(scrollY > 320);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    if (window.__lenis) {
      window.__lenis.scrollTo(0, { duration: 1.25 });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - scrollProgress * circumference;

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          onClick={scrollToTop}
          data-cursor-label="TOP"
          className="back-to-top-btn"
          aria-label={`Scroll back to top (${Math.round(scrollProgress * 100)}% scrolled)`}
          title="Back to top"
          initial={{ opacity: 0, scale: 0.7, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.7, y: 16 }}
          whileHover={{ scale: 1.12, boxShadow: '0 0 25px rgba(99, 102, 241, 0.45)' }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        >
          <svg className="progress-ring" width="46" height="46" viewBox="0 0 46 46">
            <defs>
              <linearGradient id="backToTopGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#38bdf8" />
              </linearGradient>
            </defs>
            {/* Background Track */}
            <circle
              className="progress-ring-track"
              cx="23"
              cy="23"
              r={radius}
              strokeWidth="2.5"
            />
            {/* Dynamic Animated Indicator */}
            <circle
              className="progress-ring-fill"
              cx="23"
              cy="23"
              r={radius}
              strokeWidth="2.5"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              stroke="url(#backToTopGrad)"
            />
          </svg>

          <div className="back-to-top-icon-wrapper">
            <ArrowUp size={16} strokeWidth={2.5} className="arrow-icon" />
          </div>

          <style>{`
            .back-to-top-btn {
              position: fixed;
              bottom: 28px;
              right: 28px;
              width: 46px;
              height: 46px;
              border-radius: 50%;
              background: rgba(14, 18, 27, 0.88);
              backdrop-filter: blur(16px);
              -webkit-backdrop-filter: blur(16px);
              border: 1px solid rgba(255, 255, 255, 0.12);
              cursor: pointer;
              z-index: 9900;
              display: flex;
              align-items: center;
              justify-content: center;
              padding: 0;
              box-shadow: 0 8px 32px rgba(0, 0, 0, 0.45);
              outline: none;
            }

            .back-to-top-btn:focus-visible {
              outline: 2px solid #6366f1;
              outline-offset: 3px;
            }

            .progress-ring {
              position: absolute;
              inset: 0;
              transform: rotate(-90deg);
              pointer-events: none;
            }

            .progress-ring-track {
              fill: transparent;
              stroke: rgba(255, 255, 255, 0.08);
            }

            .progress-ring-fill {
              fill: transparent;
              stroke-linecap: round;
              transition: stroke-dashoffset 0.15s ease-out;
            }

            .back-to-top-icon-wrapper {
              display: flex;
              align-items: center;
              justify-content: center;
              color: #f1f3f9;
              transition: transform 0.25s ease, color 0.25s ease;
            }

            .back-to-top-btn:hover .back-to-top-icon-wrapper {
              transform: translateY(-2px);
              color: #38bdf8;
            }

            @media (max-width: 640px) {
              .back-to-top-btn {
                bottom: 20px;
                right: 20px;
                width: 42px;
                height: 42px;
              }
            }
          `}</style>
        </motion.button>
      )}
    </AnimatePresence>
  );
};
