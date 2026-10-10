export interface Skill {
  name: string;
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
      { name: 'TypeScript', verifiedIn: ['Oweo', 'Numora', 'InsiderTracker', 'CodeClash AI'] },
      { name: 'Python', verifiedIn: ['InsiderTracker', 'Stock Screener', 'BilingSystem', 'DSA'] },
      { name: 'JavaScript', verifiedIn: ['Oweo', 'Numora', 'BreakoutScanner'] },
      { name: 'SQL', verifiedIn: ['BilingSystem', 'CodeClash AI', 'AURA'] },
      { name: 'HTML/CSS', verifiedIn: ['Oweo', 'Numora', 'AURA'] },
    ],
  },
  {
    id: 'frontend',
    title: 'Frontend Architecture',
    icon: 'Layout',
    skills: [
      { name: 'React', verifiedIn: ['Oweo', 'Numora', 'InsiderTracker', 'Stock Screener'] },
      { name: 'Next.js', verifiedIn: ['CodeClash AI', 'AURA'] },
      { name: 'Three.js / WebGL', verifiedIn: ['Numora', 'BreakoutScanner', 'Portfolio'] },
      { name: 'Framer Motion', verifiedIn: ['Oweo', 'Numora', 'Portfolio'] },
      { name: 'Tailwind CSS', verifiedIn: ['CodeClash AI', 'AURA', 'Portfolio'] },
    ],
  },
  {
    id: 'backend',
    title: 'Backend & Systems',
    icon: 'Server',
    skills: [
      { name: 'FastAPI', verifiedIn: ['InsiderTracker', 'Stock Screener', 'CodeClash AI'] },
      { name: 'Node.js / Express', verifiedIn: ['BreakoutScanner'] },
      { name: 'WebSocket', verifiedIn: ['Stock Screener', 'CodeClash AI'] },
      { name: 'REST API Design', verifiedIn: ['InsiderTracker', 'CodeClash AI', 'Stock Screener'] },
      { name: 'Firebase', verifiedIn: ['Oweo'] },
    ],
  },
  {
    id: 'databases',
    title: 'Databases & State',
    icon: 'Database',
    skills: [
      { name: 'Supabase (PostgreSQL)', verifiedIn: ['CodeClash AI'] },
      { name: 'SQLite', verifiedIn: ['BilingSystem', 'AURA'] },
      { name: 'Firestore', verifiedIn: ['Oweo'] },
      { name: 'Zustand', verifiedIn: ['Oweo', 'Stock Screener'] },
      { name: 'IndexedDB', verifiedIn: ['Oweo'] },
    ],
  },
  {
    id: 'ai-ml',
    title: 'AI/ML & Foundations',
    icon: 'Brain',
    skills: [
      { name: 'Machine Learning Fundamentals', verifiedIn: ['Coursework'] },
      { name: 'Natural Language Processing', verifiedIn: ['Coursework'] },
      { name: 'Data Structures & Algorithms', verifiedIn: ['DSA', 'CodeClash AI'] },
      { name: 'NumPy / Pandas', verifiedIn: ['Stock Screener', 'Coursework'] },
      { name: 'Computer Vision Basics', verifiedIn: ['Coursework'] },
    ],
  },
  {
    id: 'devtools',
    title: 'DevTools & DevOps',
    icon: 'Wrench',
    skills: [
      { name: 'Git / GitHub', verifiedIn: ['All Projects'] },
      { name: 'Docker', verifiedIn: ['Stock Screener'] },
      { name: 'Vite', verifiedIn: ['Oweo', 'Numora', 'Portfolio'] },
      { name: 'CI/CD (GitHub Actions)', verifiedIn: ['Portfolio'] },
      { name: 'Linux / Shell', verifiedIn: ['All Projects'] },
    ],
  },
];
