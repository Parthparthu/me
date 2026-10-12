import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  className?: string;
}

export function SkillIcon({ name, size = 18, className = '', ...props }: { name: string } & IconProps) {
  const norm = name.toLowerCase().replace(/[^a-z0-9]/g, '');

  switch (norm) {
    case 'python':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
          <path d="M12 2C6.477 2 6 4.5 6 4.5V8h6v1H4.5S2 9.5 2 15s2.5 5.5 4.5 5.5H8v-3.5a2.5 2.5 0 0 1 2.5-2.5h7a2 2 0 0 0 2-2V8s0-6-7.5-6H12z" />
          <path d="M12 22c5.523 0 6-2.5 6-2.5V16h-6v-1h7.5s2.5-.5 2.5-6-2.5-5.5-4.5-5.5H16v3.5a2.5 2.5 0 0 1-2.5 2.5h-7a2 2 0 0 0-2 2V16s0 6 7.5 6H12z" />
          <circle cx="9" cy="5.5" r="1" fill="currentColor" />
          <circle cx="15" cy="18.5" r="1" fill="currentColor" />
        </svg>
      );
    case 'javascript':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
          <rect width="18" height="18" x="3" y="3" rx="3" />
          <path d="M9 12v4.5a1.5 1.5 0 0 1-3 0" />
          <path d="M14 12.5c.5-.5 1.2-.8 2-.8 1.5 0 2.5 1 2.5 2.4 0 1.6-1.2 2.2-2.5 2.6-1.2.4-2 .8-2 2.3 0 1.5 1.1 2.5 2.5 2.5 1.1 0 2-.5 2.5-1.2" />
        </svg>
      );
    case 'html5css3':
    case 'html':
    case 'css':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
          <path d="m4 3 1.5 17L12 22l6.5-2L20 3H4z" />
          <path d="M7 7.5h10l-.5 5H8l.2 2.5 3.8 1 3.8-1 .3-3" />
        </svg>
      );
    case 'c':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
          <path d="M16 6a8 8 0 1 0 0 12" />
        </svg>
      );
    case 'sql':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
          <ellipse cx="12" cy="5" rx="9" ry="3" />
          <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
          <path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3" />
        </svg>
      );
    case 'react':
    case 'react19':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
          <ellipse cx="12" cy="12" rx="10" ry="4.5" transform="rotate(0 12 12)" />
          <ellipse cx="12" cy="12" rx="10" ry="4.5" transform="rotate(60 12 12)" />
          <ellipse cx="12" cy="12" rx="10" ry="4.5" transform="rotate(120 12 12)" />
          <circle cx="12" cy="12" r="1.5" fill="currentColor" />
        </svg>
      );
    case 'typescript':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
          <rect width="18" height="18" x="3" y="3" rx="3" />
          <path d="M7 8h6M10 8v9" />
          <path d="M14 13.5c.4-.4 1-.7 1.7-.7 1.2 0 2 .8 2 2 0 1.4-1 1.9-2 2.2-1 .3-1.7.7-1.7 1.9 0 1.2.9 2.1 2.2 2.1.9 0 1.6-.4 2-1" />
        </svg>
      );
    case 'nextjs':
    case 'nextjs15':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
          <circle cx="12" cy="12" r="10" />
          <path d="M8 8v8l8.5-9" />
          <path d="M16 11.5V16" />
        </svg>
      );
    case 'vite':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
          <path d="m12 2 9 4-3 15-6 3-6-3-3-15 9-4z" />
          <path d="m14 6-5 7h4l-3 6 7-8h-4l3-5z" fill="currentColor" stroke="none" />
        </svg>
      );
    case 'tailwindcss':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
          <path d="M6 12c.5-2.5 2-4 4.5-4.5 3.5-.7 4.5 1.5 6 1.8 1.5.3 3-.7 3.5-2.3-1 2.5-2.5 4-5 4.5-3.5.7-4.5-1.5-6-1.8-1.5-.3-2.5.7-3 2.3z" />
          <path d="M2 17c.5-2.5 2-4 4.5-4.5 3.5-.7 4.5 1.5 6 1.8 1.5.3 3-.7 3.5-2.3-1 2.5-2.5 4-5 4.5-3.5.7-4.5-1.5-6-1.8-1.5-.3-2.5.7-3 2.3z" />
        </svg>
      );
    case 'threejs':
    case 'threejsr3f':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
          <path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3z" />
          <path d="m12 12 8-4.5M12 12v9M12 12 4 7.5" />
        </svg>
      );
    case 'framermotion':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
          <path d="M4 3h16l-8 9zM4 12h8l-8 9zM12 12h8l-8 9z" fill="currentColor" stroke="none" opacity="0.8" />
        </svg>
      );
    case 'gsap':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
          <circle cx="12" cy="12" r="9" />
          <path d="m10 8 5 4-5 4V8z" fill="currentColor" />
        </svg>
      );
    case 'recharts':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
          <path d="M3 3v18h18" />
          <path d="m7 15 4-5 4 3 5-7" />
        </svg>
      );
    case 'fastapi':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
          <circle cx="12" cy="12" r="10" />
          <path d="m13 6-5 7h4l-2 5 7-8h-4l2-4z" fill="currentColor" stroke="none" />
        </svg>
      );
    case 'express':
    case 'expressnodejs':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
          <path d="m12 2 8 4.5v9L12 20l-8-4.5v-9L12 2z" />
          <path d="M9 10h6M9 14h6" />
        </svg>
      );
    case 'websockets':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
          <path d="m4 9 4-4 4 4" />
          <path d="M8 5v9a4 4 0 0 0 8 0V5" />
          <path d="m16 9 4-4 4 4" />
        </svg>
      );
    case 'tkinter':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
          <rect width="18" height="14" x="3" y="4" rx="2" />
          <path d="M3 8h18M7 6h.01M10 6h.01" />
        </svg>
      );
    case 'sqlite':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
          <ellipse cx="12" cy="6" rx="8" ry="3" />
          <path d="M4 6v6c0 1.66 3.58 3 8 3s8-1.34 8-3V6" />
          <path d="M4 12v6c0 1.66 3.58 3 8 3s8-1.34 8-3v-6" />
        </svg>
      );
    case 'indexeddb':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
          <rect width="18" height="18" x="3" y="3" rx="2" />
          <path d="M3 9h18M9 21V9" />
        </svg>
      );
    case 'firebase':
    case 'firebasefirestore':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
          <path d="m4.5 17.5 3-13.5 3.5 6-3 4z" />
          <path d="m11 10 2.5-4.5 6 12-15 0z" />
        </svg>
      );
    case 'zustand':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
          <circle cx="8" cy="8" r="3" />
          <circle cx="16" cy="16" r="3" />
          <path d="M10 10l4 4" />
        </svg>
      );
    case 'git':
    case 'gitgithub':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
          <circle cx="6" cy="6" r="3" />
          <circle cx="6" cy="18" r="3" />
          <circle cx="18" cy="12" r="3" />
          <path d="M6 9v6M9 6h3a3 3 0 0 1 3 3v3M9 18h3a3 3 0 0 0 3-3v-3" />
        </svg>
      );
    case 'githubactions':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
          <path d="m12 2 3 5 6 .5-4.5 4 1.5 6-6-3.5-6 3.5 1.5-6L3 7.5 9 7z" />
        </svg>
      );
    case 'vitest':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
          <path d="m4 4 8 16L20 4" />
          <path d="m8 4 4 8 4-8" />
        </svg>
      );
    case 'vscode':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
          <path d="m18 3-7 6.5-4-3.5-3 2v10l3 2 4-3.5L18 21l3-1.5V4.5L18 3z" />
        </svg>
      );
    case 'aimlfundamentals':
    case 'aiml':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
          <path d="M12 2a4 4 0 0 1 4 4c0 1.5-.8 2.8-2 3.5v1.5h-4v-1.5A4 4 0 0 1 12 2z" />
          <path d="M9 15h6v4H9zM10 19h4v3h-4z" />
          <path d="M4 11a3 3 0 0 1 3-3h1M16 8h1a3 3 0 0 1 3 3" />
        </svg>
      );
    case 'datastructuresalgorithms':
    case 'dsa':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
          <rect width="6" height="6" x="9" y="3" rx="1" />
          <rect width="6" height="6" x="3" y="15" rx="1" />
          <rect width="6" height="6" x="15" y="15" rx="1" />
          <path d="M12 9v3M6 15v-3h12v3" />
        </svg>
      );
    case 'linuxbasics':
    case 'linux':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
          <path d="M4 17l6-6-6-6M12 19h8" />
        </svg>
      );
    case 'cloudnetworkbasics':
    case 'network':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
          <circle cx="12" cy="12" r="10" />
          <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
      );
    default:
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
          <circle cx="12" cy="12" r="8" />
          <path d="m10 12 4-2v4l-4-2z" />
        </svg>
      );
  }
}
