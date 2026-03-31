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
      clickable={false}
      lang={lang}
    >
      <ul className="list-disc marker:text-neutral-500 pl-5 space-y-4">
        {nowData.items.map((item, i) => (
          <li key={i} className="text-base text-neutral-300">
            {lang === "zh" ? item.text : item.textEn}
          </li>
        ))}
      </ul>
    </SectionContainer>
  );
}
