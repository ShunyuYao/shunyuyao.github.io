import rawPressData from "@/content/press.json";
import { SectionContainer } from "./SectionContainer";

interface PressItem {
  id: string;
  title: string;
  titleEn: string;
  outlet: string;
  date: string;
  url: string;
  type: string;
}

const pressData = rawPressData as PressItem[];

interface PressSectionProps {
  lang?: "zh" | "en";
}

export function PressSection({ lang = "zh" }: PressSectionProps) {
  const items = pressData.slice(0, 3);

  return (
    <SectionContainer
      title="press"
      titleZh="媒体"
      subtitle="/press"
      description="Media appearances and coverage."
      linkText="See all →"
      lang={lang}
    >
      <ul className="space-y-4">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="relative z-10 group/link"
            >
              <p className="text-base text-neutral-300 hover:text-neutral-100">
                {lang === "zh" ? item.title : item.titleEn}
              </p>
              <p className="text-sm text-neutral-500">
                {item.outlet} · {item.date}
              </p>
            </a>
          </li>
        ))}
      </ul>
    </SectionContainer>
  );
}
