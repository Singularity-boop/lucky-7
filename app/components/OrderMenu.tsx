"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { fromPrice, menu, money, type MenuCategory, type MenuItem } from "../lib/menu";
import { useCart } from "./cart";
import { CartPanel } from "./CartPanel";
import { ItemModal } from "./ItemModal";
import { ItemPhoto } from "./ItemPhoto";

type Selected = { item: MenuItem; category: MenuCategory };

const popular: MenuCategory = {
  id: "popular",
  title: "Popular",
  items: menu.flatMap((c) => c.items.filter((i) => i.popular)),
};

export function OrderMenu() {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState("popular");
  const [selected, setSelected] = useState<Selected | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const [pill, setPill] = useState<{ x: number; w: number } | null>(null);
  // While a tapped tab smooth-scrolls the page, ignore the scroll spy so the pill
  // goes straight to the tapped tab instead of stepping through every section.
  const locked = useRef<number | undefined>(undefined);
  const q = query.trim().toLowerCase();

  const sections = useMemo(() => {
    const all = [popular, ...menu];
    if (!q) return all;
    return menu
      .map((c) => ({
        ...c,
        items: c.items.filter(
          (i) => `${i.name} ${i.desc ?? ""} ${c.title}`.toLowerCase().includes(q),
        ),
      }))
      .filter((c) => c.items.length > 0);
  }, [q]);

  // Highlight the category tab for the section in view.
  useEffect(() => {
    const els = sections.map((s) => document.getElementById(s.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        const top = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (top && locked.current === undefined) setActive(top.target.id);
      },
      { rootMargin: "-120px 0px -55% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [sections]);

  // Slide the active-tab pill and keep the active tab centred in the tab bar.
  // Scrolling the nav itself (not scrollIntoView) leaves the page's own smooth scroll alone.
  useLayoutEffect(() => {
    const nav = navRef.current;
    const tab = document.getElementById(`tab-${active}`);
    if (!nav || !tab) return;
    const place = () => setPill({ x: tab.offsetLeft, w: tab.offsetWidth });
    place();
    nav.scrollTo({ left: tab.offsetLeft - (nav.clientWidth - tab.offsetWidth) / 2, behavior: "smooth" });
    const ro = new ResizeObserver(place);
    ro.observe(nav);
    return () => ro.disconnect();
  }, [active, sections]);

  function goTo(id: string) {
    window.clearTimeout(locked.current);
    locked.current = window.setTimeout(() => (locked.current = undefined), 900);
    setActive(id);
  }

  const categoryOf = (item: MenuItem) => menu.find((c) => c.items.includes(item))!;

  return (
    <>
      <div className="sticky top-[64px] z-20 border-b border-line bg-card/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-2">
          <nav ref={navRef} className="no-scrollbar relative -mx-1 flex flex-1 gap-1 overflow-x-auto px-1">
            {pill && (
              <span
                aria-hidden
                className="absolute left-0 top-0 h-full rounded-full bg-brand transition-[translate,width] duration-300 ease-out"
                style={{ translate: `${pill.x}px 0`, width: pill.w }}
              />
            )}
            {sections.map((c) => (
              <a
                key={c.id}
                id={`tab-${c.id}`}
                href={`#${c.id}`}
                onClick={() => goTo(c.id)}
                aria-current={active === c.id ? "true" : undefined}
                className={`relative whitespace-nowrap rounded-full px-4 py-2 text-sm font-bold transition-colors duration-300 ${
                  active === c.id ? "text-white" : "text-ink hover:bg-soft"
                } ${active === c.id && !pill ? "bg-brand" : ""}`}
              >
                {c.title}
              </a>
            ))}
          </nav>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search menu"
            aria-label="Search the menu"
            className="hidden w-56 rounded-full border border-line bg-soft px-4 py-2 text-sm outline-none focus:border-brand md:block"
          />
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-8 px-3 pb-28 pt-4 sm:px-4 sm:py-6 lg:grid-cols-[1fr_360px] lg:pb-6">
        <div>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search: cheesesteak, wings, omelette…"
            aria-label="Search the menu"
            className="mb-5 w-full rounded-full border border-line bg-card px-5 py-3 text-base outline-none focus:border-brand md:hidden"
          />
          {sections.length === 0 && (
            <p className="py-20 text-center text-muted">Nothing matches “{query}”.</p>
          )}
          {sections.map((c) => (
            <section key={c.id} id={c.id} className="mb-8 scroll-mt-[136px] sm:mb-10">
              <div className="mb-4 flex items-baseline justify-between gap-4">
                <h2 className="font-display text-2xl font-bold uppercase sm:text-3xl">{c.title}</h2>
                <span className="text-sm text-muted">{c.items.length} items</span>
              </div>
              {c.note && <p className="-mt-2 mb-4 text-sm text-muted">{c.note}</p>}
              <ul className="grid grid-cols-2 gap-2.5 sm:gap-4 md:grid-cols-3">
                {c.items.map((item) => (
                  <ItemCard
                    key={`${c.id}-${item.id}`}
                    item={item}
                    onOpen={() => setSelected({ item, category: categoryOf(item) })}
                  />
                ))}
              </ul>
            </section>
          ))}
        </div>

        <aside className="hidden lg:block">
          <div className="sticky top-[140px] h-[calc(100vh-156px)] overflow-hidden rounded-2xl border border-line bg-card shadow-sm">
            <CartPanel />
          </div>
        </aside>
      </div>

      <MobileCartBar />

      {selected && (
        <ItemModal
          item={selected.item}
          category={selected.category}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  );
}

function ItemCard({ item, onOpen }: { item: MenuItem; onOpen: () => void }) {
  const { add } = useCart();
  const [added, setAdded] = useState(0);
  const simple = !item.sizes && !item.choice;
  const category = menu.find((c) => c.items.includes(item));
  const needsChoice = !!category?.choice;

  function quickAdd(e: React.MouseEvent) {
    e.stopPropagation();
    if (!simple || needsChoice) return onOpen();
    add({ itemId: item.id, qty: 1 });
    const stamp = Date.now();
    setAdded(stamp);
    window.setTimeout(() => setAdded((a) => (a === stamp ? 0 : a)), 1000);
  }

  return (
    <li>
      <div
        role="button"
        tabIndex={0}
        onClick={onOpen}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onOpen()}
        className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-line bg-card shadow-sm transition duration-200 ease-out hover:-translate-y-1 hover:shadow-lg active:scale-[0.98] active:duration-100"
      >
        <div className="relative">
          <ItemPhoto
            id={item.id}
            name={item.name}
            className="aspect-[4/3] w-full"
            imgClassName="group-hover:scale-[1.05]"
          />
          {item.popular && (
            <span className="absolute left-2 top-2 rounded-full bg-teal-dark px-2.5 py-0.5 text-[11px] font-bold uppercase text-white">
              Popular
            </span>
          )}
        </div>
        <div className="flex flex-1 flex-col p-2.5 sm:p-3">
          <h3 className="text-sm font-bold leading-tight sm:text-base">{item.name}</h3>
          {item.desc && <p className="mt-1 line-clamp-2 text-xs text-muted">{item.desc}</p>}
          {item.sizes && (
            <p className="mt-1 text-xs font-semibold text-brand">{item.sizes.length} sizes</p>
          )}
          <div className="mt-auto flex items-center justify-between pt-3">
            <span className="font-bold tabular-nums">
              {item.sizes && <span className="text-xs font-semibold text-muted">from </span>}
              {money(fromPrice(item))}
            </span>
            <button
              onClick={quickAdd}
              aria-label={`Add ${item.name}`}
              className={`grid h-9 w-9 place-items-center rounded-full text-xl font-bold text-white transition-[background-color,scale] duration-200 hover:scale-110 active:scale-90 ${
                added ? "bg-teal-dark" : "bg-action group-hover:bg-action-dark"
              }`}
            >
              <span key={added} className={added ? "anim-pop" : undefined}>
                {added ? "✓" : "+"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </li>
  );
}

function MobileCartBar() {
  const { count, total, setOpen } = useCart();
  if (count === 0) return null;
  return (
    <div className="anim-rise fixed inset-x-0 bottom-0 z-30 p-3 lg:hidden">
      <button
        onClick={() => setOpen(true)}
        className="flex h-14 w-full items-center justify-between rounded-full bg-action px-6 font-bold text-white shadow-xl transition active:scale-[0.98]"
      >
        <span key={count} className="anim-bump grid h-7 min-w-7 place-items-center rounded-full bg-white/20 px-2 text-sm">
          {count}
        </span>
        <span>View cart</span>
        <span className="tabular-nums">{money(total)}</span>
      </button>
    </div>
  );
}
