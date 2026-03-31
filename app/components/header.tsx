"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import AnimatedSignature from "./AnimatedSignature";
import { LanguageSwitch } from "./LanguageSwitch";
import { SpotlightText } from "./SpotlightText";

function Breadcrumbs({ pathname }: { pathname: string }) {
  // Remove locale prefix for breadcrumb generation
  const cleanPath = pathname.replace(/^\/(zh|en)/, "") || "/";
  const segments = cleanPath.split("/").filter(Boolean);

  if (segments.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className="mt-2 text-sm text-[var(--foreground)]/60">
      <Link href="/" className="hover:opacity-70 transition-opacity">
        Home
      </Link>
      {segments.map((segment, i) => {
        const href = "/" + segments.slice(0, i + 1).join("/");
        return (
          <span key={href}>
            <span className="mx-1">/</span>
            <Link href={href} className="hover:opacity-70 transition-opacity capitalize">
              {segment}
            </Link>
          </span>
        );
      })}
    </nav>
  );
}

export function Header({
  pathname: pathnameProp,
  subpage,
  title,
}: {
  pathname?: string;
  subpage?: boolean;
  title?: string;
} = {}) {
  const pathnameHook = usePathname();
  const pathname = pathnameProp ?? pathnameHook;
  const locale = useLocale();

  // Subpage header: signature + /TITLE on one line, no name, no breadcrumbs, no language switch
  if (subpage) {
    const displayTitle = title || pathname.replace(/^\//, "").split("/").filter(Boolean)[0] || "";

    return (
      <header className="py-8">
        <div className="flex items-center justify-center space-x-4">
          <Link href="/" aria-label="Home" className="inline-block w-80 sm:w-96">
            <AnimatedSignature lang={locale as "zh" | "en"} />
          </Link>
          {displayTitle && (
            <span className="uppercase text-lg font-medium font-mono tracking-wider text-neutral-500">
              <span className="mx-2 text-neutral-700">/</span>
              {displayTitle}
            </span>
          )}
        </div>
      </header>
    );
  }

  // Homepage header: signature + name + breadcrumbs + language switch
  return (
    <header className="relative py-8">
      <div className="flex flex-col items-center">
        <Link href="/" aria-label="Home" className="inline-block w-80 sm:w-96">
          <AnimatedSignature lang={locale as "zh" | "en"} />
        </Link>
        <SpotlightText className="mt-1 text-3xl tracking-widest font-[var(--font-ma-shan-zheng)]">
          {locale === "zh" ? "姚顺宇" : "Yao Shunyu"}
        </SpotlightText>
      </div>
      <Breadcrumbs pathname={pathname} />
      <div className="absolute right-0 top-8">
        <LanguageSwitch />
      </div>
    </header>
  );
}
