import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import WhatsAppButton from "@/components/WhatsAppButton";
import MobileBottomNav from "@/components/MobileBottomNav";

const jakartaSans = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const BASE_URL = "https://memonmobilezone122.pk";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Memon Mobile Zone — Phone Repair in Karachi",
    template: "%s | Memon Mobile Zone",
  },
  description:
    "Expert phone & tablet repair in Karachi. Cracked screen, dead battery, water damage — fixed fast with genuine parts & 90-day warranty. 2 branches: Saddar & North Karachi.",
  keywords: [
    "phone repair Karachi",
    "mobile repair Karachi",
    "iPhone repair Karachi",
    "Samsung repair Karachi",
    "screen replacement Karachi",
    "battery replacement Karachi",
    "Memon Mobile Zone",
    "mobile repair Saddar",
    "mobile repair North Karachi",
    "City Star Mall repair",
    "Geo Mobile Market",
    "tablet repair Karachi",
  ],
  openGraph: {
    type: "website",
    locale: "en_PK",
    url: BASE_URL,
    siteName: "Memon Mobile Zone",
    title: "Memon Mobile Zone — Phone Repair in Karachi",
    description:
      "Expert phone & tablet repair in Karachi. Cracked screen, dead battery, water damage — fixed fast with genuine parts & 90-day warranty.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Memon Mobile Zone — Phone Repair in Karachi",
    description:
      "Expert phone repair in Karachi. Cracked screen, dead battery, water damage — fixed fast with genuine parts & 90-day warranty.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-snippet": -1 },
  },
  alternates: { canonical: BASE_URL },
  icons: { icon: "/favicon.svg" },
  verification: { google: "w_3z3FU5JQZ6P5gGogabo2AOfl6SCgQVhD6CCAGGXZY" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Memon Mobile Zone",
  url: BASE_URL,
  telephone: "+923152413134",
  image: `${BASE_URL}/favicon.svg`,
  description:
    "Phone and tablet repair shop in Karachi with 2 branches. Services include screen replacement, battery replacement, water damage repair, and more.",
  priceRange: "Rs. 1,500 – Rs. 15,000",
  currenciesAccepted: "PKR",
  paymentAccepted: "Cash, Bank Transfer",
  address: [
    {
      "@type": "PostalAddress",
      streetAddress: "Shop No LB-41, City Star Mall",
      addressLocality: "Saddar",
      addressRegion: "Karachi",
      addressCountry: "PK",
    },
    {
      "@type": "PostalAddress",
      streetAddress: "Shop No 122, 1st Floor, Geo Mobile Market",
      addressLocality: "North Karachi",
      addressRegion: "Karachi",
      addressCountry: "PK",
    },
  ],
  sameAs: [`${BASE_URL}/shop`],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${jakartaSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col pb-16 md:pb-0 pt-8 lg:pt-9">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
        <WhatsAppButton />
        <MobileBottomNav />
      </body>
    </html>
  );
}
