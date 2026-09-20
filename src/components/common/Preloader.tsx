import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface PreloaderProps {
  onComplete: () => void;
}

const NAME_CHARS = 'PRADYUMNA'.split('');

const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState<number>(0);
  const [visible, setVisible] = useState<boolean>(true);

  useEffect(() => {
    // Respect prefers-reduced-motion
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced) {
      onComplete();
      return;
    }

    // Skip if already loaded this session (safe storage access)
    try {
      if (
        typeof sessionStorage !== 'undefined' &&
        sessionStorage.getItem('portfolio_loaded')
      ) {
        onComplete();
        return;
      }
    } catch {
      // Ignore sessionStorage errors
    }

    // Safety fallback: guaranteed to call onComplete even if interval/animation stalls
    const safetyTimeout = setTimeout(() => {
      onComplete();
    }, 2000);

    // Increment progress: ~7 per 16ms → reaches 100 in ~250ms
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return Math.min(prev + 7.5, 100);
      });
    }, 16);

    return () => {
      clearInterval(interval);
      clearTimeout(safetyTimeout);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Watch progress reaching 100 and trigger exit immediately
  useEffect(() => {
    if (progress < 100) return;

    const exitTimer = setTimeout(() => {
      setVisible(false);

      // Fast exit animation (300ms) then call onComplete
      const completeTimer = setTimeout(() => {
        try {
          if (typeof sessionStorage !== 'undefined') {
            sessionStorage.setItem('portfolio_loaded', '1');
          }
        } catch {
          // Ignore sessionStorage errors
        }
        onComplete();
      }, 320);

      return () => clearTimeout(completeTimer);
    }, 100);

    return () => clearTimeout(exitTimer);
  }, [progress, onComplete]);

  return (
    <>
      {/* Inject fonts via style tag */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@900&family=JetBrains+Mono:wght@400&display=swap');

        .preloader-root {
          position: fixed;
          inset: 0;
          z-index: 9999;
          background: #06080d;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .preloader-name {
          font-size: clamp(2.5rem, 8vw, 6rem);
          font-weight: 900;
          letter-spacing: -0.04em;
          color: #f1f3f9;
          font-family: 'Inter', sans-serif;
          display: flex;
          flex-wrap: nowrap;
          white-space: nowrap;
          gap: 2px;
          line-height: 1;
          user-select: none;
        }

        .preloader-subtitle {
          font-size: clamp(0.75rem, 1.5vw, 0.875rem);
          font-family: 'JetBrains Mono', monospace;
          color: #3f465e;
          margin-top: 16px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          user-select: none;
        }

        .preloader-bar-container {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: rgba(255, 255, 255, 0.06);
        }

        .preloader-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #5b7cf6, #06b6d4);
          border-radius: 0 1px 1px 0;
        }

        .preloader-counter {
          position: absolute;
          top: 32px;
          right: 32px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          color: #3f465e;
          user-select: none;
          letter-spacing: 0.05em;
        }
      `}</style>

      <AnimatePresence>
        {visible && (
          <motion.div
            className="preloader-root"
            key="preloader"
            initial={{ y: 0 }}
            exit={{
              y: '-100vh',
              transition: {
                duration: 0.7,
                ease: [0.76, 0, 0.24, 1],
              },
            }}
          >
            {/* Percentage counter — top right */}
            <div className="preloader-counter" aria-hidden="true">
              {Math.floor(progress).toString().padStart(3, '0')}
            </div>

            {/* Name with staggered character reveal */}
            <div className="preloader-name" aria-label="PRADYUMNA">
              {NAME_CHARS.map((char, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, y: 20, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    delay: index * 0.06,
                    type: 'spring',
                    stiffness: 300,
                    damping: 20,
                  }}
                >
                  {char}
                </motion.span>
              ))}
            </div>

            {/* Subtitle */}
            <motion.p
              className="preloader-subtitle"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: NAME_CHARS.length * 0.06 + 0.15,
                duration: 0.6,
                ease: 'easeOut',
              }}
              aria-label="CSE · AI/ML · Developer"
            >
              CSE · AI/ML · Developer
            </motion.p>

            {/* Progress bar */}
            <div className="preloader-bar-container" aria-hidden="true">
              <motion.div
                className="preloader-bar-fill"
                style={{ width: `${progress}%` }}
                transition={{ ease: 'linear' }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Preloader;
