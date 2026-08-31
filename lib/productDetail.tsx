"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

type ProductDetailContextValue = {
  openSlug: string | null;
  open: (slug: string) => void;
  close: () => void;
};

const ProductDetailContext = createContext<ProductDetailContextValue | null>(null);

export function ProductDetailProvider({ children }: { children: ReactNode }) {
  const [openSlug, setOpenSlug] = useState<string | null>(null);

  const value = useMemo<ProductDetailContextValue>(
    () => ({
      openSlug,
      open: (slug) => setOpenSlug(slug),
      close: () => setOpenSlug(null),
    }),
    [openSlug],
  );

  return <ProductDetailContext.Provider value={value}>{children}</ProductDetailContext.Provider>;
}

export function useProductDetail() {
  const ctx = useContext(ProductDetailContext);
  if (!ctx) {
    throw new Error("useProductDetail must be used within a ProductDetailProvider");
  }
  return ctx;
}
