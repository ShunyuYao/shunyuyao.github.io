import { Link } from "@/i18n/navigation";

interface SectionContainerProps {
  title: string;
  titleZh?: string;
  subtitle: string;
  description: string;
  linkText: string;
  lang?: "zh" | "en";
  children: React.ReactNode;
}

export function SectionContainer({
  title,
  titleZh,
  subtitle,
  description,
  linkText,
  lang = "zh",
  children,
}: SectionContainerProps) {
  const displayTitle = lang === "zh" && titleZh ? titleZh : title;

  return (
    <section className="space-y-4 relative group">
      <div className="absolute -z-10 -top-4 -bottom-8 -right-8 -left-8 bg-neutral-900 rounded-lg pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />

      <Link href={subtitle}>
        <h2 className="text-xs uppercase font-medium font-mono tracking-wider text-neutral-500">
          {displayTitle}
        </h2>
      </Link>

      {children}

      <p className="text-sm text-neutral-500 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
        {description}{" "}
        <Link href={subtitle} className="text-[var(--accent)] hover:underline relative z-10">
          {linkText}
        </Link>
      </p>
    </section>
  );
}
