import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { PageLayout } from "@/app/components/PageLayout";
import rawPapersData from "@/content/papers.json";

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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "papers" });
  return { title: t("heading") };
}

export default async function PapersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("papers");

  const sorted = [...papersData].sort((a, b) => b.year - a.year);

  const grouped = sorted.reduce<Record<number, Paper[]>>((acc, paper) => {
    if (!acc[paper.year]) acc[paper.year] = [];
    acc[paper.year].push(paper);
    return acc;
  }, {});

  const years = Object.keys(grouped)
    .map(Number)
    .sort((a, b) => b - a);

  return (
    <PageLayout pathname="/papers">
      <section className="space-y-10">
        <h1 className="text-2xl font-bold">{t("heading")}</h1>
        {years.map((year) => (
          <div key={year} className="space-y-4">
            <h2 className="text-lg font-semibold text-[var(--foreground)]/70">
              {year}
            </h2>
            <ul className="space-y-5">
              {grouped[year].map((paper) => (
                <li key={paper.id} className="space-y-1">
                  <p className="text-sm">{paper.title}</p>
                  <p className="text-xs text-[var(--foreground)]/60">
                    {paper.authors.map((author, i) => (
                      <span key={i}>
                        {i > 0 && ", "}
                        {author === "Shunyu Yao" ? (
                          <strong>Shunyu Yao*</strong>
                        ) : (
                          author
                        )}
                      </span>
                    ))}
                  </p>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-[var(--accent)]">{paper.venue}</span>
                    {paper.note && (
                      <span className="text-[var(--foreground)]/50">
                        · {paper.note}
                      </span>
                    )}
                    {paper.links.map((link) => (
                      <a
                        key={link.label}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="relative z-10 text-[var(--foreground)]/50 hover:text-[var(--foreground)] transition-colors"
                      >
                        [{link.label}]
                      </a>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>
    </PageLayout>
  );
}
