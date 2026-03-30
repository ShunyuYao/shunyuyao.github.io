import type { Metadata } from "next";
import Image from "next/image";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { PageLayout } from "@/app/components/PageLayout";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  return { title: t("heading") };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("about");

  const education = t.raw("education") as Array<{
    period: string;
    school: string;
    degree: string;
  }>;

  return (
    <PageLayout pathname="/about">
      <section className="space-y-10">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
          <Image
            src="/images/avatar.jpg"
            alt="Shunyu Yao"
            width={120}
            height={120}
            priority
            className="rounded-full"
          />
          <div className="space-y-2 text-center sm:text-left">
            <h1 className="text-2xl font-bold">{t("name")}</h1>
            <p className="text-sm text-[var(--foreground)]/60">
              {t("tagline")}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold">{t("sectionAbout")}</h2>
          <div className="space-y-2 text-sm text-[var(--foreground)]/80">
            <p>{t("bio")}</p>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold">{t("sectionEducation")}</h2>
          <ul className="space-y-3">
            {education.map((edu, i) => (
              <li key={i} className="flex gap-4 text-sm">
                <span className="shrink-0 text-[var(--foreground)]/60">
                  {edu.period}
                </span>
                <div>
                  <div>{edu.school}</div>
                  <div className="text-xs text-[var(--foreground)]/60">
                    {edu.degree}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold">{t("sectionContact")}</h2>
          <ul className="space-y-2 text-sm text-[var(--foreground)]/80">
            <li>
              {t("email")}
              <a
                href="mailto:ysy2017@sjtu.edu.cn"
                className="text-[var(--accent)] hover:underline"
              >
                ysy2017@sjtu.edu.cn
              </a>
            </li>
            <li>
              <Link
                href="/work/onestory"
                className="text-[var(--accent)] hover:underline"
              >
                OneStory →
              </Link>
            </li>
          </ul>
        </div>

        <div className="pt-4">
          <Link
            href="/awards"
            className="text-sm text-[var(--accent)] hover:underline"
          >
            {t("viewAwards")}
          </Link>
        </div>
      </section>
    </PageLayout>
  );
}
