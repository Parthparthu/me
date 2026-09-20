import React from 'react';
import { SEO } from '../components/common/SEO';
import { HeroSection } from '../components/sections/HeroSection';
import { SelectedWork } from '../components/sections/SelectedWork';
import { AboutSection } from '../components/sections/AboutSection';
import { SkillsSection } from '../components/sections/SkillsSection';
import { JourneySection } from '../components/sections/JourneySection';
import { AchievementsSection } from '../components/sections/AchievementsSection';
import { CurrentlyBuilding } from '../components/sections/CurrentlyBuilding';
import { GitHubSection } from '../components/sections/GitHubSection';
import { ContactSection } from '../components/sections/ContactSection';

export const HomePage: React.FC = () => {
  return (
    <>
      <SEO
        title="Pradyumna | CSE (AI/ML) · Software Developer · Product Builder"
        description="Engineering portfolio and architectural case studies of Pradyumna, B.Tech CSE (AI/ML) student at GL Bajaj ITM. Specializing in high-performance web systems and client-side engines."
      />
      <HeroSection />
      <SelectedWork />
      <AboutSection />
      <SkillsSection />
      <JourneySection />
      <AchievementsSection />
      <CurrentlyBuilding />
      <GitHubSection />
      <ContactSection />
    </>
  );
};
