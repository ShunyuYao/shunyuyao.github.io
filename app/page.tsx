import { Container } from "./components/container";
import { Header } from "./components/header";
import { Footer } from "./components/footer";

export default function Home() {
  return (
    <Container>
      <Header />
      <main className="py-8">
        <p>Coming soon</p>
      </main>
      <Footer />
    </Container>
  );
}
