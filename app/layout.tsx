import type { Metadata } from "next";
import { Oswald, Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "./components/cart";
import { Header } from "./components/Header";
import { CartDrawer } from "./components/CartDrawer";
import { Footer } from "./components/Footer";

const display = Oswald({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "700"],
});

const body = Inter({
  variable: "--font-body",
  subsets: ["latin"],
});

const title = "Lucky 7 | Deli, Market & Fried Chicken | Lawrence, NJ";
const description =
  "The biggest sandwich in NJ. Subs, cheesesteaks, breakfast all day, fried chicken, wings and pizza at 1938 Princeton Ave, Lawrence, NJ. Order online.";

export const metadata: Metadata = {
  // Set NEXT_PUBLIC_SITE_URL to the live domain so OpenGraph image URLs are absolute.
  metadataBase: process.env.NEXT_PUBLIC_SITE_URL ? new URL(process.env.NEXT_PUBLIC_SITE_URL) : undefined,
  title,
  description,
  openGraph: {
    title,
    description,
    siteName: "Lucky 7 Deli and Market",
    type: "website",
    images: [{ url: "/brand/logo-1200.png", width: 1200, height: 315, alt: "Lucky 7 Deli and Market" }],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <CartProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
