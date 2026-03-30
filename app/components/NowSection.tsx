import nowData from "@/content/now.json";
import { SectionContainer } from "./SectionContainer";

interface NowSectionProps {
  lang?: "zh" | "en";
}

export function NowSection({ lang = "zh" }: NowSectionProps) {
  return (
    <SectionContainer
      title="now"
      subtitle="/now"
      description="What I'm focused on right now."
      linkText="See all →"
      lang={lang}
    >
      <ul className="list-disc marker:text-neutral-600 pl-5 space-y-1">
        {nowData.items.map((item, i) => (
          <li key={i} className="text-sm text-neutral-300">
            {lang === "zh" ? item.text : item.textEn}
          </li>
        ))}
      </ul>
    </SectionContainer>
  );
}
