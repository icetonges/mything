import { HeroSection } from '@/components/home/HeroSection';
import { TabCards } from '@/components/home/TabCards';
import { TechPulse } from '@/components/home/TechPulse';
import { QuickStats } from '@/components/home/QuickStats';
import { ContactSection } from '@/components/home/ContactSection';
import { AIChatWidget } from '@/components/ai/AIChatWidget';

export const revalidate = 3600;

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <TabCards />
      <AIChatWidget />
      <TechPulse />
      <QuickStats />
      <ContactSection />
    </>
  );
}
