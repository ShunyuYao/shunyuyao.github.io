import HeroSection from "@/app/components/HeroSection";
import { NowSection } from "@/app/components/NowSection";
import { WorkSection } from "@/app/components/WorkSection";
import { PapersSection } from "@/app/components/PapersSection";
import { PressSection } from "@/app/components/PressSection";
import { AwardsSection } from "@/app/components/AwardsSection";

export default function Home() {
  return (
    <main className="p-8 sm:p-20 space-y-32">
      <HeroSection />
      <NowSection />
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-16 max-w-5xl mx-auto">
        <WorkSection />
        <PapersSection />
        <PressSection />
        <AwardsSection />
      </div>
    </main>
  );
}
