import { Header } from "./header";
import { Footer } from "./footer";

interface PageLayoutProps {
  pathname: string;
  children: React.ReactNode;
  description?: string;
}

export function PageLayout({ pathname, children }: PageLayoutProps) {
  return (
    <div className="font-sans min-h-screen p-8 sm:p-20 space-y-16">
      <Header pathname={pathname} />
      <main className="max-w-2xl mx-auto space-y-12">{children}</main>
      <Footer />
    </div>
  );
}
