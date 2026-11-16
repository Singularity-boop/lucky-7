"use client";

import Image from "next/image";
import Link from "next/link";
import { money, store } from "../lib/menu";
import { useCart } from "./cart";
import { ModeToggle } from "./CartPanel";

export function Header() {
  const { count, total, setOpen } = useCart();

  return (
    <header
      className="sticky top-0 z-30 h-[64px] bg-white text-ink shadow-sm"
      style={{ viewTransitionName: "site-header" }}
    >
      <div className="mx-auto flex h-full max-w-7xl items-center gap-4 px-4">
        <Link
          href="/"
          transitionTypes={["nav-back"]}
          className="flex shrink-0 items-center"
          aria-label="Lucky 7 Deli and Market, home"
        >
          <Image
            src="/brand/logo.svg"
            alt="Lucky 7 Deli and Market"
            width={678}
            height={178}
            priority
            className="h-[34px] w-auto sm:h-[44px]"
          />
        </Link>

        <div className="ml-4 hidden items-center gap-2 text-xs text-muted xl:flex">
          <span className="h-2 w-2 rounded-full bg-teal" />
          {store.hours} · {store.address}, Lawrence
        </div>

        <div className="ml-auto flex items-center gap-3">
          <ModeToggle className="hidden w-52 md:grid" />
          <a
            href={`tel:${store.phone}`}
            className="hidden text-sm font-semibold text-brand hover:text-brand-dark sm:block"
          >
            {store.phone}
          </a>
          <button
            onClick={() => setOpen(true)}
            className="relative flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full bg-action px-3 py-2 text-sm font-bold text-white transition hover:bg-action-dark active:scale-95 sm:px-4 lg:hidden"
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
                <span key={`pill-${count}`} className="anim-bump hidden rounded-full bg-white/20 px-2 tabular-nums sm:inline-block">
                  {count} · {money(total)}
                </span>
                <span
                  key={`badge-${count}`}
                  className="anim-bump absolute -left-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-navy px-1 text-[11px] text-white ring-2 ring-white sm:hidden">
                  {count}
                </span>
              </>
            )}
          </button>
        </div>
      </div>
      <div aria-hidden className="pinstripe absolute inset-x-0 bottom-0" />
    </header>
  );
}
