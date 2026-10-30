import type { Metadata } from "next";
import Link from "next/link";
import { CheckoutForm } from "./CheckoutForm";

export const metadata: Metadata = { title: "Checkout | Lucky 7" };

export default function CheckoutPage() {
  return (
    <div className="mx-auto max-w-5xl px-3 py-6 sm:px-4 sm:py-10">
      <Link href="/" className="text-sm font-semibold text-brand">&larr; Back to menu</Link>
      <h1 className="mt-2 font-display text-3xl font-bold uppercase text-ink sm:text-4xl">
        Checkout
      </h1>
      <CheckoutForm />
    </div>
  );
}
