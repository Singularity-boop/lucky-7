"use client";

import { useEffect } from "react";
import { useCart } from "./cart";
import { CartPanel } from "./CartPanel";

/** Slide-in cart sheet, used on phones and wherever the sidebar isn't visible. */
export function CartDrawer() {
  const { open, setOpen } = useCart();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  return (
    <div className={`fixed inset-0 z-50 ${open ? "" : "pointer-events-none"}`} aria-hidden={!open}>
      <div
        onClick={() => setOpen(false)}
        className={`absolute inset-0 bg-black/50 transition-opacity ${open ? "opacity-100" : "opacity-0"}`}
      />
      <aside
        role="dialog"
        aria-label="Your order"
        className={`absolute right-0 top-0 h-full w-full max-w-md bg-card shadow-2xl transition-transform ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <button
          onClick={() => setOpen(false)}
          className="absolute right-4 top-4 z-10 text-sm font-semibold text-muted"
        >
          Close
        </button>
        <CartPanel onCheckout={() => setOpen(false)} />
      </aside>
    </div>
  );
}
