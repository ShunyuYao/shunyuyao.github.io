"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    const lang = navigator.language;
    if (lang.startsWith("zh")) {
      router.replace("/zh");
    } else {
      router.replace("/en");
    }
  }, [router]);

  return null;
}
