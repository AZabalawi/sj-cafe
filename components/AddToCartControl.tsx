"use client";

import { useCart } from "@/lib/cart";
import { useLanguage } from "@/lib/i18n";
import { PlusIcon } from "@/components/icons";
import { QuantityStepper } from "@/components/QuantityStepper";

type AddToCartControlProps = {
  slug: string;
  available: boolean;
  size?: "sm" | "lg";
};

export function AddToCartControl({ slug, available, size = "sm" }: AddToCartControlProps) {
  const { getQty, addItem, incrementQty, decrementQty } = useCart();
  const { t } = useLanguage();
  const qty = getQty(slug);

  if (!available) {
    return (
      <span className="inline-flex items-center rounded-full bg-brand-blue-light px-3 py-1.5 text-xs font-semibold text-brand-muted">
        {t("unavailable")}
      </span>
    );
  }

  if (qty > 0) {
    return (
      <QuantityStepper
        qty={qty}
        size={size}
        onIncrement={() => incrementQty(slug)}
        onDecrement={() => decrementQty(slug)}
      />
    );
  }

  const isLg = size === "lg";

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        addItem(slug, 1);
      }}
      className={`inline-flex items-center justify-center gap-1.5 rounded-full bg-brand-navy font-bold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 active:scale-95 ${
        isLg ? "px-6 py-3.5 text-sm" : "px-3.5 py-1.5 text-xs"
      }`}
    >
      <PlusIcon className={isLg ? "h-4 w-4" : "h-3 w-3"} />
      {t("add")}
    </button>
  );
}
