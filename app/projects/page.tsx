import { Metadata } from 'next';
import ProjectsPageClient from './ProjectsPageClient';

export const metadata: Metadata = {
  title: 'Projects | Pradyumna',
  description: 'A catalog of my software engineering projects, including full-stack applications, distributed systems, and real-time tools.',
};

export default function ProjectsPage() {
  return (
    <div className="min-h-screen pt-24 pb-20 bg-[var(--bg-app)]">
      <ProjectsPageClient />
    </div>
  );
}
