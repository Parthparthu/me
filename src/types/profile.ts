/**
 * PROFILE & BIOGRAPHY TYPE DEFINITIONS
 */

export interface Education {
  degree: string;
  major: string;
  institution: string;
  location: string;
  period: string;
  description: string;
}

export interface Achievement {
  id: string;
  title: string;
  category: 'Cognitive & Discipline' | 'Academic' | 'Technical';
  organization: string;
  year: string;
  summary: string;
  engineeringRelevance: string;
}

export interface JourneyMilestone {
  id: string;
  year: string;
  period: string;
  title: string;
  description: string;
  technologies: string[];
  keyOutcome: string;
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  username: string;
  iconName: 'github' | 'linkedin' | 'twitter' | 'youtube' | 'mail';
  isConfigured: boolean;
}

export interface Profile {
  name: string;
  preferredName: string;
  title: string;
  shortBio: string;
  fullBio: string[];
  currentStatus: string;
  focusAreas: string[];
  education: Education;
  location: string;
}
