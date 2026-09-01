"use client";

import { useEffect, useState } from "react";
import { isOpenNow } from "@/lib/hours";
import { useLanguage } from "@/lib/i18n";

type OpenBadgeProps = {
  tone?: "dark" | "light";
  size?: "md" | "sm";
};

export function OpenBadge({ tone = "light", size = "md" }: OpenBadgeProps) {
  const { t } = useLanguage();
  const [open, setOpen] = useState<boolean | null>(null);

  useEffect(() => {
    const update = () => setOpen(isOpenNow());
    update();
    const id = setInterval(update, 60_000);
    return () => clearInterval(id);
  }, []);

  // Avoid a server/client mismatch flash — render nothing until we know.
  if (open === null) return null;

  const toneClasses =
    tone === "light"
      ? open
        ? "bg-emerald-400/15 text-emerald-200 ring-1 ring-inset ring-emerald-300/20"
        : "bg-white/10 text-white/70 ring-1 ring-inset ring-white/15"
      : open
        ? "bg-emerald-500/10 text-emerald-700 ring-1 ring-inset ring-emerald-500/15"
        : "bg-brand-blue-light text-brand-muted ring-1 ring-inset ring-brand-line";

  const sizeClasses = size === "sm" ? "gap-1.5 px-2 py-0.5 text-[11px]" : "gap-2 px-3.5 py-1.5 text-xs";

  return (
    <span className={`inline-flex items-center rounded-full font-semibold tracking-wide ${sizeClasses} ${toneClasses}`}>
      <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${open ? "bg-emerald-400 shadow-[0_0_0_3px_rgba(52,211,153,0.25)]" : "bg-current opacity-60"}`} />
      {size === "sm" ? (
        <>
          {/* Drops "Now" below sm — the header is tight on space there (see SiteHeader). */}
          <span className="hidden sm:inline">{open ? t("openNow") : t("closedNow")}</span>
          <span className="sm:hidden">{open ? t("openShort") : t("closedShort")}</span>
        </>
      ) : open ? (
        t("openNow")
      ) : (
        t("closedNow")
      )}
    </span>
  );
}
