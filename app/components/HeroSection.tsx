import { Link } from "@/i18n/navigation";
import TypewriterTitle from "./TypewriterTitle";

const subtitles = {
  zh: "上海 · AI · 内容创作 · 数字人",
  en: "Shanghai · AI · Content · Digital Human",
};

const ctaLabels = {
  zh: { work: "查看作品" },
  en: { work: "View My Work" },
};

export default function HeroSection({
  lang = "zh",
}: {
  lang?: "zh" | "en";
}) {
  return (
    <section className="relative flex min-h-[70vh] flex-col items-center justify-center text-center">
      <h1 className="text-4xl font-bold sm:text-5xl lg:text-6xl">
        <TypewriterTitle lang={lang} />
      </h1>

      <p className="mt-4 font-mono text-sm tracking-wider text-neutral-500">
        {subtitles[lang]}
      </p>

      <div className="mt-8 flex flex-col gap-4 sm:flex-row">
        <a
          href="https://www.onestory.art"
          target="_blank"
          rel="noopener noreferrer"
          className="relative z-10 inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-6 py-3 font-medium text-[#0a0a0a] transition-opacity hover:opacity-90"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#0a0a0a] opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#0a0a0a]" />
          </span>
          OneStory
        </a>

        <Link
          href="/work"
          className="relative z-10 inline-flex items-center justify-center rounded-full border border-[var(--foreground)]/20 px-6 py-3 font-medium transition-opacity hover:opacity-70"
        >
          {ctaLabels[lang].work}
        </Link>
      </div>

      <span className="absolute bottom-8 animate-bounce text-lg text-neutral-600">
        ↓
      </span>
    </section>
  );
}
