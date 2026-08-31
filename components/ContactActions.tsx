"use client";

import { business } from "@/data/business";
import { useLanguage } from "@/lib/i18n";
import { PhoneIcon, WhatsAppIcon, MapPinIcon } from "@/components/icons";

const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(business.mapsQuery)}`;

type ContactActionsProps = {
  variant?: "row" | "stack";
};

export function ContactActions({ variant = "row" }: ContactActionsProps) {
  const { t } = useLanguage();

  const layout = variant === "row" ? "flex flex-wrap gap-3" : "flex flex-col gap-3";

  return (
    <div className={layout}>
      <a
        href={`tel:${business.phone.href}`}
        className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-navy px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 active:scale-[0.98]"
      >
        <PhoneIcon className="h-4 w-4" />
        {t("call")}
      </a>
      <a
        href={`https://wa.me/${business.whatsapp.href}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 active:scale-[0.98]"
      >
        <WhatsAppIcon className="h-4 w-4" />
        {t("whatsapp")}
      </a>
      <a
        href={mapsHref}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center gap-2 rounded-full border border-brand-line px-5 py-3 text-sm font-semibold text-brand-navy transition-all hover:-translate-y-0.5 hover:bg-brand-blue-light"
      >
        <MapPinIcon className="h-4 w-4" />
        {t("getDirections")}
      </a>
    </div>
  );
}
