import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { PageLayout } from "@/app/components/PageLayout";
import rawPressData from "@/content/press.json";

interface PressItem {
  id: string;
  title: string;
  titleEn: string;
  outlet: string;
  date: string;
  url: string;
  type: string;
}

const pressData = rawPressData as PressItem[];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "press" });
  return { title: t("heading") };
}

export default async function PressPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("press");

  return (
    <PageLayout pathname="/press" title={t("heading")}>
      <section className="space-y-8">
        <h1 className="text-2xl font-bold">{t("heading")}</h1>
        <ul className="space-y-5">
          {pressData.map((item) => (
            <li key={item.id} className="space-y-1">
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="relative z-10 text-sm hover:text-[var(--accent)] transition-colors"
              >
                {locale === "zh" ? item.title : item.titleEn}
              </a>
              <div className="flex items-center gap-2 text-xs text-[var(--foreground)]/60">
                <span>{item.outlet}</span>
                <span>·</span>
                <span>{item.date}</span>
                <span className="rounded-full border border-[var(--foreground)]/20 px-2 py-0.5 text-[10px] uppercase tracking-wide">
                  {item.type}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </PageLayout>
  );
}
