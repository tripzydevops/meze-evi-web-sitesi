import type { Metadata } from "next";
import "./globals.css";
import VisualEditsMessenger from "../visual-edits/VisualEditsMessenger";
import ErrorReporter from "@/components/ErrorReporter";
import Script from "next/script";
import { Toaster } from "@/components/ui/sonner"

export const metadata: Metadata = {
  title: {
    default: "Bispecial Meze - Geleneksel Türk Mezeleri & Meze Evi İstanbul",
    template: "%s | Bispecial Meze"
  },
  description: "İstanbul'un en taze meze evi. Geleneksel Türk mezelerinin modern sunumu, günlük hazırlanan lezzetler. Online menü, galeri ve sipariş hattı.",
  keywords: [
    "meze", "türk mezeleri", "meze evi", "istanbul meze", "taze meze", 
    "bispecial meze", "haydari", "humus", "meze sipariş", "balıkesir meze",
    "meze çeşitleri", "günlük meze", "ev yapımı meze"
  ],
  authors: [{ name: "Bispecial Meze" }],
  creator: "Bispecial Meze",
  publisher: "Bispecial Meze",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "Bispecial Meze - Geleneksel Türk Mezeleri",
    description: "İstanbul'un en taze meze evi. Geleneksel Türk mezelerinin modern sunumu.",
    url: "https://www.bispecialmeze.com",
    siteName: "Bispecial Meze",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Bispecial Meze Lezzetleri",
      },
    ],
    locale: "tr_TR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bispecial Meze - Geleneksel Türk Mezeleri",
    description: "İstanbul'un en taze meze evi. Geleneksel Türk mezelerinin modern sunumu.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
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
      <head>
        {/* Google AdSense Placeholder - Replace with actual client ID */}
        <Script
          id="adsbygoogle-init"
          strategy="afterInteractive"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
          crossOrigin="anonymous"
        />
      </head>
      <body className="antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}