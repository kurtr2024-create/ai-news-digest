import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI News Daily Digest",
  description: "Your daily AI & machine learning briefing, powered by Claude.",
  openGraph: {
    title: "AI News Daily Digest",
    description: "Your daily AI & machine learning briefing, powered by Claude.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full`}>
      <body className="min-h-full bg-[#0a0a0a] text-[#f9fafb] antialiased">{children}</body>
    </html>
  );
}
