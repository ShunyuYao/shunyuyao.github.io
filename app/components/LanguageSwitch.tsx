"use client";

import { usePathname, useRouter } from "next/navigation";

export default function LanguageSwitch() {
  const pathname = usePathname();
  const router = useRouter();
  const isChinese = pathname.startsWith("/zh");

  function handleClick() {
    const targetPath = isChinese
      ? pathname.replace(/^\/zh/, "") || "/"
      : "/zh" + pathname;
    router.push(targetPath);
  }

  return (
    <button
      onClick={handleClick}
      className="relative z-10 text-sm font-medium hover:opacity-70 transition-opacity"
    >
      {isChinese ? "EN" : "中文"}
    </button>
  );
}
