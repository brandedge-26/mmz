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

export const metadata: Metadata = {
  title: "MMZ Shop — Memon Mobile Zone",
  description: "Shop accessories, parts, and devices at Memon Mobile Zone.",
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
