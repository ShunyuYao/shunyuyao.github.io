import rawPapersData from "@/content/papers.json";
import { SectionContainer } from "./SectionContainer";

interface PaperLink {
  label: string;
  url: string;
}

interface Paper {
  id: string;
  title: string;
  authors: string[];
  venue: string;
  year: number;
  links: PaperLink[];
  note?: string;
}

const papersData = rawPapersData as Paper[];

interface PapersSectionProps {
  lang?: "zh" | "en";
}

export function PapersSection({ lang = "zh" }: PapersSectionProps) {
  const items = [...papersData]
    .sort((a, b) => b.year - a.year)
    .slice(0, 3);

  return (
    <SectionContainer
      title="papers"
      titleZh="论文"
      subtitle="/papers"
      description="Selected academic publications."
      linkText="See all →"
      lang={lang}
    >
      <ul className="space-y-4">
        {items.map((paper) => (
          <li key={paper.id}>
            <p className="text-base text-neutral-300 truncate">{paper.title}</p>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-[var(--accent)]">
                {paper.venue} {paper.year}
              </span>
              {paper.note && (
                <span className="text-neutral-500">· {paper.note}</span>
              )}
              {paper.links.map((link) => (
                <a
                  key={link.label}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-400 hover:text-neutral-200 relative z-10"
                >
                  [{link.label}]
                </a>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </SectionContainer>
  );
}
