import type { Metadata } from "next";
import "./globals.css";
import VisualEditsMessenger from "../visual-edits/VisualEditsMessenger";
import ErrorReporter from "@/components/ErrorReporter";
import Script from "next/script";
import { Toaster } from "@/components/ui/sonner"

export const metadata: Metadata = {
  title: "Bispecial Meze - Geleneksel Türk Mezeleri & Meze Evi",
  description: "İstanbul'un en taze meze evi. Geleneksel Türk mezelerinin modern sunumu, günlük hazırlanan lezzetler. Sipariş ve bilgi için bize ulaşın.",
  keywords: ["meze", "türk mezeleri", "meze evi", "istanbul meze", "taze meze", "bispecial meze", "haydari", "humus", "meze sipariş"],
  openGraph: {
    title: "Bispecial Meze - Geleneksel Türk Mezeleri",
    description: "İstanbul'un en taze meze evi. Geleneksel Türk mezelerinin modern sunumu.",
    images: [{ url: "/og-image.jpg" }],
    type: "website",
    locale: "tr_TR",
  },
  alternates: {
    canonical: "https://www.bispecialmeze.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className="antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}