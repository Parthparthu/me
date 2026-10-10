export interface Skill {
  name: string;
  level: number;
  verifiedIn: string[];
}

export interface SkillCategory {
  id: string;
  title: string;
  icon: string;
  skills: Skill[];
}

export const skillCategories: SkillCategory[] = [
  {
    id: 'core-languages',
    title: 'Core Languages',
    icon: 'Terminal',
    skills: [
      { name: 'TypeScript', level: 4, verifiedIn: ['Oweo', 'Numora', 'InsiderTracker', 'CodeClash AI'] },
      { name: 'Python', level: 4, verifiedIn: ['InsiderTracker', 'Stock Screener', 'BilingSystem', 'DSA'] },
      { name: 'JavaScript', level: 4, verifiedIn: ['Oweo', 'Numora', 'BreakoutScanner'] },
      { name: 'SQL', level: 3, verifiedIn: ['BilingSystem', 'CodeClash AI', 'AURA'] },
      { name: 'HTML/CSS', level: 4, verifiedIn: ['Oweo', 'Numora', 'AURA'] },
    ],
  },
  {
    id: 'frontend',
    title: 'Frontend Architecture',
    icon: 'Layout',
    skills: [
      { name: 'React 19', level: 4, verifiedIn: ['Oweo', 'Numora', 'InsiderTracker', 'Stock Screener'] },
      { name: 'Next.js', level: 3, verifiedIn: ['CodeClash AI', 'AURA'] },
      { name: 'Three.js / R3F', level: 3, verifiedIn: ['Numora', 'BreakoutScanner', 'Portfolio'] },
      { name: 'Framer Motion', level: 3, verifiedIn: ['Oweo', 'Numora', 'Portfolio'] },
      { name: 'Tailwind CSS', level: 4, verifiedIn: ['CodeClash AI', 'AURA', 'Portfolio'] },
    ],
  },
  {
    id: 'backend',
    title: 'Backend & Systems',
    icon: 'Server',
    skills: [
      { name: 'FastAPI', level: 3, verifiedIn: ['InsiderTracker', 'Stock Screener', 'CodeClash AI'] },
      { name: 'Node.js / Express', level: 3, verifiedIn: ['BreakoutScanner'] },
      { name: 'WebSocket', level: 3, verifiedIn: ['Stock Screener', 'CodeClash AI'] },
      { name: 'REST API Design', level: 4, verifiedIn: ['InsiderTracker', 'CodeClash AI', 'Stock Screener'] },
      { name: 'Firebase', level: 3, verifiedIn: ['Oweo'] },
    ],
  },
  {
    id: 'databases',
    title: 'Databases & State',
    icon: 'Database',
    skills: [
      { name: 'Supabase (PostgreSQL)', level: 3, verifiedIn: ['CodeClash AI'] },
      { name: 'SQLite', level: 3, verifiedIn: ['BilingSystem', 'AURA'] },
      { name: 'Firestore', level: 3, verifiedIn: ['Oweo'] },
      { name: 'Zustand', level: 3, verifiedIn: ['Oweo', 'Stock Screener'] },
      { name: 'IndexedDB', level: 3, verifiedIn: ['Oweo'] },
    ],
  },
  {
    id: 'ai-ml',
    title: 'AI/ML & Academic',
    icon: 'Brain',
    skills: [
      { name: 'Machine Learning Fundamentals', level: 3, verifiedIn: ['Coursework'] },
      { name: 'Natural Language Processing', level: 2, verifiedIn: ['Coursework'] },
      { name: 'Data Structures & Algorithms', level: 4, verifiedIn: ['DSA', 'CodeClash AI'] },
      { name: 'NumPy / Pandas', level: 3, verifiedIn: ['Stock Screener', 'Coursework'] },
      { name: 'Computer Vision Basics', level: 2, verifiedIn: ['Coursework'] },
    ],
  },
  {
    id: 'devtools',
    title: 'DevTools & DevOps',
    icon: 'Wrench',
    skills: [
      { name: 'Git / GitHub', level: 4, verifiedIn: ['All Projects'] },
      { name: 'Docker', level: 2, verifiedIn: ['Stock Screener'] },
      { name: 'Vite / Webpack', level: 3, verifiedIn: ['Oweo', 'Numora', 'Portfolio'] },
      { name: 'CI/CD (GitHub Actions)', level: 3, verifiedIn: ['Portfolio'] },
      { name: 'VS Code / Cursor', level: 4, verifiedIn: ['All Projects'] },
    ],
  },
];
