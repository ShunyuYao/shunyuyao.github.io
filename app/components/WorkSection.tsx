import projectsData from "@/content/projects.json";
import { SectionContainer } from "./SectionContainer";

interface WorkSectionProps {
  lang?: "zh" | "en";
}

export function WorkSection({ lang = "zh" }: WorkSectionProps) {
  const items = projectsData.slice(0, 3);

  return (
    <SectionContainer
      title="projects"
      titleZh="作品"
      subtitle="/projects"
      description="Selected products and creative works."
      linkText="See all →"
      lang={lang}
    >
      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item.id} className="flex items-start gap-3">
            <div>
              <p className="text-sm text-neutral-300">
                {lang === "zh" ? item.nameZh : item.name}
              </p>
              <p className="text-xs text-neutral-500">
                {lang === "zh" ? item.orgZh : item.org} ·{" "}
                {lang === "zh" ? item.periodZh : item.period}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </SectionContainer>
  );
}
