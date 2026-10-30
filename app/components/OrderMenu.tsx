"use client";

import { useEffect, useMemo, useState } from "react";
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
        if (top) setActive(top.target.id);
      },
      { rootMargin: "-120px 0px -55% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [sections]);

  useEffect(() => {
    document.getElementById(`tab-${active}`)?.scrollIntoView({ inline: "center", block: "nearest" });
  }, [active]);

  const categoryOf = (item: MenuItem) => menu.find((c) => c.items.includes(item))!;

  return (
    <>
      <div className="sticky top-[60px] z-20 border-b border-line bg-card/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-2">
          <nav className="no-scrollbar -mx-1 flex flex-1 gap-1 overflow-x-auto px-1">
            {sections.map((c) => (
              <a
                key={c.id}
                id={`tab-${c.id}`}
                href={`#${c.id}`}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-bold transition ${
                  active === c.id ? "bg-brand text-white" : "text-ink hover:bg-cream"
                }`}
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
            className="hidden w-56 rounded-full border border-line bg-cream px-4 py-2 text-sm outline-none focus:border-brand md:block"
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
            <section key={c.id} id={c.id} className="mb-8 scroll-mt-28 sm:mb-10 sm:scroll-mt-32">
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
          <div className="sticky top-[136px] h-[calc(100vh-152px)] overflow-hidden rounded-2xl border border-line bg-card shadow-sm">
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
  const [added, setAdded] = useState(false);
  const simple = !item.sizes && !item.choice;
  const category = menu.find((c) => c.items.includes(item));
  const needsChoice = !!category?.choice;

  function quickAdd(e: React.MouseEvent) {
    e.stopPropagation();
    if (!simple || needsChoice) return onOpen();
    add({ itemId: item.id, qty: 1 });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1000);
  }

  return (
    <li>
      <div
        role="button"
        tabIndex={0}
        onClick={onOpen}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onOpen()}
        className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-line bg-card shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
      >
        <div className="relative">
          <ItemPhoto id={item.id} name={item.name} className="aspect-[4/3] w-full" />
          {item.popular && (
            <span className="absolute left-2 top-2 rounded-full bg-gold px-2.5 py-0.5 text-[11px] font-bold uppercase text-char">
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
              className={`grid h-9 w-9 place-items-center rounded-full text-xl font-bold text-white transition ${
                added ? "bg-green-600" : "bg-brand group-hover:bg-brand-dark"
              }`}
            >
              {added ? "✓" : "+"}
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
    <div className="fixed inset-x-0 bottom-0 z-30 p-3 lg:hidden">
      <button
        onClick={() => setOpen(true)}
        className="flex h-14 w-full items-center justify-between rounded-full bg-brand px-6 font-bold text-white shadow-xl"
      >
        <span className="grid h-7 min-w-7 place-items-center rounded-full bg-white/20 px-2 text-sm">
          {count}
        </span>
        <span>View cart</span>
        <span className="tabular-nums">{money(total)}</span>
      </button>
    </div>
  );
}
