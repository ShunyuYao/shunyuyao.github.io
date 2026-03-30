import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import {
  getMessages,
  getTranslations,
  setRequestLocale,
} from "next-intl/server";
import { routing } from "@/i18n/routing";
import PersonSchema from "@/app/components/PersonSchema";

const BASE_URL = "https://shunyuyao.github.io";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist-mono",
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
      images: [
        {
          url: `${BASE_URL}/og/default.png`,
          width: 1200,
          height: 630,
          alt: "Shunyu Yao · 姚顺宇",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      images: [`${BASE_URL}/og/default.png`],
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
      className={`${inter.variable} ${geistMono.variable}`}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Ma+Shan+Zheng&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased min-h-screen">
        <PersonSchema />
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
