import { Header } from "./header";
import { Footer } from "./footer";

export interface NavLink {
  label: string;
  href: string;
  icon: "github" | "blog";
}

interface PageLayoutProps {
  pathname: string;
  title?: string;
  children: React.ReactNode;
  description?: string;
  navLinks?: NavLink[];
}

function NavIcon({ type }: { type: NavLink["icon"] }) {
  if (type === "github") {
    return (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
      </svg>
    );
  }
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
    </svg>
  );
}

export function PageLayout({ pathname, title, children, description, navLinks }: PageLayoutProps) {
  return (
    <div className="font-sans min-h-screen p-8 sm:p-20 space-y-16">
      <div>
        <Header pathname={pathname} title={title} subpage />

        {(description || navLinks) && (
          <div className="text-center space-y-4 mt-6">
            {description && (
              <p className="text-base text-neutral-500 max-w-md mx-auto">{description}</p>
            )}
            {navLinks && navLinks.length > 0 && (
              <nav className="flex items-center justify-center gap-4 text-sm text-neutral-500">
                {navLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 font-medium hover:text-neutral-300 transition-colors"
                  >
                    <NavIcon type={link.icon} />
                    {link.label}
                  </a>
                ))}
              </nav>
            )}
          </div>
        )}
      </div>

      <main className="max-w-2xl mx-auto space-y-12">{children}</main>
      <Footer />
    </div>
  );
}
