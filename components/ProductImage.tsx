"use client";

import { useState } from "react";
import Image from "next/image";
import { useLanguage } from "@/lib/i18n";
import { CupIcon } from "@/components/icons";

type ProductImageProps = {
  slug: string;
  name: string;
  available: boolean;
  /** Mark true only for the one or two images likely to be the LCP element (e.g. the first Best Seller card). */
  priority?: boolean;
  sizes?: string;
  rounded?: string;
};

export function ProductImage({
  slug,
  name,
  available,
  priority = false,
  sizes = "(min-width: 1024px) 220px, (min-width: 640px) 33vw, 45vw",
  rounded = "rounded-t-3xl",
}: ProductImageProps) {
  const { t } = useLanguage();
  const [errored, setErrored] = useState(false);

  return (
    <div className={`relative aspect-square w-full overflow-hidden bg-brand-blue-light ring-1 ring-inset ring-black/[0.03] ${rounded}`}>
      {!errored && (
        <Image
          src={`/images/products/${slug}.webp`}
          alt={name}
          fill
          sizes={sizes}
          priority={priority}
          loading={priority ? undefined : "lazy"}
          className={`object-cover transition-transform duration-300 group-hover:scale-105 ${
            available ? "" : "grayscale opacity-60"
          }`}
          onError={() => setErrored(true)}
        />
      )}

      {errored && (
        <div className="relative flex h-full w-full flex-col items-center justify-center gap-2 overflow-hidden bg-gradient-to-br from-brand-navy via-brand-navy to-brand-blue">
          <div aria-hidden className="bg-grain pointer-events-none absolute inset-0 opacity-[0.07] mix-blend-overlay" />
          <span
            aria-hidden
            className="pointer-events-none absolute font-heading text-7xl font-bold text-white/[0.06] select-none"
          >
            SJ
          </span>
          <span className="relative flex h-11 w-11 items-center justify-center rounded-full bg-white/5 ring-1 ring-inset ring-white/15">
            <CupIcon className="h-5 w-5 text-white/85" />
          </span>
          <span className="relative font-heading text-[10px] font-semibold uppercase tracking-[0.22em] text-white/55">
            SJ Cafe
          </span>
        </div>
      )}

      {!available && (
        <div className="absolute inset-0 flex items-center justify-center bg-brand-ink/45">
          <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-brand-navy shadow-sm">
            {t("unavailable")}
          </span>
        </div>
      )}
    </div>
  );
}
