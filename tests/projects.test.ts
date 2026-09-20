import { describe, it, expect } from 'vitest';
import { projectsData } from '../src/data/projects';

describe('Project Data Architecture & Integrity', () => {
  it('should have non-empty projects data', () => {
    expect(projectsData.length).toBeGreaterThan(0);
  });

  it('should guarantee unique IDs and slugs across all projects', () => {
    const ids = new Set<string>();
    const slugs = new Set<string>();

    for (const project of projectsData) {
      expect(ids.has(project.id)).toBe(false);
      expect(slugs.has(project.slug)).toBe(false);
      ids.add(project.id);
      slugs.add(project.slug);
    }
  });

  it('should verify all projects have valid repository URLs', () => {
    for (const project of projectsData) {
      expect(project.repositoryUrl).toMatch(/^https:\/\/github\.com\//);
      if (project.liveUrl) {
        expect(project.liveUrl).toMatch(/^https?:\/\//);
      }
    }
  });

  it('should enforce complete case study requirements for all Tier A projects', () => {
    const tierAProjects = projectsData.filter((p) => p.tier === 'Tier A');
    expect(tierAProjects.length).toBeGreaterThanOrEqual(4);

    for (const project of tierAProjects) {
      const { caseStudy } = project;
      expect(caseStudy.problem.trim().length).toBeGreaterThan(20);
      expect(caseStudy.solution.trim().length).toBeGreaterThan(20);
      expect(caseStudy.architecture.trim().length).toBeGreaterThan(20);
      expect(caseStudy.keyFeatures.length).toBeGreaterThanOrEqual(3);
      expect(caseStudy.challenges.length).toBeGreaterThanOrEqual(1);
      expect(caseStudy.engineeringDecisions.length).toBeGreaterThanOrEqual(1);
      expect(caseStudy.lessonsLearned.length).toBeGreaterThanOrEqual(1);
      expect(caseStudy.futurePlans.length).toBeGreaterThanOrEqual(1);
    }
  });

  it('should contain verified technologies for each project', () => {
    for (const project of projectsData) {
      expect(project.technologies.length).toBeGreaterThanOrEqual(2);
      expect(project.primaryLanguage.trim().length).toBeGreaterThan(0);
    }
  });

  it('should guarantee socialsData contains only verified URLs and no unconfigured placeholders', async () => {
    const { socialsData } = await import('../src/data/socials');
    for (const social of socialsData) {
      expect(social.isConfigured).toBe(true);
      expect(social.url).not.toContain('contact@pradyumna.dev');
      expect(social.url).not.toBe('https://linkedin.com/in/pradyumna');
    }
  });
});
