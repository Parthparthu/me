'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setVisible(window.scrollY > 400);
    }
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.9, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 12 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          onClick={scrollToTop}
          type="button"
          className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-11 h-11 rounded-[8px] bg-[var(--bg-surface-raised)] border border-[var(--border-medium)] shadow-lg hover:border-[var(--accent-primary)] hover:text-[var(--text-primary)] transition-colors min-h-[44px] min-w-[44px] cursor-pointer"
          aria-label="Scroll to top of page"
        >
          <ArrowUp size={16} className="text-[var(--text-secondary)]" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
