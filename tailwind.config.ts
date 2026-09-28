import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)'],
        display: ['var(--font-display)'],
        mono: ['var(--font-mono)'],
      },
      colors: {
        bg: {
          app: 'var(--bg-app)',
          surface: 'var(--bg-surface)',
          'surface-2': 'var(--bg-surface-2)',
          elevated: 'var(--bg-surface-elevated)',
          glass: 'var(--bg-glass)',
        },
        text: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          tertiary: 'var(--text-tertiary)',
          muted: 'var(--text-muted)',
        },
        accent: {
          primary: 'var(--accent-primary)',
          'primary-hover': 'var(--accent-primary-hover)',
          cyan: 'var(--accent-cyan)',
          emerald: 'var(--accent-emerald)',
          amber: 'var(--accent-amber)',
          rose: 'var(--accent-rose)',
          violet: 'var(--accent-violet)',
        },
        border: {
          subtle: 'var(--border-subtle)',
          medium: 'var(--border-medium)',
          strong: 'var(--border-strong)',
          specular: 'var(--border-specular)',
        },
      },
      borderRadius: {
        xs: '3px',
        sm: '6px',
        md: '8px',
        lg: '12px',
        xl: '16px',
        '2xl': '20px',
        '3xl': '28px',
      },
      maxWidth: {
        prose: '65ch',
        narrow: '860px',
        content: '1200px',
        wide: '1440px',
      },
      zIndex: {
        card: '10',
        dropdown: '50',
        sticky: '100',
        header: '200',
        'modal-backdrop': '300',
        modal: '350',
        'command-palette': '400',
        toast: '500',
        tooltip: '600',
        cursor: '9999',
      },
      keyframes: {
        'status-pulse': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.5', transform: 'scale(1.15)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'gradient-shift': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '33%': { transform: 'translateY(-16px) rotate(2deg)' },
          '66%': { transform: 'translateY(-8px) rotate(-1deg)' },
        },
        'levitate-3d': {
          '0%, 100%': { transform: 'translateY(0) rotateX(0deg) rotateY(0deg)' },
          '25%': { transform: 'translateY(-7px) rotateX(3deg) rotateY(-2deg)' },
          '50%': { transform: 'translateY(-12px) rotateX(-2deg) rotateY(3deg)' },
          '75%': { transform: 'translateY(-5px) rotateX(2deg) rotateY(-1deg)' },
        },
        'radar-pulse': {
          '0%': { transform: 'scale(0.9)', opacity: '0.9', boxShadow: '0 0 0 0 rgba(16, 185, 129, 0.6)' },
          '50%': { transform: 'scale(1.4)', opacity: '0.35', boxShadow: '0 0 0 10px rgba(99, 102, 241, 0.25)' },
          '100%': { transform: 'scale(2)', opacity: '0', boxShadow: '0 0 0 20px rgba(16, 185, 129, 0)' },
        },
        'laser-beam': {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '30%': { opacity: '1' },
          '70%': { opacity: '1' },
          '100%': { transform: 'translateY(1000%)', opacity: '0' },
        },
      },
      animation: {
        'status-pulse': 'status-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        shimmer: 'shimmer 1.5s infinite',
        'gradient-shift': 'gradient-shift 5s ease infinite',
        float: 'float 6s ease-in-out infinite',
        levitate: 'levitate-3d 6s ease-in-out infinite',
        'radar-pulse': 'radar-pulse 2.2s cubic-bezier(0.16, 1, 0.3, 1) infinite',
        'laser-beam': 'laser-beam 3.5s cubic-bezier(0.4, 0, 0.2, 1) infinite',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};

export default config;
