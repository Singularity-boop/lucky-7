"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { findItem, money, priceOf, store } from "../lib/menu";
import { useCart, type CartLine } from "./cart";

export function ModeToggle({ className = "" }: { className?: string }) {
  const { mode, setMode } = useCart();
  return (
    <div className={`relative grid grid-cols-2 rounded-full bg-soft p-1 text-sm font-bold ${className}`}>
      <span
        aria-hidden
        className={`absolute inset-y-1 left-1 w-[calc(50%-4px)] rounded-full bg-teal-dark shadow transition-[translate] duration-300 ease-out ${
          mode === "delivery" ? "translate-x-full" : "translate-x-0"
        }`}
      />
      {(["pickup", "delivery"] as const).map((m) => (
        <button
          key={m}
          onClick={() => setMode(m)}
          aria-pressed={mode === m}
          className={`relative rounded-full py-2 capitalize transition-colors duration-300 ${
            mode === m ? "text-white" : "text-muted hover:text-ink"
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
            <Image src="/brand/icon.svg" alt="" width={48} height={48} className="mx-auto h-12 w-12 opacity-30" />
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
              transitionTypes={["nav-forward"]}
              onClick={onCheckout}
              className="mt-4 flex h-12 items-center justify-between rounded-full bg-action px-6 font-bold text-white transition hover:bg-action-dark active:scale-[0.98]"
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
  const [leaving, setLeaving] = useState(false);
  const gone = useRef(false);
  const found = findItem(line.itemId);
  // Removing the last one collapses the row first, then drops it from the cart.
  const remove = () => {
    if (gone.current) return;
    gone.current = true;
    setQty(line.key, 0);
  };
  const minus = () => {
    if (line.qty > 1) return setQty(line.key, line.qty - 1);
    setLeaving(true);
    window.setTimeout(remove, 350);
  };
  if (!found) return null;
  const { item } = found;
  const details = [line.size, line.option].filter(Boolean).join(" · ");

  return (
    <li
      className="cart-row"
      data-leaving={leaving ? "" : undefined}
      onTransitionEnd={(e) => leaving && e.propertyName === "grid-template-rows" && remove()}
    >
      <div className="flex gap-3 py-3">
      <div className="min-w-0 flex-1">
        <p className="font-semibold leading-tight">{item.name}</p>
        {details && <p className="text-sm text-muted">{details}</p>}
        {line.note && <p className="truncate text-xs italic text-muted">“{line.note}”</p>}
        <div className="mt-2 inline-flex items-center rounded-full border border-line">
          <button
            onClick={minus}
            className="h-8 w-8 rounded-full transition hover:bg-soft active:scale-90"
            aria-label={`Remove one ${item.name}`}
          >
            −
          </button>
          <span className="w-5 text-center text-sm font-bold tabular-nums">{line.qty}</span>
          <button
            onClick={() => setQty(line.key, line.qty + 1)}
            className="h-8 w-8 rounded-full transition hover:bg-soft active:scale-90"
            aria-label={`Add one more ${item.name}`}
          >
            +
          </button>
        </div>
      </div>
      <span className="font-bold tabular-nums">{money(priceOf(item, line.size) * line.qty)}</span>
      </div>
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
