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
      <ul className="space-y-3">
        {items.map((entry, i) => (
          <li key={i} className="flex items-baseline gap-2">
            <span className="font-mono text-neutral-600 text-xs w-16 shrink-0">
              {entry.date}
            </span>
            <span className="shrink-0">{typeEmoji[entry.type]}</span>
            <span className="text-sm text-neutral-300 truncate">
              {lang === "zh" ? entry.title : entry.titleEn}
            </span>
          </li>
        ))}
      </ul>
    </SectionContainer>
  );
}
