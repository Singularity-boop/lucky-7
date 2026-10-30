"use client";

import Link from "next/link";
import { money, store } from "../lib/menu";
import { useCart } from "./cart";
import { ModeToggle } from "./CartPanel";

export function Header() {
  const { count, total, setOpen } = useCart();

  return (
    <header className="sticky top-0 z-30 h-[60px] bg-char text-white">
      <div className="mx-auto flex h-full max-w-7xl items-center gap-4 px-4">
        <Link href="/" className="flex min-w-0 items-center gap-2 leading-none">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand font-display text-2xl font-bold">
            7
          </span>
          <span className="min-w-0">
            <span className="block font-display text-xl font-bold uppercase tracking-wide">
              Lucky 7
            </span>
            <span className="block truncate text-[10px] font-semibold uppercase tracking-[0.14em] text-white/60">
              <span className="sm:hidden">Deli · Fried Chicken</span>
              <span className="hidden sm:inline">{store.tagline}</span>
            </span>
          </span>
        </Link>

        <div className="ml-4 hidden items-center gap-2 text-xs text-white/70 xl:flex">
          <span className="h-2 w-2 rounded-full bg-green-400" />
          {store.hours} · {store.address}, Lawrence
        </div>

        <div className="ml-auto flex items-center gap-3">
          <ModeToggle className="hidden w-52 bg-white/10 md:grid [&_button[aria-pressed=false]]:text-white/70 [&_button[aria-pressed=true]]:bg-brand" />
          <a
            href={`tel:${store.phone}`}
            className="hidden text-sm font-semibold text-white/80 hover:text-white sm:block"
          >
            {store.phone}
          </a>
          <button
            onClick={() => setOpen(true)}
            className="relative flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full bg-brand px-3 py-2 text-sm font-bold hover:bg-brand-dark sm:px-4 lg:hidden"
            aria-label={`Open cart, ${count} items`}
          >
            <svg aria-hidden viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 7h12l-1 13H7L6 7Z" strokeLinejoin="round" />
              <path d="M9 7a3 3 0 0 1 6 0" />
            </svg>
            <span className="hidden sm:inline">Cart</span>
            {count > 0 && (
              <>
                <span className="tabular-nums sm:hidden">{money(total)}</span>
                <span className="hidden rounded-full bg-white/20 px-2 tabular-nums sm:inline">
                  {count} · {money(total)}
                </span>
                <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-gold px-1 text-[11px] text-char sm:hidden">
                  {count}
                </span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
