import { SectionContainer } from "./SectionContainer";

interface AboutSectionProps {
  lang?: "zh" | "en";
}

const bio = {
  zh: "我致力于研究 Agentic AI,特别是将其运用在内容生产领域。\n\n我的职业生涯基本都在自己创业，或者和创业团队一起做一些有创新性的事情。我认为人所有的探索，最终都会转化为对自己内部的探索。\n\n如果你对 AI 感兴趣，或者对人生有感悟，欢迎与我交流。",
  en: "I focus on Agentic AI research, especially applying it to content production.\n\nMost of my career has been spent founding startups or working with entrepreneurial teams on innovative projects. I believe all exploration ultimately transforms into inner exploration.\n\nIf you're interested in AI or have reflections on life, I'd love to connect.",
};

export function AboutSection({ lang = "zh" }: AboutSectionProps) {
  return (
    <SectionContainer
      title="about"
      titleZh="生涯"
      subtitle="/about"
      description="Learn more about me."
      linkText="See all →"
      lang={lang}
    >
      <div className="space-y-4 text-base text-neutral-300 leading-relaxed">
        {bio[lang].split("\n\n").map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
    </SectionContainer>
  );
}
