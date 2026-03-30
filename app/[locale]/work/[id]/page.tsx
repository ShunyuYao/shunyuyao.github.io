import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { PageLayout } from "@/app/components/PageLayout";
import workData from "@/content/work.json";

interface WorkDetailProps {
  params: Promise<{ locale: string; id: string }>;
}

export async function generateStaticParams() {
  return workData.map((item) => ({ id: item.id }));
}

export async function generateMetadata({
  params,
}: WorkDetailProps): Promise<Metadata> {
  const { id } = await params;
  const item = workData.find((w) => w.id === id);
  if (!item) return { title: "Not Found | Shunyu Yao" };
  return { title: `${item.name} | Work | Shunyu Yao` };
}

export default async function WorkDetailPage({ params }: WorkDetailProps) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("work");
  const item = workData.find((w) => w.id === id);
  if (!item) notFound();

  return (
    <PageLayout pathname={`/work/${id}`}>
      <section className="space-y-6">
        <Link
          href="/work"
          className="text-sm text-[var(--foreground)]/50 hover:text-[var(--accent)] transition-colors"
        >
          {t("backToWork")}
        </Link>

        <div className="flex items-start gap-4">
          {item.logo && (
            <Image
              src={item.logo}
              alt={item.name}
              width={48}
              height={48}
              className="w-12 h-12 rounded"
            />
          )}
          <div>
            <h1 className="text-2xl font-bold">
              {locale === "zh" ? item.nameZh : item.name}
            </h1>
            <p className="text-sm text-[var(--foreground)]/60 mt-1">
              {locale === "zh"
                ? `${item.roleZh} · ${item.orgZh} · ${item.periodZh}`
                : `${item.role} · ${item.org} · ${item.period}`}
            </p>
          </div>
        </div>

        <p className="text-[var(--foreground)]/80">
          {locale === "zh" ? item.descriptionZh : item.description}
        </p>

        <div className="space-y-2">
          <h2 className="text-lg font-semibold">{t("highlights")}</h2>
          <ul className="list-disc list-inside space-y-1 text-[var(--foreground)]/80">
            {(locale === "zh" ? item.highlightsZh : item.highlights).map(
              (h, i) => (
                <li key={i}>{h}</li>
              )
            )}
          </ul>
        </div>

        {item.links.length > 0 && (
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">{t("links")}</h2>
            <div className="flex gap-4">
              {item.links.map((link) => (
                <a
                  key={link.url}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative z-10 text-[var(--accent)] hover:underline"
                >
                  [{link.label}]
                </a>
              ))}
            </div>
          </div>
        )}
      </section>
    </PageLayout>
  );
}
