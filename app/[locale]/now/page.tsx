import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { PageLayout } from "@/app/components/PageLayout";
import nowData from "@/content/now.json";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "now" });
  return { title: t("heading") };
}

export default async function NowPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("now");

  return (
    <PageLayout pathname="/now" title={t("heading")}>
      <section className="space-y-6">
        <h1 className="text-2xl font-bold">{t("heading")}</h1>
        <ul className="list-disc list-inside space-y-2 text-[var(--foreground)]/80">
          {nowData.items.map((item, i) => (
            <li key={i}>
              {locale === "zh" ? item.text : item.textEn}
            </li>
          ))}
        </ul>
        <p className="text-base text-[var(--foreground)]/50">
          {t("lastUpdated", { date: nowData.updatedAt })}
        </p>
      </section>
    </PageLayout>
  );
}
