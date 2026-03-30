import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Shunyu Yao",
  description: "Personal website of Shunyu Yao",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
