import type { Metadata } from "next";
import { PageLayout } from "@/app/components/PageLayout";
import nowData from "@/content/now.json";

export const metadata: Metadata = {
  title: "Now | Shunyu Yao",
};

export default function NowPage() {
  return (
    <PageLayout pathname="/now">
      <section className="space-y-6">
        <h1 className="text-2xl font-bold">Now</h1>
        <ul className="list-disc list-inside space-y-2 text-[var(--foreground)]/80">
          {nowData.items.map((item, i) => (
            <li key={i}>
              {item.text} / {item.textEn}
            </li>
          ))}
        </ul>
        <p className="text-sm text-[var(--foreground)]/50">
          上次更新：{nowData.updatedAt} / Last updated: {nowData.updatedAt}
        </p>
      </section>
    </PageLayout>
  );
}
