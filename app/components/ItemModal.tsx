"use client";

import { useEffect, useState } from "react";
import { money, type MenuCategory, type MenuItem } from "../lib/menu";
import { useCart } from "./cart";
import { ItemPhoto } from "./ItemPhoto";

export function ItemModal({
  item,
  category,
  onClose,
}: {
  item: MenuItem;
  category: MenuCategory;
  onClose: () => void;
}) {
  const { add } = useCart();
  const choice = item.choice ?? category.choice;
  const [size, setSize] = useState(item.sizes?.[0].label);
  const [option, setOption] = useState(choice?.options[0]);
  const [qty, setQty] = useState(1);
  const [note, setNote] = useState("");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const unit = item.sizes
    ? (item.sizes.find((s) => s.label === size) ?? item.sizes[0]).price
    : (item.price ?? 0);

  function submit() {
    add({ itemId: item.id, size, option, note: note.trim() || undefined, qty });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">
      <div className="absolute inset-0 bg-black/55" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={item.name}
        className="relative flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-t-3xl bg-card shadow-2xl sm:rounded-3xl"
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-xl shadow"
        >
          ×
        </button>
        <ItemPhoto id={item.id} name={item.name} className="h-52 w-full shrink-0 sm:h-60" />

        <div className="flex-1 overflow-y-auto p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-brand">{category.title}</p>
          <h2 className="mt-1 font-display text-3xl font-bold uppercase leading-tight">{item.name}</h2>
          {item.desc && <p className="mt-1 text-muted">{item.desc}</p>}

          {item.sizes && (
            <fieldset className="mt-5">
              <legend className="mb-2 flex w-full items-center justify-between text-sm font-bold">
                Choose size
                <span className="rounded bg-cream px-2 py-0.5 text-[11px] font-semibold uppercase text-muted">
                  Required
                </span>
              </legend>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {item.sizes.map((s) => (
                  <label
                    key={s.label}
                    className={`cursor-pointer rounded-xl border-2 px-3 py-2.5 text-center transition ${
                      size === s.label ? "border-brand bg-brand/5" : "border-line hover:border-ink/30"
                    }`}
                  >
                    <input
                      type="radio"
                      name="size"
                      className="sr-only"
                      checked={size === s.label}
                      onChange={() => setSize(s.label)}
                    />
                    <span className="block text-sm font-bold">{s.label}</span>
                    <span className="block text-sm tabular-nums text-muted">{money(s.price)}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          )}

          {choice && (
            <fieldset className="mt-5">
              <legend className="mb-2 text-sm font-bold">{choice.label}</legend>
              <div className="flex flex-wrap gap-2">
                {choice.options.map((o) => (
                  <button
                    key={o}
                    type="button"
                    onClick={() => setOption(o)}
                    aria-pressed={option === o}
                    className={`rounded-full border-2 px-4 py-1.5 text-sm font-semibold ${
                      option === o ? "border-brand bg-brand text-white" : "border-line hover:border-ink/30"
                    }`}
                  >
                    {o}
                  </button>
                ))}
              </div>
            </fieldset>
          )}

          <label className="mt-5 block text-sm font-bold">
            Special instructions
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={2}
              placeholder="e.g. extra crispy, no onions"
              className="mt-2 w-full rounded-xl border border-line px-3 py-2 font-normal outline-none focus:border-brand"
            />
          </label>
        </div>

        <div className="flex items-center gap-3 border-t border-line p-4">
          <div className="flex items-center rounded-full border border-line">
            <button
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="h-11 w-11 text-xl"
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span className="w-6 text-center font-bold tabular-nums">{qty}</span>
            <button
              onClick={() => setQty((q) => q + 1)}
              className="h-11 w-11 text-xl"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
          <button
            onClick={submit}
            className="flex h-12 flex-1 items-center justify-between rounded-full bg-brand px-6 font-bold text-white hover:bg-brand-dark"
          >
            <span>Add to cart</span>
            <span className="tabular-nums">{money(unit * qty)}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
