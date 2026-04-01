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
    <PageLayout pathname="/about" title={t("heading")}>
      <section className="space-y-10">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
          <Image
            src="/images/avatar.jpeg"
            alt="Shunyu Yao"
            width={120}
            height={120}
            priority
            className="w-[120px] h-[120px] rounded-full object-cover shrink-0"
          />
          <div className="space-y-2 text-center sm:text-left">
            <h1 className="text-2xl font-bold">{t("name")}</h1>
            <p className="text-base text-[var(--foreground)]/60">
              {t("tagline")}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold">{t("sectionAbout")}</h2>
          <div className="space-y-4 text-base text-[var(--foreground)]/80">
            {t("bio").split("\n\n").map((paragraph: string, i: number) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold">{t("sectionEducation")}</h2>
          <ul className="space-y-3">
            {education.map((edu, i) => (
              <li key={i} className="grid grid-cols-[5.5rem_6rem_auto] gap-x-4 text-base">
                <span className="text-[var(--foreground)]/60">
                  {edu.period}
                </span>
                <span>{edu.school}</span>
                <span className="text-[var(--foreground)]/60">
                  {edu.degree}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold">{t("sectionContact")}</h2>
          <ul className="space-y-2 text-base text-[var(--foreground)]/80">
            <li>
              {t("email")}
              <a
                href="mailto:demosama2333@outlook.com"
                className="text-[var(--accent)] hover:underline"
              >
                demosama2333@outlook.com
              </a>
            </li>
          </ul>
        </div>
      </section>
    </PageLayout>
  );
}
