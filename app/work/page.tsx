import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageLayout } from "@/app/components/PageLayout";
import workData from "@/content/work.json";

export const metadata: Metadata = {
  title: "Work | Shunyu Yao",
};

export default function WorkPage() {
  return (
    <PageLayout pathname="/work">
      <section className="space-y-8">
        <h1 className="text-2xl font-bold">Work</h1>
        <ul className="space-y-8">
          {workData.map((item) => (
            <li key={item.id} className="space-y-2">
              <div className="flex items-start gap-3">
                {item.logo && (
                  <Image
                    src={item.logo}
                    alt={item.name}
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded"
                  />
                )}
                <div className="flex-1">
                  <Link
                    href={`/work/${item.id}`}
                    className="text-lg font-semibold hover:text-[var(--accent)] transition-colors"
                  >
                    {item.nameZh} / {item.name}
                  </Link>
                  <p className="text-sm text-[var(--foreground)]/60">
                    {item.roleZh} · {item.orgZh} · {item.periodZh}
                  </p>
                </div>
              </div>
              <p className="text-sm text-[var(--foreground)]/80">
                {item.descriptionZh} / {item.description}
              </p>
              <ul className="list-disc list-inside text-sm text-[var(--foreground)]/60 space-y-1">
                {item.highlightsZh.map((h, i) => (
                  <li key={i}>{h}</li>
                ))}
              </ul>
              {item.links.length > 0 && (
                <div className="flex gap-3 pt-1">
                  {item.links.map((link) => (
                    <a
                      key={link.url}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative z-10 text-xs text-[var(--accent)] hover:underline"
                    >
                      [{link.label}]
                    </a>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      </section>
    </PageLayout>
  );
}
