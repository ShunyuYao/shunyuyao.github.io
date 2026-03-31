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
      <ul className="space-y-4">
        {items.map((item) => (
          <li key={item.id} className="flex items-start gap-3 px-3 py-2 -mx-3 rounded-md hover:bg-neutral-800/50 transition-colors">
            <div>
              <p className="text-base text-neutral-300">
                {lang === "zh" ? item.nameZh : item.name}
              </p>
              <p className="text-sm text-neutral-500">
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
