"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { menu as menuData, type MenuCategory } from "@/data/menu";
import { useLanguage } from "@/lib/i18n";
import { SearchIcon } from "@/components/icons";
import { ProductCard } from "@/components/ProductCard";

export function MenuBrowser() {
  const { language, t } = useLanguage();
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | undefined>(menuData[0]?.slug);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  const filteredCategories = useMemo<MenuCategory[]>(() => {
    const q = query.trim().toLowerCase();
    if (!q) return menuData;
    return menuData
      .map((category) => ({
        ...category,
        items: category.items.filter(
          (item) => item.name.en.toLowerCase().includes(q) || item.name.ar.includes(query.trim()),
        ),
      }))
      .filter((category) => category.items.length > 0);
  }, [query]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveCategory(entry.target.id.replace("category-", ""));
          }
        }
      },
      { rootMargin: "-150px 0px -65% 0px", threshold: 0 },
    );

    for (const category of filteredCategories) {
      const el = sectionRefs.current[category.slug];
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [filteredCategories]);

  const scrollToCategory = (slug: string) => {
    sectionRefs.current[slug]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div id="menu" className="relative scroll-mt-[98px]">
      {/* Faint, non-repeating monogram watermark — texture for the long white
          menu section without competing with the product photography. */}
      <span
        aria-hidden
        className="font-heading pointer-events-none absolute -top-6 end-0 select-none text-[13rem] font-bold leading-none text-brand-navy/[0.025]"
      >
        SJ
      </span>

      <div className="relative mx-auto max-w-6xl px-4 pt-10 sm:px-6">
        <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.2em] text-brand-blue">
          {t("fullMenuKicker")}
        </span>
        <div className="mb-4 flex items-center gap-3">
          <h2 className="font-heading text-xl font-bold text-brand-ink sm:text-2xl">{t("menuPageTitle")}</h2>
          <span aria-hidden className="h-px flex-1 bg-gradient-to-r from-brand-line to-transparent" />
        </div>
        <div className="relative">
          <SearchIcon className="pointer-events-none absolute start-4 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-muted" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t("searchPlaceholder")}
            className="w-full rounded-full border border-brand-line bg-white py-3.5 ps-11 pe-4 text-sm text-brand-ink shadow-[0_1px_2px_rgba(10,47,82,0.04)] outline-none transition-shadow focus:border-brand-blue/40 focus:shadow-md focus:shadow-brand-navy/[0.06] focus:ring-4 focus:ring-brand-blue/10"
          />
        </div>
      </div>

      <div className="sticky top-[98px] z-30 border-b border-brand-line/70 bg-white/95 backdrop-blur">
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <div className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="flex w-max gap-2 py-3">
              {filteredCategories.map((category) => (
                <button
                  key={category.slug}
                  type="button"
                  onClick={() => scrollToCategory(category.slug)}
                  className={`whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                    activeCategory === category.slug
                      ? "bg-brand-navy text-white shadow-sm shadow-brand-navy/25"
                      : "bg-brand-blue-light text-brand-navy hover:bg-brand-line"
                  }`}
                >
                  {category.name[language]}
                </button>
              ))}
            </div>
          </div>
          {/* Edge fades hint that the category bar scrolls, without adding arrows/controls. */}
          <div aria-hidden className="pointer-events-none absolute inset-y-0 start-0 w-6 bg-gradient-to-r from-white to-transparent sm:from-white" />
          <div aria-hidden className="pointer-events-none absolute inset-y-0 end-0 w-6 bg-gradient-to-l from-white to-transparent sm:from-white" />
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {filteredCategories.length === 0 && (
          <p className="py-16 text-center text-brand-muted">{t("noResults")}</p>
        )}

        {filteredCategories.map((category) => (
          <section
            key={category.slug}
            id={`category-${category.slug}`}
            ref={(el) => {
              sectionRefs.current[category.slug] = el;
            }}
            className="scroll-mt-[156px] py-6"
          >
            <div className="mb-4 flex items-center gap-3">
              <h2 className="font-heading text-xl font-bold text-brand-ink sm:text-2xl">
                {category.name[language]}
              </h2>
              <span aria-hidden className="h-px flex-1 bg-brand-line/70" />
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
              {category.items.map((item) => (
                <ProductCard key={item.slug} item={item} sizes="(min-width: 1024px) 220px, (min-width: 640px) 33vw, 45vw" />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
