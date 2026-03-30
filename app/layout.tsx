import type { Metadata, Viewport } from "next";
import { Inter, Geist_Mono, Ma_Shan_Zheng } from "next/font/google";
import "./globals.css";
import FluidCursorWrapper from "@/app/components/FluidCursorWrapper";
import { Container } from "@/app/components/container";
import { Header } from "@/app/components/header";
import { Footer } from "@/app/components/footer";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-inter",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist-mono",
});

const maShanZheng = Ma_Shan_Zheng({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-ma-shan-zheng",
});

export const metadata: Metadata = {
  title: "Shunyu Yao",
  description: "Personal website of Shunyu Yao",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${geistMono.variable} ${maShanZheng.variable}`}>
      <body className="antialiased min-h-screen">
        <FluidCursorWrapper />
        <Container>
          <Header />
          {children}
          <Footer />
        </Container>
      </body>
    </html>
  );
}
