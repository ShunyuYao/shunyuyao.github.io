import { Container } from "@/app/components/container";
import { Header } from "@/app/components/header";
import { Footer } from "@/app/components/footer";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Container>
      <Header />
      {children}
      <Footer />
    </Container>
  );
}
