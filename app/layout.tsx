import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Poppins, Inter, Noto_Kufi_Arabic } from "next/font/google";
import { LanguageProvider } from "@/lib/i18n";
import { CartProvider } from "@/lib/cart";
import { ProductDetailProvider } from "@/lib/productDetail";
import { ProductDetailSheet } from "@/components/ProductDetailSheet";
import { CartButton } from "@/components/cart/CartButton";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const notoKufiArabic = Noto_Kufi_Arabic({
  variable: "--font-noto-kufi-arabic",
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "SJ Cafe — Al Shahama, Abu Dhabi",
  description: "Specialty coffee & desserts in Al Shahama, Abu Dhabi. View our menu in English or Arabic.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0a2f52",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      dir="ltr"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={`${poppins.variable} ${inter.variable} ${notoKufiArabic.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <LanguageProvider>
          <CartProvider>
            <ProductDetailProvider>
              {children}
              <CartButton />
              <ProductDetailSheet />
            </ProductDetailProvider>
          </CartProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
