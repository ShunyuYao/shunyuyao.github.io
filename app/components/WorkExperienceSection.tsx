import workData from "@/content/work.json";
import { SectionContainer } from "./SectionContainer";

interface WorkExperienceSectionProps {
  lang?: "zh" | "en";
}

export function WorkExperienceSection({ lang = "zh" }: WorkExperienceSectionProps) {
  return (
    <SectionContainer
      title="work"
      titleZh="工作经历"
      subtitle="/work"
      description="Professional experience and roles."
      linkText="See all →"
      lang={lang}
    >
      <ul className="space-y-4">
        {workData.map((item) => (
          <li key={item.id} className="flex items-start gap-3">
            <div>
              <p className="text-base text-neutral-300">
                {lang === "zh" ? item.roleZh : item.role}
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
