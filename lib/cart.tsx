"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { menu, type MenuItem } from "@/data/menu";
import { aedToFils } from "@/lib/money";

const STORAGE_KEY = "sj-cafe-cart";

export type CartLine = {
  slug: string;
  nameEn: string;
  nameAr: string;
  priceFils: number;
  qty: number;
  note?: string;
};

type CartContextValue = {
  lines: CartLine[];
  totalQuantity: number;
  subtotalFils: number;
  totalFils: number;
  getQty: (slug: string) => number;
  addItem: (slug: string, qty?: number, note?: string) => void;
  removeItem: (slug: string) => void;
  incrementQty: (slug: string) => void;
  decrementQty: (slug: string) => void;
  setNote: (slug: string, note: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

const allItems: Map<string, MenuItem> = new Map(
  menu.flatMap((category) => category.items).map((item) => [item.slug, item]),
);

function readStoredLines(): CartLine[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Read any previously saved cart after mount — localStorage isn't
  // available during server rendering, so doing this in an effect avoids a
  // hydration mismatch (same pattern as LanguageProvider in lib/i18n.tsx).
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional client-only hydration, see comment above
    setLines(readStoredLines());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  }, [lines, hydrated]);

  const value = useMemo<CartContextValue>(() => {
    const getQty = (slug: string) => lines.find((l) => l.slug === slug)?.qty ?? 0;

    const addItem: CartContextValue["addItem"] = (slug, qty = 1, note) => {
      const item = allItems.get(slug);
      if (!item) return;
      setLines((prev) => {
        const existing = prev.find((l) => l.slug === slug);
        if (existing) {
          return prev.map((l) =>
            l.slug === slug ? { ...l, qty: l.qty + qty, note: note ?? l.note } : l,
          );
        }
        return [
          ...prev,
          {
            slug,
            nameEn: item.name.en,
            nameAr: item.name.ar,
            priceFils: aedToFils(item.price),
            qty,
            note,
          },
        ];
      });
    };

    const removeItem: CartContextValue["removeItem"] = (slug) => {
      setLines((prev) => prev.filter((l) => l.slug !== slug));
    };

    const incrementQty: CartContextValue["incrementQty"] = (slug) => {
      setLines((prev) => prev.map((l) => (l.slug === slug ? { ...l, qty: l.qty + 1 } : l)));
    };

    const decrementQty: CartContextValue["decrementQty"] = (slug) => {
      setLines((prev) =>
        prev
          .map((l) => (l.slug === slug ? { ...l, qty: l.qty - 1 } : l))
          .filter((l) => l.qty > 0),
      );
    };

    const setNote: CartContextValue["setNote"] = (slug, note) => {
      setLines((prev) => prev.map((l) => (l.slug === slug ? { ...l, note } : l)));
    };

    const clearCart = () => setLines([]);

    const totalQuantity = lines.reduce((sum, l) => sum + l.qty, 0);
    const subtotalFils = lines.reduce((sum, l) => sum + l.priceFils * l.qty, 0);
    const totalFils = subtotalFils;

    return {
      lines,
      totalQuantity,
      subtotalFils,
      totalFils,
      getQty,
      addItem,
      removeItem,
      incrementQty,
      decrementQty,
      setNote,
      clearCart,
    };
  }, [lines]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return ctx;
}
