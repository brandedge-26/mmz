import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import AuthProvider from "@/components/providers/AuthProvider";
import MobileBottomNav from "@/components/MobileBottomNav";
import Footer from "@/components/Footer";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const BASE_URL = "https://shop.memonmobilezone122.pk";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "MMZ Shop — Mobile Accessories in Karachi",
    template: "%s | MMZ Shop",
  },
  description:
    "Buy mobile accessories, cases, screen protectors, chargers, earphones & more in Karachi. Fast delivery. Trusted by thousands. Memon Mobile Zone official shop.",
  keywords: [
    "mobile accessories Karachi",
    "phone cases Karachi",
    "screen protector Karachi",
    "mobile charger Karachi",
    "earphones Karachi",
    "MMZ Shop",
    "Memon Mobile Zone shop",
    "buy phone accessories Pakistan",
    "mobile panels Karachi",
    "power bank Karachi",
  ],
  openGraph: {
    type: "website",
    locale: "en_PK",
    url: BASE_URL,
    siteName: "MMZ Shop — Memon Mobile Zone",
    title: "MMZ Shop — Mobile Accessories in Karachi",
    description:
      "Buy mobile accessories, cases, screen protectors, chargers, earphones & more. Fast delivery in Karachi.",
  },
  twitter: {
    card: "summary_large_image",
    title: "MMZ Shop — Mobile Accessories in Karachi",
    description:
      "Buy mobile accessories, cases, screen protectors, chargers & more. Memon Mobile Zone official shop.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-snippet": -1 },
  },
  alternates: { canonical: BASE_URL },
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${jakarta.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-white text-gray-900 pb-16 lg:pb-0">
        <AuthProvider>
          {children}
          <Footer />
          <MobileBottomNav />
        </AuthProvider>
      </body>
    </html>
  );
}
