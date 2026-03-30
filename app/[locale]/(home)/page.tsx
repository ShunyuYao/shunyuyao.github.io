import { setRequestLocale } from "next-intl/server";
import HeroSection from "@/app/components/HeroSection";
import { NowSection } from "@/app/components/NowSection";
import { WorkSection } from "@/app/components/WorkSection";
import { PapersSection } from "@/app/components/PapersSection";
import { PressSection } from "@/app/components/PressSection";
import { AwardsSection } from "@/app/components/AwardsSection";
import { ArchivePreview } from "@/app/components/ArchivePreview";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const lang = locale as "zh" | "en";

  return (
    <main className="max-w-5xl mx-auto px-8 sm:px-16 py-12 space-y-32">
      <HeroSection lang={lang} />
      <NowSection lang={lang} />
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-16">
        <WorkSection lang={lang} />
        <PapersSection lang={lang} />
        <PressSection lang={lang} />
        <AwardsSection lang={lang} />
        <ArchivePreview lang={lang} />
      </div>
    </main>
  );
}
