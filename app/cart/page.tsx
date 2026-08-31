"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { QuantityStepper } from "@/components/QuantityStepper";
import { CartIcon, TrashIcon, CupIcon } from "@/components/icons";
import { useCart } from "@/lib/cart";
import { useLanguage } from "@/lib/i18n";
import { business } from "@/data/business";
import { filsToAedLabel } from "@/lib/money";

function CartThumbnail({ slug, name }: { slug: string; name: string }) {
  const [errored, setErrored] = useState(false);
  if (errored) {
    return (
      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-navy to-brand-blue">
        <CupIcon className="h-5 w-5 text-white/85" />
      </div>
    );
  }
  return (
    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-brand-blue-light">
      <Image src={`/images/products/${slug}.webp`} alt={name} fill sizes="64px" className="object-cover" onError={() => setErrored(true)} />
    </div>
  );
}

export default function CartPage() {
  const { lines, subtotalFils, totalFils, incrementQty, decrementQty, removeItem, clearCart } = useCart();
  const { language, t } = useLanguage();

  return (
    <>
      <SiteHeader />
      <main className="flex-1 pb-8">
        <div className="mx-auto max-w-2xl px-4 pt-8 sm:px-6">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="font-heading text-2xl font-bold text-brand-ink">{t("yourCart")}</h1>
            {lines.length > 0 && (
              <button type="button" onClick={clearCart} className="text-sm font-semibold text-brand-muted transition-colors hover:text-red-600">
                {t("clearCart")}
              </button>
            )}
          </div>

          {lines.length === 0 ? (
            <div className="flex flex-col items-center gap-4 rounded-3xl border border-dashed border-brand-line bg-white px-6 py-16 text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-blue-light text-brand-blue">
                <CartIcon className="h-6 w-6" />
              </span>
              <p className="text-brand-muted">{t("cartEmpty")}</p>
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-full bg-brand-navy px-6 py-3 text-sm font-bold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                {t("browseMenu")}
              </Link>
            </div>
          ) : (
            <>
              <ul className="flex flex-col gap-3">
                {lines.map((line) => (
                  <li key={line.slug} className="flex items-center gap-3 rounded-3xl bg-white p-3 ring-1 ring-brand-line/60">
                    <CartThumbnail slug={line.slug} name={language === "ar" ? line.nameAr : line.nameEn} />
                    <div className="flex min-w-0 flex-1 flex-col gap-1">
                      <span className="truncate font-heading text-sm font-semibold text-brand-ink">
                        {language === "ar" ? line.nameAr : line.nameEn}
                      </span>
                      {line.note && <span className="truncate text-xs text-brand-muted">{line.note}</span>}
                      <span className="text-xs font-semibold text-brand-navy">
                        {filsToAedLabel(line.priceFils * line.qty)} {business.currency.label[language]}
                      </span>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-2">
                      <QuantityStepper qty={line.qty} onIncrement={() => incrementQty(line.slug)} onDecrement={() => decrementQty(line.slug)} />
                      <button
                        type="button"
                        onClick={() => removeItem(line.slug)}
                        aria-label={t("remove")}
                        className="text-brand-muted transition-colors hover:text-red-600"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-6 flex flex-col gap-2 rounded-3xl bg-brand-cream p-5">
                <div className="flex items-center justify-between text-sm text-brand-muted">
                  <span>{t("subtotal")}</span>
                  <span className="font-semibold text-brand-ink">
                    {filsToAedLabel(subtotalFils)} {business.currency.label[language]}
                  </span>
                </div>
                <div className="flex items-center justify-between border-t border-brand-line/70 pt-2 text-base font-bold text-brand-ink">
                  <span>{t("total")}</span>
                  <span>
                    {filsToAedLabel(totalFils)} {business.currency.label[language]}
                  </span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="mt-4 flex w-full items-center justify-center rounded-full bg-brand-navy px-6 py-4 text-base font-bold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 active:scale-[0.98]"
              >
                {t("proceedToCheckout")}
              </Link>
            </>
          )}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
