import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FXlabs Peptides — Research Peptides & Compounds",
  description:
    "FXlabs catalog: research peptides, blends and lab supplies, 99%+ pure and third-party COA-tested. Research use only.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
