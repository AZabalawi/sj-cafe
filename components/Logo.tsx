"use client";

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { useLanguage } from "@/lib/i18n";

// The tightly-cropped real SJ Cafe logo (excess side margin trimmed from the
// original Talabat asset — see public/images/logo/README.md) is tried first,
// then the untrimmed original, then logo.svg/.png as manual-override slots.
// Drop a higher-quality file at either fallback path later and it takes over
// automatically, no code changes needed.
const LOGO_SOURCES = [
  "/images/logo/sj-cafe-logo-cropped.webp",
  "/images/logo/sj-cafe-logo.webp",
  "/images/logo/logo.svg",
  "/images/logo/logo.png",
];

// "lg" is responsive (48px mobile / 56px desktop) since the header displays
// it at a fixed height across breakpoints — both sit comfortably under the
// cropped asset's native 180px height, so it never looks soft.
const SIZE_CLASSES = {
  sm: "h-9",
  md: "h-11",
  lg: "h-12 sm:h-14",
} as const;

type LogoProps = {
  className?: string;
  /** Use a lighter wordmark for dark backgrounds (e.g. a dark banner). */
  tone?: "dark" | "light";
  /** Display height — see SIZE_CLASSES. */
  size?: keyof typeof SIZE_CLASSES;
  /** Set false when Logo is already nested inside another <Link> (e.g. the header) — renders a <span> instead of a second, invalid nested <a>. */
  linked?: boolean;
};

function LogoWrapper({
  linked,
  className,
  children,
}: {
  linked: boolean;
  className: string;
  children: ReactNode;
}) {
  if (linked) {
    return (
      <Link href="/" className={className} aria-label="SJ Cafe">
        {children}
      </Link>
    );
  }
  return (
    <span className={className} aria-label="SJ Cafe">
      {children}
    </span>
  );
}

export function Logo({ className, tone = "dark", size = "sm", linked = true }: LogoProps) {
  const { language } = useLanguage();
  const [sourceIndex, setSourceIndex] = useState(0);
  // The <img> is only rendered after mount (see below). On a statically
  // prerendered page a server-rendered <img> can finish failing to load
  // before React finishes hydrating and attaches onError (local 404s are
  // near-instant), so the fallback would never trigger. Deferring to a
  // client-only render guarantees the error listener exists first.
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional client-only render gate, see comment above
    setMounted(true);
  }, []);

  const noRealLogoYet = !mounted || sourceIndex >= LOGO_SOURCES.length;

  if (noRealLogoYet) {
    const textColor = tone === "light" ? "text-white" : "text-brand-navy";
    const badgeRing = tone === "light" ? "border-white/30 bg-white/10" : "border-brand-navy/15 bg-brand-blue-light";
    const monogramColor = tone === "light" ? "text-white" : "text-brand-navy";
    return (
      <LogoWrapper linked={linked} className={`inline-flex items-center gap-2.5 ${className ?? ""}`}>
        <span
          aria-hidden
          className={`flex ${SIZE_CLASSES[size]} aspect-square shrink-0 items-center justify-center rounded-full border ${badgeRing}`}
        >
          <span className={`font-heading text-xs font-bold tracking-[0.02em] ${monogramColor}`}>SJ</span>
        </span>
        <span className={`font-heading text-lg font-bold tracking-tight ${textColor}`}>
          {language === "ar" ? "كافيه" : "Cafe"}
        </span>
      </LogoWrapper>
    );
  }

  return (
    <LogoWrapper linked={linked} className={`inline-flex items-center ${className ?? ""}`}>
      {/* eslint-disable-next-line @next/next/no-img-element -- local placeholder-or-real asset, size unknown until owner supplies it */}
      <img
        src={LOGO_SOURCES[sourceIndex]}
        alt="SJ Cafe"
        className={`${SIZE_CLASSES[size]} w-auto rounded-md`}
        onError={() => setSourceIndex((i) => i + 1)}
      />
    </LogoWrapper>
  );
}
