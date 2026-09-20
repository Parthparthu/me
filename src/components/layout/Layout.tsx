import React from 'react';
import { SkipLink } from '../common/SkipLink';
import { Header } from './Header';
import { Footer } from './Footer';
import { CommandPalette } from '../common/CommandPalette';
import { useCommandPalette } from '../../hooks/useCommandPalette';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isOpen, open, close } = useCommandPalette();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <SkipLink />
      <Header onOpenCommandPalette={open} />
      <main id="main-content" tabIndex={-1} style={{ flex: 1, outline: 'none' }}>
        {children}
      </main>
      <Footer />
      <CommandPalette isOpen={isOpen} onClose={close} />
    </div>
  );
};
