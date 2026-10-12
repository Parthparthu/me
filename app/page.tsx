import { HeroSection } from '@/components/sections/HeroSection';
import { SelectedWork } from '@/components/sections/SelectedWork';
import { AboutSection } from '@/components/sections/AboutSection';
import { SkillsSection } from '@/components/sections/SkillsSection';
import { JourneySection } from '@/components/sections/JourneySection';
import { AchievementsSection } from '@/components/sections/AchievementsSection';
import { CurrentlyBuilding } from '@/components/sections/CurrentlyBuilding';
import { GitHubSection } from '@/components/sections/GitHubSection';
import { ContactSection } from '@/components/sections/ContactSection';
import { SectionCrossfade, SectionSpine, ParallaxDebugOverlay } from '@/components/parallax';

export default function HomePage() {
  return (
    <>
      {/* Dynamic atmospheric background transitions across sections */}
      <SectionCrossfade />

      {/* Vertical continuous accent thread tracking scroll progress */}
      <SectionSpine />

      {/* Core sections */}
      <HeroSection />
      <SelectedWork />
      <AboutSection />
      <SkillsSection />
      <JourneySection />
      <AchievementsSection />
      <CurrentlyBuilding />
      <GitHubSection />
      <ContactSection />

      {/* Dev-only Parallax inspection HUD (?parallax-debug=true) */}
      <ParallaxDebugOverlay />
    </>
  );
}
