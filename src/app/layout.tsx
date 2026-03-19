import type { Metadata, Viewport } from "next";
import { DM_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#FFFFFF",
};

export const metadata: Metadata = {
  title: "grovegrove — Earn passively from your unused internet",
  description:
    "A lightweight browser extension that turns your idle bandwidth into rewards. 500 early access spots available.",
  openGraph: {
    title: "grovegrove — Earn passively from your unused internet",
    description:
      "Share unused bandwidth. Get rewarded. 500 early access spots.",
    type: "website",
    siteName: "grovegrove",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${dmSans.variable} ${mono.variable}`}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
