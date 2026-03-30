import HeroSection from "./components/HeroSection";
import { NowSection } from "./components/NowSection";
import { WorkSection } from "./components/WorkSection";
import { PapersSection } from "./components/PapersSection";
import { PressSection } from "./components/PressSection";
import { AwardsSection } from "./components/AwardsSection";

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
