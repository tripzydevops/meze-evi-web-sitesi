import type { Metadata } from "next";
import "./globals.css";
import VisualEditsMessenger from "../visual-edits/VisualEditsMessenger";
import ErrorReporter from "@/components/ErrorReporter";
import Script from "next/script";
import { Toaster } from "@/components/ui/sonner"

export const metadata: Metadata = {
  title: "Bispecial Meze - Geleneksel Türk Mezeleri",
  description: "İstanbul'da geleneksel Türk mezelerinin modern sunumu. Taze ve lezzetli mezeler ile unutulmaz bir deneyim.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8316112856772155"
          crossOrigin="anonymous"
        />
      <body className="antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}