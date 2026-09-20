/**
 * PROJECT TYPE DEFINITIONS
 * Strict data contracts for all projects and architectural case studies.
 */

export type ProjectCategory = 
  | 'Web / PWA'
  | 'Full-Stack / Systems'
  | 'Real-Time / Financial'
  | 'Software / Tools'
  | 'Algorithms';

export type ProjectTier = 'Tier A' | 'Tier B' | 'Tier C';

export type ProjectStatus = 'Production' | 'Active Development' | 'Completed' | 'Prototype';

export interface CaseStudy {
  problem: string;
  solution: string;
  architecture: string;
  keyFeatures: string[];
  challenges: string[];
  engineeringDecisions: Array<{
    decision: string;
    rationale: string;
    tradeoff?: string;
  }>;
  lessonsLearned: string[];
  futurePlans: string[];
  metrics?: Array<{
    label: string;
    value: string;
  }>;
}

export interface Project {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  shortDescription: string;
  longDescription: string;
  category: ProjectCategory;
  tier: ProjectTier;
  status: ProjectStatus;
  featured: boolean;
  technologies: string[];
  primaryLanguage: string;
  repositoryUrl: string;
  liveUrl?: string;
  role: string;
  date: string;
  caseStudy: CaseStudy;
}
