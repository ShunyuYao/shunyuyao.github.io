import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { PageLayout } from "@/app/components/PageLayout";
import nowData from "@/content/now.json";

export const metadata: Metadata = {
  title: "Now | Shunyu Yao",
};

export default async function NowPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("now");

  return (
    <PageLayout pathname="/now">
      <section className="space-y-6">
        <h1 className="text-2xl font-bold">{t("heading")}</h1>
        <ul className="list-disc list-inside space-y-2 text-[var(--foreground)]/80">
          {nowData.items.map((item, i) => (
            <li key={i}>
              {locale === "zh" ? item.text : item.textEn}
            </li>
          ))}
        </ul>
        <p className="text-sm text-[var(--foreground)]/50">
          {t("lastUpdated", { date: nowData.updatedAt })}
        </p>
      </section>
    </PageLayout>
  );
}
