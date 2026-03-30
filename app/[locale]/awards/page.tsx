import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { PageLayout } from "@/app/components/PageLayout";
import rawAwardsData from "@/content/awards.json";

interface Award {
  year: number;
  title: string;
  titleEn: string;
  org: string;
}

const awardsData = (rawAwardsData as Award[]).sort((a, b) => b.year - a.year);

export const metadata: Metadata = {
  title: "Awards | Shunyu Yao",
};

export default async function AwardsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("awards");

  return (
    <PageLayout pathname="/awards">
      <section className="space-y-8">
        <h1 className="text-2xl font-bold">{t("heading")}</h1>
        <ul className="space-y-4">
          {awardsData.map((award, i) => (
            <li key={i} className="flex gap-4 text-sm">
              <span className="shrink-0 text-[var(--foreground)]/60">
                {award.year}
              </span>
              <div>
                <div>{locale === "zh" ? award.title : award.titleEn}</div>
                <div className="text-xs text-[var(--foreground)]/60">
                  {award.org}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </PageLayout>
  );
}
