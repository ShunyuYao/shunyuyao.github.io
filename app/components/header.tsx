"use client";

import { Link, usePathname } from "@/i18n/navigation";
import AnimatedSignature from "./AnimatedSignature";
import { LanguageSwitch } from "./LanguageSwitch";

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

export function Header({ pathname: pathnameProp }: { pathname?: string } = {}) {
  const pathnameHook = usePathname();
  const pathname = pathnameProp ?? pathnameHook;
  return (
    <header className="relative py-8">
      <div className="flex flex-col items-center">
        <Link href="/" aria-label="Home" className="inline-block w-40 sm:w-48">
          <AnimatedSignature />
        </Link>
        <p className="mt-1 text-3xl tracking-widest text-[var(--foreground)]/60 font-[var(--font-ma-shan-zheng)]">
          姚顺宇
        </p>
      </div>
      <Breadcrumbs pathname={pathname} />
      <div className="absolute right-0 top-8">
        <LanguageSwitch />
      </div>
    </header>
  );
}
