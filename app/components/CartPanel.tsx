"use client";

import Link from "next/link";
import { findItem, money, priceOf, store } from "../lib/menu";
import { useCart, type CartLine } from "./cart";

export function ModeToggle({ className = "" }: { className?: string }) {
  const { mode, setMode } = useCart();
  return (
    <div className={`grid grid-cols-2 rounded-full bg-cream p-1 text-sm font-bold ${className}`}>
      {(["pickup", "delivery"] as const).map((m) => (
        <button
          key={m}
          onClick={() => setMode(m)}
          aria-pressed={mode === m}
          className={`rounded-full py-2 capitalize transition ${
            mode === m ? "bg-char text-white shadow" : "text-muted"
          }`}
        >
          {m}
        </button>
      ))}
    </div>
  );
}

/** The order summary, used in the desktop sidebar and the mobile cart sheet. */
export function CartPanel({ onCheckout }: { onCheckout?: () => void }) {
  const { lines, subtotal, tax, total, mode } = useCart();

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-line p-4">
        <h2 className="font-display text-xl font-bold uppercase">Your order</h2>
        <ModeToggle className="mt-3" />
        <p className="mt-2 text-xs text-muted">
          {mode === "pickup"
            ? `Pickup at ${store.address}, ready in about 20 min`
            : "Delivery in about 45 min"}
        </p>
      </div>

      {lines.length === 0 ? (
        <div className="grid flex-1 place-items-center p-8 text-center">
          <div>
            <p className="font-display text-4xl font-bold text-line">7</p>
            <p className="mt-2 font-semibold">Your cart is empty</p>
            <p className="text-sm text-muted">Add something tasty from the menu.</p>
          </div>
        </div>
      ) : (
        <>
          <ul className="flex-1 divide-y divide-line overflow-y-auto px-4">
            {lines.map((l) => (
              <CartRow key={l.key} line={l} />
            ))}
          </ul>
          <div className="border-t border-line p-4">
            <Totals subtotal={subtotal} tax={tax} total={total} />
            <Link
              href="/checkout"
              onClick={onCheckout}
              className="mt-4 flex h-12 items-center justify-between rounded-full bg-brand px-6 font-bold text-white hover:bg-brand-dark"
            >
              <span>Checkout</span>
              <span className="tabular-nums">{money(total)}</span>
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

export function CartRow({ line }: { line: CartLine }) {
  const { setQty } = useCart();
  const found = findItem(line.itemId);
  if (!found) return null;
  const { item } = found;
  const details = [line.size, line.option].filter(Boolean).join(" · ");

  return (
    <li className="flex gap-3 py-3">
      <div className="min-w-0 flex-1">
        <p className="font-semibold leading-tight">{item.name}</p>
        {details && <p className="text-sm text-muted">{details}</p>}
        {line.note && <p className="truncate text-xs italic text-muted">“{line.note}”</p>}
        <div className="mt-2 inline-flex items-center rounded-full border border-line">
          <button
            onClick={() => setQty(line.key, line.qty - 1)}
            className="h-8 w-8"
            aria-label={`Remove one ${item.name}`}
          >
            −
          </button>
          <span className="w-5 text-center text-sm font-bold tabular-nums">{line.qty}</span>
          <button
            onClick={() => setQty(line.key, line.qty + 1)}
            className="h-8 w-8"
            aria-label={`Add one more ${item.name}`}
          >
            +
          </button>
        </div>
      </div>
      <span className="font-bold tabular-nums">{money(priceOf(item, line.size) * line.qty)}</span>
    </li>
  );
}

export function Totals({ subtotal, tax, total }: { subtotal: number; tax: number; total: number }) {
  return (
    <dl className="space-y-1 text-sm">
      <div className="flex justify-between">
        <dt className="text-muted">Subtotal</dt>
        <dd className="tabular-nums">{money(subtotal)}</dd>
      </div>
      <div className="flex justify-between">
        <dt className="text-muted">NJ sales tax</dt>
        <dd className="tabular-nums">{money(tax)}</dd>
      </div>
      <div className="flex justify-between pt-1 text-base font-bold">
        <dt>Total</dt>
        <dd className="tabular-nums">{money(total)}</dd>
      </div>
    </dl>
  );
}
