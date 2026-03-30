import rawAwardsData from "@/content/awards.json";
import { SectionContainer } from "./SectionContainer";

interface Award {
  year: number;
  title: string;
  titleEn: string;
  org: string;
}

const awardsData = rawAwardsData as Award[];

interface AwardsSectionProps {
  lang?: "zh" | "en";
}

export function AwardsSection({ lang = "zh" }: AwardsSectionProps) {
  const items = awardsData.slice(0, 4);

  return (
    <SectionContainer
      title="awards"
      titleZh="荣誉"
      subtitle="/awards"
      description="Selected honors and awards."
      linkText="See all →"
      lang={lang}
    >
      <ul className="space-y-2">
        {items.map((award, index) => (
          <li key={index} className="flex items-baseline gap-3">
            <span className="text-xs text-neutral-500 font-mono shrink-0">
              {award.year}
            </span>
            <span className="text-sm text-neutral-300">
              {lang === "zh" ? award.title : award.titleEn}
            </span>
          </li>
        ))}
      </ul>
    </SectionContainer>
  );
}
