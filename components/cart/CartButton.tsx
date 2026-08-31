"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/lib/cart";
import { useLanguage } from "@/lib/i18n";
import { business } from "@/data/business";
import { filsToAedLabel } from "@/lib/money";
import { CartIcon } from "@/components/icons";

export function CartButton() {
  const { totalQuantity, totalFils } = useCart();
  const { language, t } = useLanguage();
  const pathname = usePathname();

  // Don't float over the cart/checkout pages themselves — they already show
  // the full breakdown and a primary action button of their own.
  if (totalQuantity === 0 || pathname === "/cart" || pathname === "/checkout") return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 px-4 pb-[calc(env(safe-area-inset-bottom)+1rem)] pt-2 sm:flex sm:justify-center">
      <Link
        href="/cart"
        className="flex w-full items-center justify-between gap-3 rounded-2xl bg-brand-navy px-5 py-4 text-white shadow-xl shadow-brand-navy/30 transition-transform hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] sm:max-w-md"
      >
        <span className="flex items-center gap-2.5 text-sm font-semibold">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15">
            <CartIcon className="h-4 w-4" />
          </span>
          {t("viewCart")}
          <span className="rounded-full bg-white/15 px-2 py-0.5 text-xs font-bold tabular-nums">
            {totalQuantity} {totalQuantity === 1 ? t("item") : t("items")}
          </span>
        </span>
        <span className="text-sm font-bold tabular-nums">
          {filsToAedLabel(totalFils)} {business.currency.label[language]}
        </span>
      </Link>
    </div>
  );
}
