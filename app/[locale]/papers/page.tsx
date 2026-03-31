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
  const t = await getTranslations("nav");

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
    <PageLayout
      pathname="/papers"
      title={t("papers")}
      description="Selected academic publications on AI-generated content, multimodal learning, and digital humans."
      navLinks={[
        { label: "GitHub", href: "https://github.com/ShunyuYao", icon: "github" },
        { label: "Blog", href: `/${locale}/blog`, icon: "blog" },
      ]}
    >
      <div className="space-y-8">
        {years.map((year) => (
          <div key={year} className="space-y-4">
            <h2 className="text-lg font-medium text-neutral-500">{year}</h2>
            <ul className="space-y-6">
              {grouped[year].map((paper) => (
                <li key={paper.id} className="space-y-1.5">
                  <p className="text-lg font-medium">{paper.title}</p>
                  <p className="text-sm text-neutral-500">
                    {paper.authors.map((author, i) => (
                      <span key={i}>
                        {i > 0 && ", "}
                        {author === "Shunyu Yao" ? (
                          <strong className="text-neutral-300">Shunyu Yao*</strong>
                        ) : (
                          author
                        )}
                      </span>
                    ))}
                  </p>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-[var(--accent)]">{paper.venue}</span>
                    {paper.note && (
                      <span className="text-neutral-500">· {paper.note}</span>
                    )}
                    {paper.links.map((link) => (
                      <a
                        key={link.label}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-neutral-400 hover:text-neutral-200 transition-colors"
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
      </div>
    </PageLayout>
  );
}
