import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { PageLayout } from "@/app/components/PageLayout";
import rawArchiveData from "@/content/archive.json";

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

function groupByYear(entries: ArchiveEntry[]) {
  const groups: Record<string, ArchiveEntry[]> = {};
  for (const entry of entries) {
    const year = entry.date.slice(0, 4);
    if (!groups[year]) groups[year] = [];
    groups[year].push(entry);
  }
  return Object.entries(groups)
    .sort(([a], [b]) => Number(b) - Number(a))
    .map(([year, items]) => ({
      year,
      items: items.sort((a, b) => b.date.localeCompare(a.date)),
    }));
}

export const metadata: Metadata = {
  title: "Archive | Shunyu Yao",
};

export default async function ArchivePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const grouped = groupByYear(archiveData);

  return (
    <PageLayout pathname="/archive">
      <section className="space-y-10">
        {grouped.map(({ year, items }) => (
          <div key={year} className="space-y-3">
            <h2 className="text-xs font-mono uppercase tracking-wider text-neutral-600">
              {year}
            </h2>
            <ul className="space-y-2">
              {items.map((entry, i) => {
                const month = entry.date.slice(5, 7);
                const title =
                  locale === "zh" ? entry.title : entry.titleEn;

                return (
                  <li key={i} className="flex items-baseline gap-2 text-sm">
                    <span className="text-neutral-600 font-mono text-xs w-8 shrink-0">
                      {month}
                    </span>
                    <span className="shrink-0">{typeEmoji[entry.type]}</span>
                    {entry.url ? (
                      <a
                        href={entry.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="relative z-10 hover:text-[var(--accent)] transition-colors"
                      >
                        {title}
                      </a>
                    ) : (
                      <span>{title}</span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </section>
    </PageLayout>
  );
}
