"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { menu, type MenuItem } from "@/data/menu";
import { useLanguage } from "@/lib/i18n";
import { useCart } from "@/lib/cart";
import { useProductDetail } from "@/lib/productDetail";
import { business } from "@/data/business";
import { QuantityStepper } from "@/components/QuantityStepper";
import { CloseIcon, CupIcon } from "@/components/icons";

const allItems = menu.flatMap((category) => category.items);

export function ProductDetailSheet() {
  const { openSlug, close } = useProductDetail();

  useEffect(() => {
    if (!openSlug) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [openSlug, close]);

  const item = openSlug ? allItems.find((i) => i.slug === openSlug) : null;
  if (!item) return null;

  // Keying on the slug forces a fresh mount (and fresh qty/note state) every
  // time a different product is opened, instead of resetting state in an effect.
  return <ProductDetailSheetContent key={item.slug} item={item} close={close} />;
}

function ProductDetailSheetContent({ item, close }: { item: MenuItem; close: () => void }) {
  const { language, t } = useLanguage();
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [note, setNote] = useState("");
  const [imgErrored, setImgErrored] = useState(false);

  const handleAdd = () => {
    addItem(item.slug, qty, note.trim() || undefined);
    close();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4" role="dialog" aria-modal="true">
      <div aria-hidden onClick={close} className="absolute inset-0 bg-brand-ink/50 backdrop-blur-sm" />

      <div className="relative flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:max-w-md sm:rounded-3xl">
        <button
          type="button"
          onClick={close}
          aria-label={t("close")}
          className="absolute end-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-brand-navy shadow-sm backdrop-blur transition-colors hover:bg-white"
        >
          <CloseIcon className="h-4 w-4" />
        </button>

        <div className="relative aspect-[4/3] w-full max-h-72 shrink-0 overflow-hidden bg-brand-blue-light">
          {!imgErrored ? (
            <Image
              src={`/images/products/${item.slug}.webp`}
              alt={item.name[language]}
              fill
              sizes="(min-width: 640px) 448px, 100vw"
              className={`object-cover ${item.available ? "" : "grayscale opacity-60"}`}
              onError={() => setImgErrored(true)}
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-brand-navy to-brand-blue">
              <CupIcon className="h-8 w-8 text-white/85" />
              <span className="font-heading text-[10px] font-semibold uppercase tracking-[0.2em] text-white/60">SJ Cafe</span>
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-5">
          <div>
            <h2 className="font-heading text-xl font-bold text-brand-ink">{item.name[language]}</h2>
            <p className="mt-1 text-lg font-bold text-brand-navy">
              {item.price} <span className="text-sm font-medium text-brand-muted">{business.currency.label[language]}</span>
            </p>
          </div>

          {!item.available ? (
            <p className="rounded-2xl bg-brand-blue-light px-4 py-3 text-sm font-semibold text-brand-muted">
              {t("unavailable")}
            </p>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-brand-ink">{t("quantity")}</span>
                <QuantityStepper qty={qty} size="lg" onIncrement={() => setQty((q) => q + 1)} onDecrement={() => setQty((q) => Math.max(1, q - 1))} />
              </div>

              <label className="flex flex-col gap-1.5">
                <span className="text-sm font-semibold text-brand-ink">{t("noteOptional")}</span>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={2}
                  placeholder={t("notePlaceholder")}
                  className="resize-none rounded-2xl border border-brand-line bg-white px-4 py-3 text-sm text-brand-ink outline-none transition-shadow focus:border-brand-blue/40 focus:ring-4 focus:ring-brand-blue/10"
                />
              </label>
            </>
          )}
        </div>

        {item.available && (
          <div className="border-t border-brand-line/70 p-4">
            <button
              type="button"
              onClick={handleAdd}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-brand-navy px-6 py-4 text-base font-bold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 active:scale-[0.98]"
            >
              {t("addToCart")} · {item.price * qty} {business.currency.label[language]}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
