import { setRequestLocale } from "next-intl/server";
import { PageLayout } from "@/app/components/PageLayout";
import projectsData from "@/content/projects.json";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return {
    title: locale === "zh" ? "作品 | 姚顺宇" : "Projects | Shunyu Yao",
  };
}

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const lang = locale as "zh" | "en";

  return (
    <PageLayout pathname="/projects">
      <h1 className="text-2xl font-bold text-foreground mb-12">
        {lang === "zh" ? "作品" : "Projects"}
      </h1>
      <div className="space-y-16">
        {projectsData.map((project) => (
          <div key={project.id} className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                {lang === "zh" ? project.nameZh : project.name}
              </h2>
              <p className="text-xs text-neutral-500 font-mono mt-0.5">
                {lang === "zh" ? project.orgZh : project.org} ·{" "}
                {lang === "zh" ? project.periodZh : project.period}
              </p>
            </div>
            <p className="text-sm text-neutral-300 leading-relaxed">
              {lang === "zh" ? project.descriptionZh : project.description}
            </p>
            {(lang === "zh" ? project.highlightsZh : project.highlights).length > 0 && (
              <ul className="space-y-1">
                {(lang === "zh" ? project.highlightsZh : project.highlights).map((h, i) => (
                  <li key={i} className="text-sm text-neutral-400 flex gap-2">
                    <span className="text-neutral-600">•</span>
                    {h}
                  </li>
                ))}
              </ul>
            )}
            <div className="flex flex-wrap gap-3">
              {project.links.map((link, i) => (
                <a
                  key={i}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative z-10 text-xs font-mono text-accent hover:text-foreground border border-neutral-800 hover:border-neutral-600 px-3 py-1 rounded transition-colors"
                >
                  {lang === "zh" ? link.label : link.labelEn}
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </PageLayout>
  );
}
