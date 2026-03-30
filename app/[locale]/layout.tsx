import type { Metadata } from "next";
import { Inter, Geist_Mono, Ma_Shan_Zheng } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import {
  getMessages,
  getTranslations,
  setRequestLocale,
} from "next-intl/server";
import { routing } from "@/i18n/routing";
import FluidCursorWrapper from "@/app/components/FluidCursorWrapper";
import PersonSchema from "@/app/components/PersonSchema";

const BASE_URL = "https://shunyuyao.github.io";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-inter",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist-mono",
});

const maShanZheng = Ma_Shan_Zheng({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-ma-shan-zheng",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "site" });

  const ogLocale = locale === "zh" ? "zh_CN" : "en_US";

  return {
    title: {
      default: t("title"),
      template: `%s | ${t("title")}`,
    },
    description: t("description"),
    authors: [{ name: "Shunyu Yao", url: BASE_URL }],
    openGraph: {
      type: "website",
      url: BASE_URL,
      locale: ogLocale,
      siteName: t("title"),
    },
    twitter: {
      card: "summary_large_image",
    },
    alternates: {
      canonical: `${BASE_URL}/${locale}`,
      languages: {
        "zh-CN": `${BASE_URL}/zh`,
        "en-US": `${BASE_URL}/en`,
      },
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${inter.variable} ${geistMono.variable} ${maShanZheng.variable}`}
    >
      <body className="antialiased min-h-screen">
        <PersonSchema />
        <FluidCursorWrapper />
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
