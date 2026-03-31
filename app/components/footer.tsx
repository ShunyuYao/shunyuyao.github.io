"use client";

import { Link } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import AnimatedSignature from "./AnimatedSignature";

const navLinks = [
  { href: "/now", label: "Now", labelZh: "近况" },
  { href: "/work", label: "Work", labelZh: "工作" },
  { href: "/papers", label: "Papers", labelZh: "论文" },
  { href: "/press", label: "Press", labelZh: "媒体" },
  { href: "/awards", label: "Awards", labelZh: "荣誉" },
  { href: "/about", label: "About", labelZh: "关于" },
  { href: "/archive", label: "Archive", labelZh: "存档" },
] as const;

export function Footer({ lang }: { lang?: "zh" | "en" } = {}) {
  const locale = useLocale();
  const l = lang ?? (locale as "zh" | "en");

  return (
    <footer className="py-16 text-center">
      <div className="mx-auto w-px h-16 bg-neutral-800" />

      <Link href="/" aria-label="Home" className="block w-16 mx-auto mt-8">
        <AnimatedSignature lang={l} />
      </Link>

      <p className="mt-4 text-xs uppercase font-mono tracking-wider text-neutral-500">
        {l === "zh"
          ? "AIGC 研究者 & 产品负责人 · 上海"
          : "AIGC Researcher & Product Builder · Shanghai"}
      </p>

      <nav className="mt-6 flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm text-neutral-400">
        {navLinks.map(({ href, label, labelZh }) => (
          <Link
            key={href}
            href={href}
            className="relative z-10 hover:text-[var(--accent)] transition-colors"
          >
            {l === "zh" ? labelZh : label}
          </Link>
        ))}
      </nav>

      <p className="mt-6 text-xs text-neutral-500">
        {l === "zh"
          ? "© 2026 姚顺宇 · 最后更新：2026年3月"
          : "© 2026 Shunyu Yao · Last updated: March 2026"}
      </p>
    </footer>
  );
}
