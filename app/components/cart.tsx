"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { findItem, priceOf, TAX_RATE } from "../lib/menu";

export type CartLine = {
  key: string; // itemId + size + option, so "12 Pcs. BBQ" and "12 Pcs. Mild" are separate lines
  itemId: string;
  size?: string;
  option?: string;
  note?: string;
  qty: number;
};

export type OrderMode = "pickup" | "delivery";

type CartContextValue = {
  lines: CartLine[];
  count: number;
  subtotal: number;
  tax: number;
  total: number;
  mode: OrderMode;
  setMode: (mode: OrderMode) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  add: (line: Omit<CartLine, "key">) => void;
  setQty: (key: string, qty: number) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "lucky7-cart-v3";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [mode, setMode] = useState<OrderMode>("pickup");
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null");
      if (saved) {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrate from storage once on mount
        setLines(saved.lines ?? []);
        setMode(saved.mode ?? "pickup");
      }
    } catch {}
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ lines, mode }));
    } catch {}
  }, [lines, mode, loaded]);

  const add = useCallback((line: Omit<CartLine, "key">) => {
    const key = [line.itemId, line.size, line.option, line.note].filter(Boolean).join(":");
    setLines((prev) => {
      const existing = prev.find((l) => l.key === key);
      if (existing)
        return prev.map((l) => (l.key === key ? { ...l, qty: l.qty + line.qty } : l));
      return [...prev, { ...line, key }];
    });
  }, []);

  const setQty = useCallback((key: string, qty: number) => {
    setLines((prev) =>
      qty <= 0
        ? prev.filter((l) => l.key !== key)
        : prev.map((l) => (l.key === key ? { ...l, qty } : l)),
    );
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const value = useMemo(() => {
    const subtotal = lines.reduce((sum, l) => {
      const found = findItem(l.itemId);
      return sum + (found ? priceOf(found.item, l.size) : 0) * l.qty;
    }, 0);
    const tax = Math.round(subtotal * TAX_RATE * 100) / 100;
    return {
      lines,
      count: lines.reduce((n, l) => n + l.qty, 0),
      subtotal,
      tax,
      total: subtotal + tax,
      mode,
      setMode,
      open,
      setOpen,
      add,
      setQty,
      clear,
    };
  }, [lines, mode, open, add, setQty, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
