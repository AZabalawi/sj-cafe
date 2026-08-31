"use client";

import { useRef } from "react";
import { menu } from "@/data/menu";
import { useLanguage } from "@/lib/i18n";
import { useProductDetail } from "@/lib/productDetail";
import { ProductImage } from "@/components/ProductImage";
import { AddToCartControl } from "@/components/AddToCartControl";
import { business } from "@/data/business";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/icons";

const featuredItems = menu.flatMap((category) => category.items).filter((item) => item.featured);

export function BestSellers() {
  const { language, dir, t } = useLanguage();
  const { open } = useProductDetail();
  const scrollerRef = useRef<HTMLDivElement>(null);

  if (featuredItems.length === 0) return null;

  const scrollByAmount = (direction: "prev" | "next") => {
    const el = scrollerRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.8;
    // In RTL, "next" (forward through the list) is visually leftward.
    const sign = direction === "next" ? 1 : -1;
    const flipped = dir === "rtl" ? -sign : sign;
    el.scrollBy({ left: flipped * amount, behavior: "smooth" });
  };

  return (
    <section className="bg-brand-cream/60 py-8 sm:py-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-4 flex items-end justify-between">
          <div>
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.2em] text-brand-blue">
              {t("featuredKicker")}
            </span>
            <h2 className="font-heading text-xl font-bold text-brand-ink sm:text-2xl">{t("popularAtSj")}</h2>
          </div>
          <div className="hidden gap-2 sm:flex">
            <button
              type="button"
              onClick={() => scrollByAmount("prev")}
              aria-label={t("scrollPrevious")}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-brand-line bg-white text-brand-navy shadow-sm transition-colors hover:bg-brand-blue-light"
            >
              <ChevronLeftIcon className="h-4 w-4 rtl:-scale-x-100" />
            </button>
            <button
              type="button"
              onClick={() => scrollByAmount("next")}
              aria-label={t("scrollNext")}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-brand-line bg-white text-brand-navy shadow-sm transition-colors hover:bg-brand-blue-light"
            >
              <ChevronRightIcon className="h-4 w-4 rtl:-scale-x-100" />
            </button>
          </div>
        </div>

        <div
          ref={scrollerRef}
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {featuredItems.map((item, index) => (
            // A <div role="button"> rather than a real <button> — the Add
            // control inside is itself a real <button>, and interactive
            // elements can't nest (invalid HTML, breaks hydration).
            <div
              key={item.slug}
              role="button"
              tabIndex={0}
              onClick={() => open(item.slug)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  open(item.slug);
                }
              }}
              className="group flex w-[68%] shrink-0 cursor-pointer snap-start flex-col overflow-hidden rounded-3xl bg-white text-start ring-1 ring-brand-line/60 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-brand-navy/[0.08] sm:w-[240px]"
            >
              <div className="relative">
                <ProductImage
                  slug={item.slug}
                  name={item.name[language]}
                  available={item.available}
                  priority={index === 0}
                  sizes="(min-width: 640px) 240px, 68vw"
                  rounded="rounded-t-3xl"
                />
                <span className="absolute start-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-brand-navy shadow-sm backdrop-blur-sm">
                  {t("featuredKicker")}
                </span>
              </div>
              <div className="flex flex-1 flex-col gap-2 p-4">
                <h3 className="line-clamp-2 font-heading text-sm font-semibold text-brand-ink">{item.name[language]}</h3>
                <div className="mt-auto flex items-end justify-between gap-2 pt-1">
                  <span className="flex items-baseline gap-1 text-brand-navy">
                    <span className="text-base font-bold">{item.price}</span>
                    <span className="text-xs font-medium text-brand-muted">{business.currency.label[language]}</span>
                  </span>
                  <AddToCartControl slug={item.slug} available={item.available} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
