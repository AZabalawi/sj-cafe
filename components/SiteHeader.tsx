"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { Logo } from "@/components/Logo";
import { LanguageToggle } from "@/components/LanguageToggle";
import { OpenBadge } from "@/components/OpenBadge";
import { useLanguage } from "@/lib/i18n";
import { useCart } from "@/lib/cart";
import { business } from "@/data/business";
import { CartIcon } from "@/components/icons";

export function SiteHeader() {
  const { language } = useLanguage();
  const { totalQuantity } = useCart();
  const headerRef = useRef<HTMLElement>(null);

  // The header's rendered height varies by breakpoint (the logo alone goes
  // 48px -> 56px) and could in principle shift for other reasons (font
  // loading, a longer translated name). Anything elsewhere on the page that
  // needs to sit flush under the sticky header (the category nav's own
  // sticky offset, its scroll-margin-top) reads this variable instead of a
  // hardcoded pixel guess, so it can never drift out of sync again.
  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const setHeaderHeightVar = () => {
      document.documentElement.style.setProperty("--header-h", `${el.getBoundingClientRect().height}px`);
    };
    setHeaderHeightVar();
    const observer = new ResizeObserver(setHeaderHeightVar);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-40 bg-white/90 shadow-[0_1px_0_rgba(10,47,82,0.06)] backdrop-blur"
    >
      <div aria-hidden className="h-[3px] bg-gradient-to-r from-brand-navy via-brand-blue to-brand-sky" />
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          <Logo size="lg" linked={false} className="shrink-0" />
          <span className="flex min-w-0 flex-col gap-0.5">
            <span className="truncate font-heading text-base font-bold leading-tight tracking-tight text-brand-ink sm:text-lg">
              {business.name[language]}
            </span>
            <span className="flex items-center gap-1.5 text-xs text-brand-muted">
              <span className="truncate">{business.shortLocation[language]}</span>
              <span aria-hidden className="h-3 w-px bg-brand-line" />
              <OpenBadge tone="dark" size="sm" />
            </span>
          </span>
        </Link>

        <div className="flex shrink-0 items-center gap-2">
          <LanguageToggle />
          <Link
            href="/cart"
            aria-label="Cart"
            className="relative flex h-10 w-10 items-center justify-center rounded-full border border-brand-line bg-white text-brand-navy shadow-sm transition-all hover:-translate-y-0.5 hover:bg-brand-blue-light"
          >
            <CartIcon className="h-5 w-5" />
            {totalQuantity > 0 && (
              <span className="absolute -end-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-navy px-1 text-[10px] font-bold text-white shadow-sm ring-2 ring-white tabular-nums">
                {totalQuantity}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
