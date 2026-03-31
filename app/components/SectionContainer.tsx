import { Link } from "@/i18n/navigation";

interface SectionContainerProps {
  title: string;
  titleZh?: string;
  subtitle: string;
  description?: string;
  linkText?: string;
  clickable?: boolean;
  lang?: "zh" | "en";
  children: React.ReactNode;
}

export function SectionContainer({
  title,
  titleZh,
  subtitle,
  description,
  linkText,
  clickable = true,
  lang = "zh",
  children,
}: SectionContainerProps) {
  const displayTitle = "/" + (lang === "zh" && titleZh ? titleZh : title);

  return (
    <section className={`space-y-4 relative isolate group ${clickable ? "cursor-pointer" : ""}`}>
      {clickable && (
        <>
          <div className="absolute -z-10 -top-4 -bottom-8 -right-8 -left-8 bg-neutral-900 rounded-lg pointer-events-none opacity-0 md:group-hover:opacity-100 transition-opacity" />

          {/* Full-section click target */}
          <Link
            href={subtitle}
            className="absolute -top-4 -bottom-8 -right-8 -left-8 z-0"
            aria-label={`View all ${title}`}
          />
        </>
      )}

      <h2 className="text-sm uppercase font-medium font-mono tracking-wider text-neutral-500">
        {displayTitle}
      </h2>

      {children}

      {clickable && description && linkText && (
        <p className="text-xs text-neutral-500 hidden md:block md:opacity-0 md:group-hover:opacity-100 transition-opacity">
          {description}{" "}
          <strong className="font-medium text-neutral-200">
            {linkText} ▸
          </strong>
        </p>
      )}
    </section>
  );
}
