import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageLayout } from "@/app/components/PageLayout";

export const metadata: Metadata = {
  title: "About | Shunyu Yao",
};

const education = [
  {
    period: "2020–2024",
    school: "上海交通大学",
    degree: "信息与通信工程博士（肄业）",
  },
  {
    period: "2017–2020",
    school: "上海交通大学",
    degree: "仪器科学与工程硕士",
  },
  {
    period: "2012–2016",
    school: "西安交通大学",
    degree: "机械工程及自动化学士",
  },
];

export default function AboutPage() {
  return (
    <PageLayout pathname="/about">
      <section className="space-y-10">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
          <Image
            src="/images/avatar.jpg"
            alt="Shunyu Yao"
            width={120}
            height={120}
            className="rounded-full"
          />
          <div className="space-y-2 text-center sm:text-left">
            <h1 className="text-2xl font-bold">Shunyu Yao · 姚顺宇</h1>
            <p className="text-sm text-[var(--foreground)]/60">
              AIGC Researcher &amp; Product Builder · Shanghai
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold">About</h2>
          <div className="space-y-2 text-sm text-[var(--foreground)]/80">
            <p>
              Shunyu Yao is an AIGC researcher and product builder based in
              Shanghai. He focuses on AI-generated content, multimodal learning,
              and building products that bridge research and real-world
              applications.
            </p>
            <p>
              姚顺宇是一位 AIGC
              研究者与产品构建者，现居上海。他专注于AI生成内容、多模态学习，以及将前沿研究转化为实际产品。
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Education</h2>
          <ul className="space-y-3">
            {education.map((edu, i) => (
              <li key={i} className="flex gap-4 text-sm">
                <span className="shrink-0 text-[var(--foreground)]/60">
                  {edu.period}
                </span>
                <div>
                  <div>{edu.school}</div>
                  <div className="text-xs text-[var(--foreground)]/60">
                    {edu.degree}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Contact</h2>
          <ul className="space-y-2 text-sm text-[var(--foreground)]/80">
            <li>
              Email:{" "}
              <a
                href="mailto:ysy2017@sjtu.edu.cn"
                className="text-[var(--accent)] hover:underline"
              >
                ysy2017@sjtu.edu.cn
              </a>
            </li>
            <li>
              <Link
                href="/work/onestory"
                className="text-[var(--accent)] hover:underline"
              >
                OneStory →
              </Link>
            </li>
          </ul>
        </div>

        <div className="pt-4">
          <Link
            href="/awards"
            className="text-sm text-[var(--accent)] hover:underline"
          >
            View Awards →
          </Link>
        </div>
      </section>
    </PageLayout>
  );
}
