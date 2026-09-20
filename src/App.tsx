import React, { useEffect, useState, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Layout } from './components/layout/Layout';
import { HomePage } from './pages/HomePage';
import { NotFoundPage } from './pages/NotFoundPage';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import Preloader from './components/common/Preloader';
import CustomCursor from './components/common/CustomCursor';
import { BackToTop } from './components/common/BackToTop';
import { SmoothScrollProvider } from './components/common/SmoothScrollProvider';
import { InteractiveBackground } from './components/3d/InteractiveBackground';

// Code-split routes for optimal First Contentful Paint and minimal initial bundle size
const ProjectsPage = lazy(() => import('./pages/ProjectsPage').then((m) => ({ default: m.ProjectsPage })));
const ProjectDetailPage = lazy(() => import('./pages/ProjectDetailPage').then((m) => ({ default: m.ProjectDetailPage })));

const RouteLoadingFallback: React.FC = () => (
  <div
    style={{
      minHeight: '50vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'var(--text-tertiary)',
      fontSize: 'var(--text-sm)'
    }}
    aria-label="Loading page content..."
  >
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
      <span
        style={{
          width: '8px',
          height: '8px',
          borderRadius: 'var(--radius-full)',
          backgroundColor: 'var(--accent-primary)'
        }}
        className="animate-status-pulse"
      />
      <span>Loading content...</span>
    </div>
  </div>
);

// Helper component to scroll to top or hash on route changes
const ScrollManager: React.FC = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = hash.replace('#', '');
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname, hash]);

  return null;
};

// Shared page transition wrapper applied to every route element
const PageTransition: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -8 }}
    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
  >
    {children}
  </motion.div>
);

// AnimatePresence must live inside BrowserRouter so useLocation is available
const RoutesWithAnimation: React.FC = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><HomePage /></PageTransition>} />
        <Route
          path="/projects"
          element={
            <PageTransition>
              <Suspense fallback={<RouteLoadingFallback />}>
                <ProjectsPage />
              </Suspense>
            </PageTransition>
          }
        />
        <Route
          path="/projects/:slug"
          element={
            <PageTransition>
              <Suspense fallback={<RouteLoadingFallback />}>
                <ProjectDetailPage />
              </Suspense>
            </PageTransition>
          }
        />
        <Route path="*" element={<PageTransition><NotFoundPage /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
};

const getBasename = (): string => {
  const base = import.meta.env.BASE_URL;
  if (!base || base === './' || base === '.') return '/';
  return base.endsWith('/') && base.length > 1 ? base.slice(0, -1) : base;
};

export const App: React.FC = () => {
  const [appReady, setAppReady] = useState(false);

  // Set fine-pointer class on body so CSS cursor:none activates correctly
  // This must happen early before CustomCursor renders
  useEffect(() => {
    const mq = window.matchMedia('(pointer: fine)');
    if (mq.matches) {
      document.body.classList.add('fine-pointer');
    }
    const handler = (e: MediaQueryListEvent) => {
      document.body.classList.toggle('fine-pointer', e.matches);
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return (
    <ErrorBoundary>
      {/* CustomCursor renders on all devices; it handles touch-device detection internally */}
      <CustomCursor />

      {/* Global Interactive Background: Dynamic Constellation & Nebula */}
      <InteractiveBackground />

      {/* Preloader handles sessionStorage skip logic + prefers-reduced-motion internally */}
      {!appReady && <Preloader onComplete={() => setAppReady(true)} />}

      {appReady && (
        <SmoothScrollProvider>
          <BrowserRouter basename={getBasename()}>
            <ScrollManager />
            <Layout>
              <RoutesWithAnimation />
            </Layout>
            <BackToTop />
          </BrowserRouter>
        </SmoothScrollProvider>
      )}
    </ErrorBoundary>
  );
};
