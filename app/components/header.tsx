import Link from "next/link";
import AnimatedSignature from "./AnimatedSignature";
import LanguageSwitch from "./LanguageSwitch";

function Breadcrumbs({ pathname }: { pathname: string }) {
  // Remove locale prefix for breadcrumb generation
  const cleanPath = pathname.replace(/^\/zh/, "") || "/";
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

export function Header({ pathname }: { pathname: string }) {
  return (
    <header className="relative py-8">
      <Link href="/" className="inline-block w-40 sm:w-48">
        <AnimatedSignature />
      </Link>
      <p className="mt-1 text-sm tracking-widest text-[var(--foreground)]/60 font-[var(--font-ma-shan-zheng)]">
        姚顺宇
      </p>
      <Breadcrumbs pathname={pathname} />
      <div className="absolute right-0 top-8">
        <LanguageSwitch />
      </div>
    </header>
  );
}
