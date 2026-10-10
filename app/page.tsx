import { HeroSection } from '@/components/sections/HeroSection';
import { SelectedWork } from '@/components/sections/SelectedWork';
import { AboutSection } from '@/components/sections/AboutSection';
import { SkillsSection } from '@/components/sections/SkillsSection';
import { JourneySection } from '@/components/sections/JourneySection';
import { AchievementsSection } from '@/components/sections/AchievementsSection';
import { CurrentlyBuilding } from '@/components/sections/CurrentlyBuilding';
import { GitHubSection } from '@/components/sections/GitHubSection';
import { LinkedInSection } from '@/components/sections/LinkedInSection';
import { InstagramSection } from '@/components/sections/InstagramSection';
import { ContactSection } from '@/components/sections/ContactSection';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <SelectedWork />
      <AboutSection />
      <SkillsSection />
      <JourneySection />
      <AchievementsSection />
      <CurrentlyBuilding />
      <GitHubSection />
      <LinkedInSection />
      <InstagramSection />
      <ContactSection />
    </>
  );
}
