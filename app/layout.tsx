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

export const metadata: Metadata = {
  title: "Lucky 7 | Deli, Market & Fried Chicken | Lawrence, NJ",
  description:
    "The biggest sandwich in NJ. Subs, cheesesteaks, breakfast all day, fried chicken, wings and pizza at 1938 Princeton Ave, Lawrence, NJ. Order online.",
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
