"use client";

import { useLanguage } from "@/lib/i18n";
import { GlobeIcon } from "@/components/icons";

type LanguageToggleProps = {
  tone?: "dark" | "light";
};

export function LanguageToggle({ tone = "dark" }: LanguageToggleProps) {
  const { toggleLanguage, t } = useLanguage();

  const toneClasses =
    tone === "light"
      ? "border-white/30 text-white hover:bg-white/10"
      : "border-brand-line bg-white text-brand-navy shadow-sm hover:bg-brand-blue-light";

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-all hover:-translate-y-0.5 ${toneClasses}`}
    >
      <GlobeIcon className="h-4 w-4" />
      {t("switchLanguage")}
    </button>
  );
}
