"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";

export function LanguageSwitch() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  function handleClick() {
    const targetLocale = locale === "zh" ? "en" : "zh";
    router.push(pathname, { locale: targetLocale });
  }

  return (
    <button
      onClick={handleClick}
      className="relative z-10 text-sm font-medium hover:opacity-70 transition-opacity"
    >
      {locale === "zh" ? "EN" : "中文"}
    </button>
  );
}
