"use client";

import Link from "next/link";
import { useState } from "react";
import { money } from "../lib/menu";
import { useCart } from "../components/cart";
import { CartRow, ModeToggle, Totals } from "../components/CartPanel";

type Placed = { number: string; total: number; mode: string; name: string };

// Prototype only: nothing is sent anywhere. The order lives in this component's
// state until the page is left.
export function CheckoutForm() {
  const { lines, subtotal, tax, total, clear, mode } = useCart();
  const [placed, setPlaced] = useState<Placed | null>(null);

  if (placed) {
    return (
      <div className="mx-auto mt-10 max-w-lg rounded-2xl border border-line bg-white p-8 text-center shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand">
          Order received
        </p>
        <h2 className="mt-2 font-display text-3xl font-bold text-ink">
          Thanks, {placed.name}!
        </h2>
        <p className="mt-3 text-muted">
          Order <strong className="text-ink">#{placed.number}</strong> ·{" "}
          {money(placed.total)} · {placed.mode === "pickup" ? "Pickup" : "Delivery"}
        </p>
        <p className="mt-4 rounded-lg bg-cream p-3 text-sm text-muted">
          This is a preview. No order was sent and no payment was taken.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-full bg-brand px-6 py-2.5 font-bold text-white"
        >
          Back to menu
        </Link>
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="mt-10 text-center">
        <p className="text-muted">Your cart is empty.</p>
        <Link
          href="/"
          className="mt-4 inline-block rounded-full bg-brand px-6 py-2.5 font-bold text-white"
        >
          Browse the menu
        </Link>
      </div>
    );
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    setPlaced({
      number: String(Math.floor(1000 + Math.random() * 9000)),
      total,
      mode,
      name: String(data.get("name") || "friend").split(" ")[0],
    });
    clear();
  }

  const field =
    "mt-1 w-full rounded-lg border border-line bg-white px-3 py-3 text-base outline-none focus:border-brand focus:ring-2 focus:ring-brand/20";

  return (
    <form onSubmit={onSubmit} className="mt-5 grid gap-5 pb-28 sm:mt-8 sm:gap-8 lg:grid-cols-[1fr_380px] lg:pb-0">
      <div className="space-y-5 sm:space-y-6">
        <fieldset className="rounded-2xl border border-line bg-white p-4 sm:p-6">
          <legend className="px-1 font-display text-xl font-bold uppercase text-brand">
            How do you want it?
          </legend>
          <ModeToggle className="mt-2" />
          {mode === "delivery" && (
            <label className="mt-4 block text-sm font-semibold">
              Delivery address
              <input name="address" required autoComplete="street-address" className={field} />
            </label>
          )}
          <label className="mt-4 block text-sm font-semibold">
            When
            <select name="when" className={field} defaultValue="asap">
              <option value="asap">As soon as possible (about 20 min)</option>
              <option value="30">In 30 minutes</option>
              <option value="60">In 1 hour</option>
            </select>
          </label>
        </fieldset>

        <fieldset className="rounded-2xl border border-line bg-white p-4 sm:p-6">
          <legend className="px-1 font-display text-xl font-bold uppercase text-brand">
            Your details
          </legend>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-semibold">
              Name
              <input name="name" required autoComplete="name" className={field} />
            </label>
            <label className="block text-sm font-semibold">
              Phone
              <input name="phone" type="tel" inputMode="tel" required autoComplete="tel" className={field} />
            </label>
          </div>
          <label className="mt-4 block text-sm font-semibold">
            Notes for the kitchen
            <textarea name="notes" rows={2} className={field} />
          </label>
        </fieldset>

        <fieldset className="rounded-2xl border border-line bg-white p-4 sm:p-6">
          <legend className="px-1 font-display text-xl font-bold uppercase text-brand">
            Payment
          </legend>
          <label className="flex items-center gap-3 rounded-xl border-2 border-brand bg-brand/5 p-4 font-semibold">
            <input type="radio" name="pay" value="store" defaultChecked />
            Pay at {mode === "pickup" ? "pickup" : "the door"}
          </label>
          <label className="mt-3 flex items-center gap-3 rounded-xl border border-line p-4 text-muted">
            <input type="radio" name="pay" value="card" disabled />
            Pay online with card (coming soon)
          </label>
        </fieldset>
      </div>

      <aside className="order-first h-fit rounded-2xl border border-line bg-white p-4 sm:p-6 lg:order-none lg:sticky lg:top-24">
        <h2 className="font-display text-xl font-bold uppercase text-brand">Order summary</h2>
        <ul className="mt-2 divide-y divide-line">
          {lines.map((l) => (
            <CartRow key={l.key} line={l} />
          ))}
        </ul>
        <div className="mt-4 border-t border-line pt-4">
          <Totals subtotal={subtotal} tax={tax} total={total} />
        </div>
        <button
          type="submit"
          className="mt-5 hidden w-full rounded-full bg-brand py-3 font-bold uppercase tracking-wider text-white hover:bg-brand-dark lg:block"
        >
          Place order · {money(total)}
        </button>
      </aside>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-white/95 p-3 backdrop-blur lg:hidden">
        <button
          type="submit"
          className="flex h-14 w-full items-center justify-between rounded-full bg-brand px-6 font-bold text-white"
        >
          <span>Place order</span>
          <span className="tabular-nums">{money(total)}</span>
        </button>
      </div>
    </form>
  );
}
