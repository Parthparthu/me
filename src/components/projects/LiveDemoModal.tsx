import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ExternalLink, Monitor, Tablet, Smartphone, Lock, RefreshCw } from 'lucide-react';

interface LiveDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  url: string;
}

type DeviceMode = 'desktop' | 'tablet' | 'mobile';

export const LiveDemoModal: React.FC<LiveDemoModalProps> = ({
  isOpen,
  onClose,
  title,
  url,
}) => {
  const [device, setDevice] = useState<DeviceMode>('desktop');
  const [isLoading, setIsLoading] = useState(true);
  const [iframeKey, setIframeKey] = useState(0);

  // Close on ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  // Reset loading on url change
  useEffect(() => {
    setIsLoading(true);
  }, [url, iframeKey]);

  if (!isOpen) return null;

  const getContainerWidth = () => {
    switch (device) {
      case 'mobile':
        return '375px';
      case 'tablet':
        return '768px';
      default:
        return '100%';
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="live-modal-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          backgroundColor: 'rgba(5, 7, 12, 0.85)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 'clamp(12px, 2vw, 32px)',
        }}
      >
        <motion.div
          className="live-modal-window"
          initial={{ scale: 0.94, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.94, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          style={{
            width: '100%',
            maxWidth: '1280px',
            height: '92vh',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#0c0f17',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            boxShadow: '0 32px 80px rgba(0, 0, 0, 0.8), 0 0 40px rgba(79, 107, 255, 0.15)',
            overflow: 'hidden',
          }}
        >
          {/* Browser Chrome Top Bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 18px',
              backgroundColor: '#080a10',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              gap: '12px',
              flexWrap: 'wrap',
            }}
          >
            {/* Traffic Lights + Title */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ display: 'flex', gap: '6px' }}>
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f56', display: 'inline-block' }} />
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#ffbd2e', display: 'inline-block' }} />
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#27c93f', display: 'inline-block' }} />
              </div>
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#f8fafc', marginLeft: '6px' }}>
                {title} · Interactive Live Demo
              </span>
            </div>

            {/* URL Display Bar */}
            <div
              style={{
                flex: 1,
                maxWidth: '460px',
                minWidth: '220px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: 'var(--radius-md)',
                padding: '4px 12px',
                fontSize: '11px',
                fontFamily: 'var(--font-mono)',
                color: 'var(--text-secondary)',
              }}
            >
              <Lock size={11} style={{ color: 'var(--brand-cyan)' }} />
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: '#cbd5e1' }}>
                {url}
              </span>
              <button
                type="button"
                onClick={() => setIframeKey((k) => k + 1)}
                title="Reload preview"
                style={{ background: 'none', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer', padding: 2, marginLeft: 'auto' }}
              >
                <RefreshCw size={11} />
              </button>
            </div>

            {/* Viewport Mode Switcher & Controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ display: 'flex', background: 'rgba(255, 255, 255, 0.05)', borderRadius: 'var(--radius-md)', padding: '2px' }}>
                <button
                  type="button"
                  onClick={() => setDevice('desktop')}
                  title="Desktop View"
                  style={{
                    padding: '5px 8px',
                    borderRadius: 'var(--radius-sm)',
                    border: 'none',
                    background: device === 'desktop' ? 'rgba(79, 107, 255, 0.25)' : 'transparent',
                    color: device === 'desktop' ? '#00f0ff' : 'var(--text-tertiary)',
                    cursor: 'pointer',
                  }}
                >
                  <Monitor size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => setDevice('tablet')}
                  title="Tablet View (768px)"
                  style={{
                    padding: '5px 8px',
                    borderRadius: 'var(--radius-sm)',
                    border: 'none',
                    background: device === 'tablet' ? 'rgba(79, 107, 255, 0.25)' : 'transparent',
                    color: device === 'tablet' ? '#00f0ff' : 'var(--text-tertiary)',
                    cursor: 'pointer',
                  }}
                >
                  <Tablet size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => setDevice('mobile')}
                  title="Mobile View (375px)"
                  style={{
                    padding: '5px 8px',
                    borderRadius: 'var(--radius-sm)',
                    border: 'none',
                    background: device === 'mobile' ? 'rgba(79, 107, 255, 0.25)' : 'transparent',
                    color: device === 'mobile' ? '#00f0ff' : 'var(--text-tertiary)',
                    cursor: 'pointer',
                  }}
                >
                  <Smartphone size={14} />
                </button>
              </div>

              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary"
                style={{ height: '30px', padding: '0 10px', fontSize: '12px', gap: '5px' }}
                title="Open in new window"
              >
                <span>Open Tab</span>
                <ExternalLink size={12} />
              </a>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close modal"
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  padding: '6px',
                  borderRadius: 'var(--radius-sm)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Device Frame Viewport Container */}
          <div
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#040508',
              overflow: 'auto',
              padding: device === 'desktop' ? '0' : '20px',
              position: 'relative',
            }}
          >
            {/* Loading Indicator */}
            {isLoading && (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  backgroundColor: '#0c0f17',
                  zIndex: 2,
                }}
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  style={{
                    width: 32,
                    height: 32,
                    border: '2px solid rgba(0, 240, 255, 0.2)',
                    borderTopColor: '#00f0ff',
                    borderRadius: '50%',
                  }}
                />
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                  Loading {title} Live Production Instance...
                </span>
              </div>
            )}

            {/* Simulated Device Frame Container */}
            <div
              style={{
                width: getContainerWidth(),
                height: '100%',
                maxHeight: device === 'mobile' ? '740px' : device === 'tablet' ? '900px' : '100%',
                transition: 'width 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                boxShadow: device === 'desktop' ? 'none' : '0 20px 60px rgba(0, 0, 0, 0.9), 0 0 0 1px rgba(255, 255, 255, 0.1)',
                borderRadius: device === 'desktop' ? '0' : 'var(--radius-xl)',
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              <iframe
                key={iframeKey}
                src={url}
                title={`${title} Live Demo`}
                onLoad={() => setIsLoading(false)}
                style={{
                  width: '100%',
                  height: '100%',
                  border: 'none',
                  backgroundColor: '#ffffff',
                }}
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
              />
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default LiveDemoModal;
