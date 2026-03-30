"use client";

import { useState, useEffect } from "react";

const titles = {
  zh: ["AIGC 研究者", "产品负责人", "AI 内容创作者", "数字人技术专家"],
  en: [
    "AIGC Researcher",
    "Product Builder",
    "AI Content Creator",
    "Digital Human Engineer",
  ],
};

export default function TypewriterTitle({
  lang = "zh",
}: {
  lang?: "zh" | "en";
}) {
  const [titleIndex, setTitleIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const currentTitle = titles[lang][titleIndex];

  useEffect(() => {
    let delay: number;

    if (!isDeleting) {
      delay = charIndex < currentTitle.length ? 80 : 2000;
    } else {
      delay = charIndex > 0 ? 40 : 80;
    }

    const id = setTimeout(() => {
      if (!isDeleting) {
        if (charIndex < currentTitle.length) {
          setCharIndex((c) => c + 1);
        } else {
          setIsDeleting(true);
        }
      } else {
        if (charIndex > 0) {
          setCharIndex((c) => c - 1);
        } else {
          setIsDeleting(false);
          setTitleIndex((i) => (i + 1) % titles[lang].length);
        }
      }
    }, delay);

    return () => clearTimeout(id);
  }, [charIndex, isDeleting, currentTitle.length, lang, titleIndex]);

  return (
    <span>
      {currentTitle.slice(0, charIndex)}
      <span className="animate-pulse">|</span>
    </span>
  );
}
