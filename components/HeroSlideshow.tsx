"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { menu } from "@/data/menu";
import { useLanguage } from "@/lib/i18n";
import { useProductDetail } from "@/lib/productDetail";
import { business } from "@/data/business";

const AUTOPLAY_MS = 3500;
const SWIPE_THRESHOLD_PX = 40;

// A short, curated mix — the cover shot plus a few of the most visually
// striking featured items. Deliberately smaller than the full "Popular at
// SJ" set below so the two sections don't feel redundant.
type Slide = { type: "cover" } | { type: "product"; slug: string };
const SLIDES: Slide[] = [
  { type: "cover" },
  { type: "product", slug: "san-sebastian-cheesecake" },
  { type: "product", slug: "pistachio-waffle" },
  { type: "product", slug: "iced-spanish-latte" },
  { type: "product", slug: "kinder-rain" },
];

const allItems = menu.flatMap((category) => category.items);

export function HeroSlideshow() {
  const { language } = useLanguage();
  const { open } = useProductDetail();
  const [index, setIndex] = useState(0);
  const pausedRef = useRef(false);
  const touchStartX = useRef<number | null>(null);
  const resumeTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    const id = setInterval(() => {
      if (pausedRef.current) return;
      setIndex((i) => (i + 1) % SLIDES.length);
    }, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, []);

  // Pausing on interaction (rather than stopping autoplay permanently) keeps
  // the slideshow touch-friendly without fighting a manual swipe or tap.
  const pauseThenResume = useCallback(() => {
    pausedRef.current = true;
    clearTimeout(resumeTimeoutRef.current);
    resumeTimeoutRef.current = setTimeout(() => {
      pausedRef.current = false;
    }, 5000);
  }, []);

  const goTo = (i: number) => {
    pauseThenResume();
    setIndex(((i % SLIDES.length) + SLIDES.length) % SLIDES.length);
  };

  const handleSlideClick = (slide: Slide) => {
    if (slide.type === "cover") {
      document.getElementById("menu")?.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      open(slide.slug);
    }
  };

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(delta) < SWIPE_THRESHOLD_PX) return;
    goTo(index + (delta < 0 ? 1 : -1));
  };

  return (
    <div className="mx-auto max-w-6xl px-4 pt-4 sm:px-6">
      <div
        className="relative h-40 w-full overflow-hidden rounded-3xl shadow-sm ring-1 ring-black/[0.04] sm:h-56"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {SLIDES.map((slide, i) => {
          const item = slide.type === "product" ? allItems.find((it) => it.slug === slide.slug) : undefined;
          const imageSrc = slide.type === "cover" ? "/images/sj-cafe-cover.webp" : `/images/products/${slide.slug}.webp`;
          const isActive = i === index;

          return (
            <div
              key={slide.type === "cover" ? "cover" : slide.slug}
              role="button"
              tabIndex={isActive ? 0 : -1}
              aria-hidden={!isActive}
              onClick={() => isActive && handleSlideClick(slide)}
              onKeyDown={(e) => {
                if (isActive && (e.key === "Enter" || e.key === " ")) {
                  e.preventDefault();
                  handleSlideClick(slide);
                }
              }}
              className="absolute inset-0 cursor-pointer transition-opacity duration-700 ease-out"
              style={{ opacity: isActive ? 1 : 0, pointerEvents: isActive ? "auto" : "none" }}
            >
              <Image
                src={imageSrc}
                alt={item ? item.name[language] : business.name[language]}
                fill
                priority={i === 0}
                sizes="(min-width: 1024px) 1152px, 100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-navy-deep/75 via-brand-navy-deep/15 to-transparent" />

              {slide.type === "cover" ? (
                <p className="absolute bottom-4 start-4 max-w-xs font-heading text-sm font-semibold text-white sm:bottom-5 sm:start-5 sm:text-base">
                  {business.tagline[language]}
                </p>
              ) : (
                item && (
                  <div className="absolute bottom-4 start-4 flex flex-col gap-1 sm:bottom-5 sm:start-5">
                    <span className="w-fit rounded-full bg-white/15 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/80 backdrop-blur-sm">
                      {language === "ar" ? "من قائمتنا" : "From our menu"}
                    </span>
                    <p className="font-heading text-sm font-bold text-white sm:text-lg">
                      {item.name[language]} · {item.price} {business.currency.label[language]}
                    </p>
                  </div>
                )
              )}
            </div>
          );
        })}

        <div
          className="absolute bottom-3 end-4 flex items-center gap-1.5 sm:bottom-4"
          onClick={(e) => e.stopPropagation()}
        >
          {SLIDES.map((slide, i) => (
            <button
              key={slide.type === "cover" ? "cover-dot" : `${slide.slug}-dot`}
              type="button"
              aria-label={`Slide ${i + 1}`}
              onClick={() => goTo(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? "w-5 bg-white" : "w-1.5 bg-white/50 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
