"use client";

import { useLanguage } from "@/lib/i18n";
import { useProductDetail } from "@/lib/productDetail";
import { ProductImage } from "@/components/ProductImage";
import { AddToCartControl } from "@/components/AddToCartControl";
import { business } from "@/data/business";
import type { MenuItem } from "@/data/menu";

type ProductCardProps = {
  item: MenuItem;
  priority?: boolean;
  sizes?: string;
};

export function ProductCard({ item, priority, sizes }: ProductCardProps) {
  const { language } = useLanguage();
  const { open } = useProductDetail();

  // A <div role="button"> rather than a real <button> — the Add/stepper
  // control inside is itself a real <button>, and interactive elements
  // can't nest (invalid HTML, breaks hydration).
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => open(item.slug)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          open(item.slug);
        }
      }}
      className="group flex cursor-pointer flex-col overflow-hidden rounded-3xl bg-white text-start ring-1 ring-brand-line/60 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-brand-navy/[0.08] hover:ring-brand-line"
    >
      <ProductImage slug={item.slug} name={item.name[language]} available={item.available} priority={priority} sizes={sizes} />
      <div className="flex flex-1 flex-col gap-2 p-3.5">
        <h3 className="line-clamp-2 font-heading text-sm font-semibold text-brand-ink">{item.name[language]}</h3>
        <div className="mt-auto flex items-end justify-between gap-2 pt-1">
          <span className={`flex items-baseline gap-1 ${item.available ? "text-brand-navy" : "text-brand-muted"}`}>
            <span className="text-base font-bold">{item.price}</span>
            <span className="text-xs font-medium text-brand-muted">{business.currency.label[language]}</span>
          </span>
          <AddToCartControl slug={item.slug} available={item.available} />
        </div>
      </div>
    </div>
  );
}
