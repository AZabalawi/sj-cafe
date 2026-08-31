"use client";

import { business } from "@/data/business";
import { useLanguage } from "@/lib/i18n";
import { Logo } from "@/components/Logo";
import { MapPinIcon, PhoneIcon, ClockIcon } from "@/components/icons";

export function SiteFooter() {
  const { t, language } = useLanguage();
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-brand-line/70 bg-brand-cream">
      <div aria-hidden className="h-[3px] bg-gradient-to-r from-brand-navy via-brand-blue to-brand-sky" />
      <div className="mx-auto flex max-w-6xl flex-col gap-5 px-4 py-12 sm:px-6">
        <Logo />
        <div className="flex flex-col gap-2.5 text-sm text-brand-muted">
          <span className="flex items-center gap-2.5">
            <MapPinIcon className="h-4 w-4 shrink-0 text-brand-blue" />
            {business.address}
          </span>
          <span className="flex items-center gap-2.5">
            <PhoneIcon className="h-4 w-4 shrink-0 text-brand-blue" />
            <span dir="ltr">{business.phone.display}</span>
          </span>
          <span className="flex items-center gap-2.5">
            <ClockIcon className="h-4 w-4 shrink-0 text-brand-blue" />
            {business.hours.display[language]}
          </span>
        </div>
        <div className="flex flex-col gap-1 border-t border-brand-line/70 pt-5 text-xs text-brand-muted sm:flex-row sm:items-center sm:justify-between">
          <span>
            © {year} {business.name[language]}. {t("footerRights")}
          </span>
          <span>{t("footerPricesNote")}</span>
        </div>
      </div>
    </footer>
  );
}
