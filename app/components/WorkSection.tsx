import Image from "next/image";
import workData from "@/content/work.json";
import { SectionContainer } from "./SectionContainer";

interface WorkSectionProps {
  lang?: "zh" | "en";
}

export function WorkSection({ lang = "zh" }: WorkSectionProps) {
  const items = workData.slice(0, 3);

  return (
    <SectionContainer
      title="work"
      titleZh="工作经历"
      subtitle="/work"
      description="My professional journey so far."
      linkText="See all →"
      lang={lang}
    >
      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item.id} className="flex items-start gap-3">
            {item.logo && (
              <Image
                src={item.logo}
                alt={item.name}
                width={32}
                height={32}
                className="w-8 h-8 rounded"
              />
            )}
            <div>
              <p className="text-sm text-neutral-300">
                {lang === "zh" ? item.nameZh : item.name}
              </p>
              <p className="text-xs text-neutral-500">
                {lang === "zh" ? item.roleZh : item.role} ·{" "}
                {lang === "zh" ? item.orgZh : item.org}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </SectionContainer>
  );
}
