import type { Metadata } from "next";
import { PageLayout } from "@/app/components/PageLayout";
import rawPressData from "@/content/press.json";

interface PressItem {
  id: string;
  title: string;
  titleEn: string;
  outlet: string;
  date: string;
  url: string;
  type: string;
}

const pressData = rawPressData as PressItem[];

export const metadata: Metadata = {
  title: "Press | Shunyu Yao",
};

export default function PressPage() {
  return (
    <PageLayout pathname="/press">
      <section className="space-y-8">
        <h1 className="text-2xl font-bold">Press</h1>
        <ul className="space-y-5">
          {pressData.map((item) => (
            <li key={item.id} className="space-y-1">
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="relative z-10 text-sm hover:text-[var(--accent)] transition-colors"
              >
                {item.title}
              </a>
              <div className="flex items-center gap-2 text-xs text-[var(--foreground)]/60">
                <span>{item.outlet}</span>
                <span>·</span>
                <span>{item.date}</span>
                <span className="rounded-full border border-[var(--foreground)]/20 px-2 py-0.5 text-[10px] uppercase tracking-wide">
                  {item.type}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </PageLayout>
  );
}
