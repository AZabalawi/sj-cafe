"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { CheckCircleIcon } from "@/components/icons";
import { useLanguage } from "@/lib/i18n";
import { business } from "@/data/business";
import { filsToAedLabel } from "@/lib/money";
import { getLastOrder, type DemoOrder } from "@/lib/orders";

export default function OrderConfirmationPage({ params }: { params: Promise<{ reference: string }> }) {
  const { reference } = use(params);
  const { language, t } = useLanguage();
  const [order, setOrder] = useState<DemoOrder | null | undefined>(undefined);

  useEffect(() => {
    // sessionStorage isn't available during server rendering, so this has to
    // happen in an effect rather than a lazy initializer (same reasoning as
    // LanguageProvider in lib/i18n.tsx).
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional client-only read, see comment above
    setOrder(getLastOrder(reference));
  }, [reference]);

  return (
    <>
      <SiteHeader />
      <main className="flex-1 pb-10">
        <div className="mx-auto max-w-lg px-4 pt-10 sm:px-6">
          {order === undefined ? null : order === null ? (
            <div className="flex flex-col items-center gap-4 rounded-3xl border border-dashed border-brand-line bg-white px-6 py-16 text-center">
              <p className="text-brand-muted">{t("orderNotFound")}</p>
              <Link href="/" className="inline-flex items-center justify-center rounded-full bg-brand-navy px-6 py-3 text-sm font-bold text-white">
                {t("backToHome")}
              </Link>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-6 rounded-3xl bg-white p-6 text-center shadow-sm ring-1 ring-brand-line/60 sm:p-8">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                <CheckCircleIcon className="h-8 w-8" />
              </span>
              <div>
                <h1 className="font-heading text-2xl font-bold text-brand-ink">{t("orderReceived")}</h1>
                <p className="mt-1 font-heading text-3xl font-bold tracking-wide text-brand-navy">{order.reference}</p>
              </div>
              <p className="text-sm text-brand-muted">{t("thankYouMessage")}</p>

              <div className="w-full rounded-2xl bg-brand-cream p-5 text-start">
                <ul className="flex flex-col gap-1.5 text-sm text-brand-muted">
                  {order.items.map((line) => (
                    <li key={line.slug} className="flex items-center justify-between gap-2">
                      <span className="truncate">
                        {line.qty}× {language === "ar" ? line.nameAr : line.nameEn}
                      </span>
                      <span className="shrink-0 font-medium text-brand-ink">
                        {filsToAedLabel(line.priceFils * line.qty)} {business.currency.label[language]}
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="mt-2 flex items-center justify-between border-t border-brand-line/70 pt-2 text-base font-bold text-brand-ink">
                  <span>{t("total")}</span>
                  <span>
                    {filsToAedLabel(order.totalFils)} {business.currency.label[language]}
                  </span>
                </div>
                <dl className="mt-3 flex flex-col gap-1 border-t border-brand-line/70 pt-3 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-brand-muted">{t("paymentMethod")}</dt>
                    <dd className="font-semibold text-brand-ink">{t("cashAtRestaurant")}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-brand-muted">{t("orderType")}</dt>
                    <dd className="font-semibold text-brand-ink">{order.orderType === "pickup" ? t("pickup") : t("carPickup")}</dd>
                  </div>
                </dl>
              </div>

              <p className="text-xs text-brand-muted">{t("demoDisclaimer")}</p>

              <Link
                href="/"
                className="inline-flex w-full items-center justify-center rounded-full bg-brand-navy px-6 py-3.5 text-sm font-bold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                {t("backToHome")}
              </Link>
            </div>
          )}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
