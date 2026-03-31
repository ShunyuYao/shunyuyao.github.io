import rawArchiveData from "@/content/archive.json";
import { SectionContainer } from "./SectionContainer";

interface ArchiveEntry {
  date: string;
  type: "paper" | "product" | "award" | "press" | "event";
  title: string;
  titleEn: string;
  url: string | null;
}

const archiveData = rawArchiveData as ArchiveEntry[];

const typeEmoji: Record<ArchiveEntry["type"], string> = {
  paper: "📄",
  product: "🚀",
  award: "🏆",
  press: "🎙️",
  event: "📅",
};

interface ArchivePreviewProps {
  lang?: "zh" | "en";
}

export function ArchivePreview({ lang = "zh" }: ArchivePreviewProps) {
  const items = archiveData.slice(0, 5);

  return (
    <SectionContainer
      title="archive"
      titleZh="存档"
      subtitle="/archive"
      description="A timeline of milestones and activities."
      linkText="See all →"
      lang={lang}
    >
      <ul className="space-y-4">
        {items.map((entry, i) => (
          <li key={i} className="flex items-baseline gap-2 px-3 py-2 -mx-3 rounded-md hover:bg-neutral-800/50 transition-colors">
            <span className="font-mono text-neutral-500 text-sm w-18 shrink-0">
              {entry.date}
            </span>
            <span className="shrink-0">{typeEmoji[entry.type]}</span>
            <span className="text-base text-neutral-300 truncate">
              {lang === "zh" ? entry.title : entry.titleEn}
            </span>
          </li>
        ))}
      </ul>
    </SectionContainer>
  );
}
